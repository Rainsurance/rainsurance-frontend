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

import RainProductAbi from "../utils/RainProductCLFunctions.json";
import InstanceServiceAbi from "../utils/InstanceService.json";
import { destinations } from "../utils/destinations";
import { 
    formatDate,
    isFutureDate,
    b2s
} from '../lib/helpers';

const precipitationMultiplier = Number(process.env.NEXT_PUBLIC_PRECIPITATION_MULTIPLIER);
const percentageMultiplier = Number(process.env.NEXT_PUBLIC_PERCENTAGE_MULTIPLIER);
const usdcMultiplier = Number(process.env.NEXT_PUBLIC_USDC_MULTIPLIER);
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

    const risk = data.risk;
    const application = data.application;
    const claimsCount = Number(data.claimsCount);

    const cityId = risk.place.split("-")[0];
    var city = destinations.find((item) => item.id === cityId);
    if (!city) {
        city = { name: "Unknown" };
    }

    const sumInsured = Number(application.sumInsuredAmount) / usdcMultiplier;
    const sumInsuredUSD = USDollar.format(sumInsured);
    const refund = Number(sumInsured) * Number(risk.payoutPercentage);
    const refundUSD = USDollar.format(refund);

    const policy = {
        processId: data.processId,
        riskId: data.riskId,
        city,
        status,
        style,
        startDate: formatDate(Number(risk.startDate)),
        endDate: formatDate(Number(risk.endDate)),
        sumInsured,
        sumInsuredUSD,
        refund,
        refundUSD,
        avgPrec: Number(risk.precHist) / precipitationMultiplier,
        isActive: isFutureDate(Number(risk.endDate)),
        risk,
        application,
        claimsCount,
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
    const [policiesIds, setPoliciesIds] = useState([]);
    const [claiming, setClaiming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connectMessage, setConnectMessage] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [limit] = useState(3);
    const { address } = useAccount();

    async function getPoliceIds(walletAddress) {
        setLoading(true);
        console.log(`Pulling policeIds for address ${walletAddress}...`);
        await readContract({
            address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
            abi: RainProductAbi,
            functionName: "processIdsForHolder",
            args: [walletAddress],
        }).then((data) => {
            console.log("all policieIds", data);
            if (data.length > 0){
                setPoliciesIds(data.length > limit ? data.slice(limit).reverse(): data.reverse())
            } else {
                setPoliciesIds(null);
            }
            setLoading(false);
        });
    }

    async function getPolicyDetails(policyId) {
        console.log(`Pulling info for policy ${policyId}...`);
        return readContract({
            address: process.env.NEXT_PUBLIC_GIF_INSTANCE_SERVICE_ADDRESS,
            abi: InstanceServiceAbi,
            functionName: "getPolicy",
            args: [policyId],
        })
        .then((policy) => {
            console.log(`DONE! Info for policy ${policyId} is:`);
            console.log({...policy, processId: policyId});
            return {...policy, processId: policyId};
        })
    }

    async function getApplication(policy) {
        console.log(`Pulling application for policy ${policy.processId}...`);
        const application = readContract({
            address: process.env.NEXT_PUBLIC_GIF_INSTANCE_SERVICE_ADDRESS,
            abi: InstanceServiceAbi,
            functionName: "getApplication",
            args: [policy.processId],
        })
        return Promise.all([policy, application])
        .then(([policy, application]) => {
            console.log(`DONE! Application info for policy ${policy.processId} is:`);
            console.log({...policy, application});
            return {...policy, application};
        });
    }

    async function getRiskIdForPolicy(policy) {
        console.log(`Pulling riskId for policy ${policy.processId}...`);
        const riskId = readContract({
            address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
            abi: RainProductAbi,
            functionName: "getRiskIdForProcess",
            args: [policy.processId],
        })
        return Promise.all([policy, riskId])
        .then(([policy, riskId]) => {
            console.log(`DONE! RiskId for policy ${policy.processId} is:`);
            console.log(riskId);
            return {...policy, riskId};
        })
    }

    async function getRisk(policy) {
        console.log(`Pulling risk ${policy.riskId} for policy ${policy.processId}...`);
        const risk = readContract({
            address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
            abi: RainProductAbi,
            functionName: "getRisk",
            enabled: false,
            args: [policy.riskId],
        });
        return Promise.all([policy, risk])
        .then(([policy, risk]) => {
            console.log(`DONE! Risk for policy ${policy.processId} is:`);
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

    async function countClaims(policy) {
        console.log(`Count claims for policy ${policy.processId}...`);
        const claimsCount = readContract({
            address: process.env.NEXT_PUBLIC_GIF_INSTANCE_SERVICE_ADDRESS,
            abi: InstanceServiceAbi,
            functionName: "claims",
            args: [policy.processId],
        })
        return Promise.all([policy, claimsCount])
        .then(([policy, claimsCount]) => {
            console.log(`DONE! ${claimsCount} claims for policy ${policy.processId}`);
            return {...policy, claimsCount};
        })
    } 

    async function getPolicies() {
        setLoading(true);
        policiesIds.forEach((policyId) => {
            console.log(`Pulling policies ${policyId}...`)
            getPolicyDetails(policyId)
            .then(getApplication)
            .then(getRiskIdForPolicy)
            .then(getRisk)
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
        if (address && policiesIds && policiesIds.length == 0 && !loading) {
            getPoliceIds(address);
        }
    }, [address, policiesIds, loading]);

    useEffect(() => {
        if (!address) {
            console.log("No wallet connected");
            setConnectMessage("Please connect your wallet to see your policies");
        }
        if (address && policiesIds && policiesIds.length == 0) {
            console.log("No policy was found for this address");
            setConnectMessage("No policy was found for this address");
        }
        if (address && policiesIds && policiesIds.length > 0) {
            setConnectMessage("");
            getPolicies()
        }
    }, [address, policiesIds]);

    useEffect(() => {
        console.log("policies is:", policies);
    }, [policies]);

    return (
        <Layout title="Policies">
            <Policies>
                <h2>Policies</h2>
                { loading && <Loading /> }
                { !loading && connectMessage && <BackupText>{ connectMessage }</BackupText> }
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
