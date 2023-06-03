import Layout from "@/layout/Layout";
import IconRain from "../../public/icons/icon-rain-blue-2.png";
import IconPlane from "../../public/icons/icon-plane.png";
import IconCalendar from "../../public/icons/icon-calendar-blue.png";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import {
    Policies,
    Container,
    ContainerItem,
    ContainerItemTop,
    ContainerBody,
    ContainerCalendar,
    ContainerRain,
    ContainerBodyItem,
    Status,
} from "@/styles/policies";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useContractRead, useAccount } from "wagmi";
import { readContract } from "@wagmi/core";

import { ethers } from "ethers";
import RainProductAbi from "../utils/RainProductCLFunctions.json";
import InstanceServiceAbi from "../utils/InstanceService.json";
import { destinations } from "../utils/destinations";

const precipitationMultiplier = Number(process.env.PRECIPITATION_MULTIPLIER);
const usdcMultiplier = 1e6;

const RISK_STATUS = {
    ACTIVE: {
        label: "'Policy is active'",
        color: "#0072ff",
        processable: false,
        claimable: false,
    },
    INACTIVE: {
        label: "",
        color: "",
        processable: true,
        claimable: false,
    },
    PENDING: {
        label: "'Checking weather...'",
        color: "#0072ff",
        processable: false,
        claimable: false,
    },
    APPROVED: {
        label: "'Risk approved'",
        color: "#19cd14",
        processable: false,
        claimable: true,
    },
    REJECTED: {
        label: "'Risk rejected'",
        color: "#d03537",
        processable: false,
        claimable: false,
    },
};

const PAYOUT_STATUS = {
    PENDING: {
        label: "",
        color: "",
        requested: false,
        paid_out: false,
    },
    REQUESTED: {
        label: "'Payment requested'",
        color: "#0072ff",
        requested: true,
        paid_out: false,
    },
    PAID_OUT: {
        label: "'Payout done'",
        color: "#19cd14",
        requested: true,
        paid_out: true,
    },
};

function b2s(input) {
    return ethers.decodeBytes32String(input);
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

function isFutureDate(timestamp) {
    return timestamp * 1000 > new Date().getTime();
}

function preparePolicy(data) {
    const cityId = b2s(data.placeId).split("-")[0];
    var city = destinations.find((item) => item.id === cityId);
    if (!city) {
        city = { name: "Unknown" };
    }
    return {
        processId: data.processId,
        riskId: data.riskId,
        city,
        startDate: formatDate(Number(data.startDate)),
        endDate: formatDate(Number(data.endDate)),
        sumInsured: Number(data.sumInsured) / usdcMultiplier,
        avgPrec: Number(data.precHist) / precipitationMultiplier,
        isActive: isFutureDate(Number(data.endDate)),
    };
}

//ApplicationState {Applied, Revoked, Underwritten, Declined}
//PolicyState {Active, Expired, Closed}
//ClaimState {Applied, Confirmed, Declined, Closed}
//PayoutState {Expected, PaidOut}
function preparePayout(data) {
    let payoutStatus;
    if (data.state == 0) {
        payoutStatus = "PENDING";
    } else if (data.state == 2) {
        payoutStatus = "PAID_OUT";
    } else {
        payoutStatus = "REQUESTED";
    }
    return {
        ...data,
        status: PAYOUT_STATUS[payoutStatus],
    };
}

function prepareRisk(policyActive, data) {
    let riskStatus;
    if (!policyActive && data.requestTriggered) {
        if (data.responseAt > 0) {
            if (data.payoutPercentage == 0) {
                riskStatus = "REJECTED";
            } else if (data.payoutPercentage > 0) {
                riskStatus = "APPROVED";
            }
        } else {
            riskStatus = "PENDING";
        }
    } else if (!policyActive) {
        riskStatus = "INACTIVE";
    } else {
        riskStatus = "ACTIVE";
    }
    return {
        ...data,
        status: RISK_STATUS[riskStatus],
    };
}

const PoliciesView = () => {
    const [policies, setPolicies] = useState([]);
    const [policiesIdx, setPoliciesIdx] = useState(null);
    const [claiming, setClaiming] = useState(false);
    const [connectMessage, setConnectMessage] = useState("");
    const [limit] = useState(10);
    const { address } = useAccount();

    async function getPoliceIds(walletAddress) {
        console.log(`getPoliceIds for address ${address}...`);
        await readContract({
            address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
            abi: RainProductAbi,
            functionName: "processIdsForHolder",
            args: [walletAddress],
        }).then((data) => {
            console.log("all policieIds", data);
            if(data.length > 0) {
                setPoliciesIdx(Array(limit).fill().map((_, i) => data.length - 1 - i));
            } else {
                setPoliciesIdx(null);
            }
        });
    }

    async function getPayout(policy) {
        console.log(`Pulling details for policyId ${policy.processId}...`);
        const payout = readContract({
            address: process.env.NEXT_PUBLIC_INSTANCE_SERVICE_ADDRESS,
            abi: InstanceServiceAbi,
            functionName: "getPolicy",
            args: [policy.processId],
        })
        return Promise.all([policy, payout])
        .then(([policy, payout]) => {
            console.log(`DONE! PAYOUT for policy ${policy.processId} is:`);
            console.log(payout);
            return {...policy, payout: preparePayout(payout)};
        })
    }

    async function getApplication(policy) {
        console.log(`Pulling application for policyId ${policy.processId}...`);
        const application = readContract({
            address: process.env.NEXT_PUBLIC_INSTANCE_SERVICE_ADDRESS,
            abi: InstanceServiceAbi,
            functionName: "getApplication",
            args: [policy.processId],
        })
        return Promise.all([policy, application])
        .then(([policy, application]) => {
            console.log(`DONE! APPLICATION for policy ${policy.processId} is:`);
            console.log(application);
            return {...policy, application};;
        });
    }

    async function getRisk(policy) {
        console.log(`Pulling riskId ${policy.riskId}...`);
        const risk = readContract({
            address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
            abi: RainProductAbi,
            functionName: "getRisk",
            enabled: false,
            args: [policy.riskId],
        });
        return Promise.all([policy, risk])
        .then(([policy, risk]) => {
            console.log(`DONE! RISK for policy ${policy.processId} is:`);
            console.log(risk);
            return {...policy, risk: prepareRisk(policy.isActive, risk)};
        })
    }

    async function pullPolicy(walletAddress, idx) {
        console.log(`Pulling policy idx ${idx}...`);
        return readContract({
            address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
            abi: RainProductAbi,
            functionName: "processForHolder",
            args: [walletAddress, idx],
        })
        .then((policy) => {
            console.log(`DONE! Policy ${idx} is:`);
            console.log(policy);
            return preparePolicy(policy);
        })
    }

    async function getPolicies() {
        console.log(`Pulling policies for address ${address} with idx ${policiesIdx}...`)
        policiesIdx.forEach((idx) => {
            pullPolicy(address, idx)
            .then(getRisk)
            .then(getApplication)
            .then(getPayout)
            .then((policy) => {
                addPolicy(policy);
            })
        });
    }

    function addPolicy(newPolicy) {
        console.log(`Adding Policy...`);
        setPolicies((oldArray) => [
            // eslint-disable-next-line no-undef
            ...new Map(
                [...oldArray, newPolicy].map((item) => [
                    item["processId"],
                    item,
                ])
            ).values(),
        ]);
    }

    async function processPolicy(endpoint, policy) {
        if (claiming) {
            return;
        }
        setClaiming(true);
        if (endpoint == "process") {
            policy.risk.status = RISK_STATUS["PENDING"];
        } else {
            policy.payout.status = PAYOUT_STATUS["REQUESTED"];
        }
        addPolicy(policy);
        const response = await fetch(`/api/policies/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ policyId: policy.processId }),
        });
        const data = await response.json();
        console.log("tx", data.tx);
        setClaiming(false);
    }

    async function confirmationDialog(title, message, policy, endpoint) {
        confirmAlert({
            title: title,
            message: message,
            buttons: [
                {
                    label: "Yes",
                    onClick: () => processPolicy(endpoint, policy),
                },
                {
                    label: "No",
                    onClick: () => null,
                },
            ],
        });
    }

    useEffect(() => {
        if (address && !policiesIdx) {
            getPoliceIds(address);
        }
    }, [address, policiesIdx]);

    useEffect(() => {
        if (!address) {
            setConnectMessage("Please connect your wallet to see your policies");
            setPolicies([]);
            setPoliciesIdx(null);
        }
        if (address && !policiesIdx) {
            setConnectMessage("No policy was found for this address");
        }
        if (address && policiesIdx) {
            setConnectMessage("");
            getPolicies()
        }
    }, [address, policiesIdx]);

    useEffect(() => {
        console.log("policies is:", policies);
    }, [policies]);

    return (
        <Layout>
            <Policies>
                <h2>Policies</h2>
                <div>{ connectMessage }</div>
                <Container>
                    {policies.map((item) => (
                        <ContainerItem key={item.processId}>
                            <ContainerItemTop>
                                <h3>
                                    <Image
                                        src={IconPlane}
                                        width={19}
                                        height={19}
                                        alt="IconPlane"
                                    />
                                    {item.city.name}
                                </h3>
                                {item.payout?.status["requested"] ? (
                                    <Status
                                        content={item.payout?.status["label"]}
                                        color={item.payout?.status["color"]}
                                    />
                                ) : (
                                    <Status
                                        content={item.risk?.status["label"]}
                                        color={item.risk?.status["color"]}
                                    />
                                )}
                            </ContainerItemTop>
                            <ContainerBody>
                                <ContainerBodyItem>
                                    <ContainerCalendar>
                                        <Image
                                            src={IconCalendar}
                                            width={30}
                                            height={30}
                                            alt="Period"
                                        />
                                        <p>
                                            {item.startDate} <br />
                                            {item.endDate}
                                        </p>
                                    </ContainerCalendar>
                                    <ContainerRain>
                                        <Image
                                            src={IconRain}
                                            width={25}
                                            height={25}
                                            alt="Average Precipitation"
                                        />
                                        <p>{item.avgPrec} mm</p>
                                    </ContainerRain>
                                </ContainerBodyItem>
                                {item.risk?.status["processable"] && (
                                    <Link
                                        href=""
                                        onClick={() =>
                                            confirmationDialog(
                                                "Process confirmation",
                                                "Are you sure you want to check the weather for this policy?",
                                                item,
                                                "process"
                                            )
                                        }
                                    >
                                        Process
                                    </Link>
                                )}
                                {item.risk?.status["claimable"] &&
                                    !item.payout?.status["requested"] && (
                                        <Link
                                            href=""
                                            onClick={() =>
                                                confirmationDialog(
                                                    "Claim confirmation",
                                                    "Are you sure you want to claim this policy?",
                                                    item,
                                                    "claim"
                                                )
                                            }
                                        >
                                            Claim
                                        </Link>
                                    )}
                            </ContainerBody>
                        </ContainerItem>
                    ))}
                </Container>
            </Policies>
        </Layout>
    );
};
export default PoliciesView;
