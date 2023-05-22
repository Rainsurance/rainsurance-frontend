import Layout from "@/layout/Layout";
import IconRain from "../../public/icons/icon-rain-blue-2.png";
import IconPlane from "../../public/icons/icon-plane.png";
import IconCalendar from "../../public/icons/icon-calendar-blue.png";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import Modal from "@/components/ModalTemplate/modal";
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
    ModalCStatus,
    H3Modal,
} from "@/styles/policies";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useContractRead, useAccount } from "wagmi";
import { readContract } from "@wagmi/core";

import { ethers } from "ethers";
import RainProductAbi from "../utils/RainProduct.json";
import { destinations } from "../utils/destinations";

const RISK_STATUS = {
    ACTIVE: { label: "", color: "", processable: true, claimable: false },
    PENDING: {
        label: "'Pendent'",
        color: "#0072ff",
        processable: false,
        claimable: false,
    },
    APPROVED: {
        label: "'Approved'",
        color: "#19cd14",
        processable: false,
        claimable: true,
    },
    REJECTED: {
        label: "'Rejected'",
        color: "#d03537",
        processable: false,
        claimable: false,
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
        sumInsured: Number(data.sumInsured) / 1e6,
        avgPrec: Number(data.aph),
        isActive: isFutureDate(Number(data.endDate)),
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
    } else {
        riskStatus = "ACTIVE";
    }
    return {
        ...data,
        status: RISK_STATUS[riskStatus],
    };
}

const PoliciesView = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [policiesIds, setPolicieIds] = useState([]);
    const [riskId, setRiskId] = useState(null);
    const [claiming, setClaiming] = useState(false);
    const { address } = useAccount();

    useContractRead({
        address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
        abi: RainProductAbi,
        functionName: "processIdsForHolder",
        structuralSharing: (prev, next) => (prev === next ? prev : next),
        args: [address],
        onSuccess(data) {
            setPolicieIds(data);
        },
    });

    const { refetch: getRisk } = useContractRead({
        address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
        abi: RainProductAbi,
        functionName: "getRisk",
        enabled: false,
        args: [riskId],
        onSuccess(data) {
            const policy = policies.find((item) => item.riskId === data.id);
            if (policy) {
                addPolicy({
                    ...policy,
                    risk: prepareRisk(policy.isActive, data),
                });
            }
        },
    });

    function addPolicy(newPolicy) {
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

    async function getPolicies() {
        var idx = 0;
        for (let policyId of policiesIds) {
            console.log(`Pulling policyId ${policyId} idx ${idx}...`);
            await readContract({
                address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
                abi: RainProductAbi,
                functionName: "processForHolder",
                args: [address, idx],
            }).then((policy) => {
                console.log(`policy ${idx} is:`);
                console.log(policy);
                setRiskId(policy.riskId);
                addPolicy(preparePolicy(policy));
            });
            idx += 1;
        }
    }

    async function processPolicy(endpoint, policyId) {
        if (claiming) {
            return;
        }
        setClaiming(true);
        const response = await fetch(`/api/policies/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ policyId }),
        });
        const data = await response.json();
        console.log("tx", data.tx);
        setClaiming(false);
        setModalOpen(true);
    }

    async function confirmationDialog(title, message, policyId, endpoint) {
        confirmAlert({
            title: title,
            message: message,
            buttons: [
                {
                    label: "Yes",
                    onClick: () => processPolicy(endpoint, policyId),
                },
                {
                    label: "No",
                    onClick: () => null,
                },
            ],
        });
    }

    useEffect(() => {
        console.log("policiesIds is:", policiesIds);
        getPolicies();
    }, [policiesIds]);

    useEffect(() => {
        console.log("riskId is:", riskId);
        if (riskId !== null) {
            getRisk();
        }
    }, [riskId]);

    useEffect(() => {
        console.log("policies is:", policies);
    }, [policies]);

    return (
        <Layout>
            <Policies>
                <h2>Policies</h2>

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
                                <Status
                                    content={item.risk?.status["label"]}
                                    color={item.risk?.status["color"]}
                                />
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
                                {item.risk?.status["claimable"] && (
                                    <Link
                                        href=""
                                        onClick={() =>
                                            confirmationDialog(
                                                "Claim confirmation",
                                                "Are you sure you want to claim this policy?",
                                                item.id,
                                                "claim"
                                            )
                                        }
                                    >
                                        Claim
                                    </Link>
                                )}
                                {item.risk?.status["processable"] && (
                                    <Link
                                        href=""
                                        onClick={() =>
                                            confirmationDialog(
                                                "Process confirmation",
                                                "Are you sure you want to check the weather for this policy?",
                                                item.id,
                                                "process"
                                            )
                                        }
                                    >
                                        Process
                                    </Link>
                                )}
                            </ContainerBody>
                        </ContainerItem>
                    ))}
                </Container>

                <Modal
                    isOpen={modalOpen}
                    setIsOpen={setModalOpen}
                    closeButton={true}
                    backModalClick={true}
                    escapeClose={false}
                >
                    {selectedItem !== null && (
                        <ModalCStatus>
                            <H3Modal
                                colorStatus={selectedItem?.modalTitleColor}
                            >
                                <img
                                    src={selectedItem?.iconModalStatus}
                                    alt={selectedItem?.modalStatus}
                                />
                                {selectedItem?.modalStatus}
                            </H3Modal>
                            <p>{selectedItem?.txtModal}</p>
                        </ModalCStatus>
                    )}
                </Modal>
            </Policies>
        </Layout>
    );
};
export default PoliciesView;
