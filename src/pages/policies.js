import Layout from "@/layout/Layout";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import Loading from '@/components/Loading';
import BackupText from '@/components/BackupText';
import PolicyBox from '@/components/PolicyBox';
import Modal from '@/components/ModalTemplate/modal';
import {
    Policies,
    Container,
    ModalCStatus,
    H3Modal
} from "@/styles/policies";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";

import { ethers } from "ethers";
import RainProductAbi from "../utils/RainProductCLFunctions.json";
import InstanceServiceAbi from "../utils/InstanceService.json";
import { destinations } from "../utils/destinations";

const precipitationMultiplier = Number(process.env.NEXT_PUBLIC_PRECIPITATION_MULTIPLIER);
const percentageMultiplier = Number(process.env.NEXT_PUBLIC_PERCENTAGE_MULTIPLIER);
const usdcMultiplier = 1e6;
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const COLOR_BLUE = "#0072ff";
const COLOR_GREEN = "#19cd14";
const COLOR_RED = "#d03537";
const COLOR_GRAY = "#4b4f55";

const FILTER_BLUE = "invert(29%) sepia(36%) saturate(5992%) hue-rotate(205deg) brightness(102%) contrast(107%)";
const FILTER_GREEN = "invert(57%) sepia(77%) saturate(1343%) hue-rotate(74deg) brightness(94%) contrast(106%)";
const FILTER_RED = "invert(24%) sepia(66%) saturate(2718%) hue-rotate(340deg) brightness(90%) contrast(90%)";

const ICON_BLUE = '/icons/icon-pending.png'
const ICON_GREEN = '/icons/icon-approved.png'
const ICON_RED = '/icons/icon-rejected.png'

function b2s(input) {
    //return ethers.decodeBytes32String(input); //v5
    return ethers.utils.parseBytes32String(input); //v6
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

function isFutureDate(timestamp) {
    return timestamp * 1000 > new Date().getTime();
}

function policyState(policy) {

    // ApplicationState {Applied, Revoked, Underwritten, Declined}
    // PolicyState {Active, Expired, Closed}
    // ClaimState {Applied, Confirmed, Declined, Closed}
    // PayoutState {Expected, PaidOut}
    
    //  0  (A) application_pending -> ApplicationState.Applied(0) -> gray / no action
    //     (B) application_approved -> ApplicationState.Underwritten(2)
    //  1    B.1 policy_active -> blue / no action
    //       B.2 policy_inactive
    //  2       B.2.1 risk_process_pending -> Risk.requestTriggered == false -> blue / *processable*
    //          B.2.2 risk_process_requested -> Risk.requestTriggered == true
    //  3           B.2.2.1 risk_pending -> Risk.responseAt == 0 -> blue / no action
    //  4           B.2.2.2 risk_approved -> Risk.responseAt > 0 && payoutPercentage > 0 -> green / *claimable*
    //  5           B.2.2.3 risk_rejected -> Risk.responseAt > 0 && payoutPercentage == 0 -> red / no action
    //          B.2.3 payout_requested
    //  6           B.2.3.1 payout_pending -> blue / no action
    //  7           B.2.3.2 payout_paid -> green / no action
    //  8  (C) application_declined_revoked -> ApplicationState.Revoked_Declined(1_3) -> gray / no action

    let status;
    let style = {
        label: "",
        color: COLOR_BLUE,
        processable: false,
        claimable: false,
        canceled: false,
        filter: false,
        modal: false,
        modalIcon: "",
    }
    if (policy.application.state == 0) {
        status = 0;
        style = {...style,
            label: "Under review",
            color: COLOR_GRAY,
            canceled: true,
        };
    } else if (policy.application.state == 2) {
        if (policy.isActive) {
            status = 1;
            style = {...style,
                label: "Policy is active",
                color: COLOR_BLUE,
            };
        } else if (policy.risk.requestTriggered == false) {
            status = 2;
            style = {...style,
                processable: true,
            };
        } else if (policy.risk.requestTriggered == true) {
            if (policy.risk.responseAt == 0) {
                status = 3;
                style = {...style,
                    label: "Checking weather...",
                    color: COLOR_BLUE,
                    filter: FILTER_BLUE,
                    modal: "Please wait a few moments. We are gathering weather data from our partners (Chainlink & MeteoBlue)",
                    modalIcon: ICON_BLUE,
                };
            } else if (policy.risk.responseAt > 0) {
                const defaultModalText = `It rained for ${policy.risk.precDaysActual} day(s) during the period covered by this policy.
                    The average daily rainfall was ${policy.risk.precActual}mm. <br />
                    The condition for executing the policy is: ${policy.risk.precDays} or more rainy days with a daily rain average of ${policy.risk.precHist}mm.`;
                if (policy.risk.payoutPercentage > 0) {
                    if (policy.claimsCount == 0) {
                        status = 4;
                        style = {...style,
                            label: "Risk approved",
                            color: COLOR_GREEN,
                            filter: FILTER_GREEN,
                            modal: `${defaultModalText} <br />
                                Thus you are entitled to a refund of ${policy.refundUSD}. <br />
                                Please claim the refund by clicking in the button below.`,
                            modalIcon: ICON_GREEN,
                            claimable: true,
                        };
                    } else {
                        if (policy.details.state == 0) {
                            status = 6;
                            style = {...style,
                                label: "Processing payout...",
                                color: COLOR_BLUE,
                                filter: FILTER_BLUE,
                            };
                        } else {
                            status = 7;
                            style = {...style,
                                label: "Payout processed",
                                color: COLOR_GREEN,
                                filter: FILTER_GREEN,
                                modal: `Please check you wallet. You should have already received your refund.`,
                                modalIcon: ICON_GREEN,
                            };
                        }
                    }
                } else {
                    status = 5;
                    style = {...style,
                        label: "Risk rejected",
                        color: COLOR_RED,
                        filter: FILTER_RED,
                        modal: `${defaultModalText} <br />
                            Thus you are not entitled to a refund.`,
                        modalIcon: ICON_RED,
                    };
                }
                
            }
        }
    } else {
        status = 8;
        style = {
            label: "Under review",
            color: COLOR_GRAY,
            canceled: true,
        };
    }

    return {status, style};
}

function preparePolicy(data) {
    const cityId = b2s(data.placeId).split("-")[0];
    var city = destinations.find((item) => item.id === cityId);
    if (!city) {
        city = { name: "Unknown" };
    }

    const sumInsured = Number(data.sumInsured) / usdcMultiplier;
    const sumInsuredUSD = USDollar.format(sumInsured);
    const refund = Number(sumInsured) * Number(data.risk.payoutPercentage);
    const refundUSD = USDollar.format(refund);

    const policy = {
        processId: data.processId,
        riskId: data.riskId,
        city,
        status,
        style,
        startDate: formatDate(Number(data.startDate)),
        endDate: formatDate(Number(data.endDate)),
        sumInsured,
        sumInsuredUSD,
        refund,
        refundUSD,
        avgPrec: Number(data.precHist) / precipitationMultiplier,
        isActive: isFutureDate(Number(data.endDate)),
        risk: data.risk,
        application: data.application,
        details: data.details,
        claimsCount: Number(data.claimsCount),
    }
    
    const {status, style} = policyState(policy);

    return {
        ...policy,
        status,
        style
    };
}

const PoliciesView = () => {
    const [policies, setPolicies] = useState([]);
    const [policiesIdx, setPoliciesIdx] = useState(null);
    const [claiming, setClaiming] = useState(false);
    const [loading, setLoading] = useState(true);
    const [connectMessage, setConnectMessage] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [limit] = useState(3);
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
                setPoliciesIdx(Array(Math.min(data.length, limit)).fill().map((_, i) => data.length - 1 - i));
            } else {
                setPoliciesIdx(null);
            }
        });
    }

    async function getDetails(policy) {
        console.log(`Pulling details for policyId ${policy.processId}...`);
        const details = readContract({
            address: process.env.NEXT_PUBLIC_INSTANCE_SERVICE_ADDRESS,
            abi: InstanceServiceAbi,
            functionName: "getPolicy",
            args: [policy.processId],
        })
        return Promise.all([policy, details])
        .then(([policy, details]) => {
            console.log(`DONE! DETAILS for policy ${policy.processId} is:`);
            console.log(details);
            return {...policy, details};
        })
    }

    async function countClaims(policy) {
        console.log(`Count claims for policyId ${policy.processId}...`);
        const claimsCount = readContract({
            address: process.env.NEXT_PUBLIC_INSTANCE_SERVICE_ADDRESS,
            abi: InstanceServiceAbi,
            functionName: "claims",
            args: [policy.processId],
        })
        return Promise.all([policy, claimsCount])
        .then(([policy, claimsCount]) => {
            console.log(`DONE! ${claimsCount} CLAIMS for policy ${policy.processId}`);
            return {...policy, claimsCount};
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
            return {...policy, application};
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
            return {...policy, 
                        risk: {...risk, 
                            precActual: Number(risk.precActual) / precipitationMultiplier,
                            precHist: Number(risk.precHist) / precipitationMultiplier,
                            payoutPercentage: Number(risk.payoutPercentage) / percentageMultiplier,
                        }
                    };
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
            return policy;
        })
    }

    async function getPolicies() {
        console.log(`Pulling policies for address ${address} with idx ${policiesIdx}...`)
        setLoading(true);
        policiesIdx.forEach((idx) => {
            pullPolicy(address, idx)
            .then(getRisk)
            .then(getApplication)
            .then(getDetails)
            .then(countClaims)
            .then((policy) => {
                addPolicy(preparePolicy(policy));
                setLoading(false);
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
            policy.risk.requestTriggered = true;
        } else {
            policy.claimsCount += 1;
        }
        const {status, style} = policyState(policy);
        addPolicy({ ...policy, status, style });
        const response = await fetch(`/api/policies/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ policyId: policy.processId, riskId: policy.riskId }),
        });
        const data = await response.json();
        console.log("requestTxReceipt", data);
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

    const handleOpenModal = (item) => {
        if (item.style.modal) {
            setSelectedItem(item);
            setModalOpen(true);
        }
      };    

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
                { loading && <Loading /> }
                { !loading && <BackupText>{ connectMessage }</BackupText> }
                <Container>
                    {policies.map((item) => (
                        <PolicyBox
                            item={item}
                            confirmationDialog = {confirmationDialog}
                            handleOpenModal = {handleOpenModal}
                            key={item.processId}
                        />
                    ))}
                </Container>
                <Modal
                    isOpen={modalOpen}
                    setIsOpen={setModalOpen}
                    closeButton={true}
                    backModalClick={true}
                    escapeClose={false}
                >
                    <ModalCStatus>
                        <H3Modal colorStatus={selectedItem?.style.color}>
                            <img src={selectedItem?.style.modalIcon} alt="status" />
                            { selectedItem?.style.label }
                        </H3Modal>
                        <p dangerouslySetInnerHTML={{__html: selectedItem?.style.modal}} />
                        </ModalCStatus>
                </Modal>
            </Policies>
        </Layout>
    );
};
export default PoliciesView;
