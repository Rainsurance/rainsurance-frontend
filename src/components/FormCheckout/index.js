import {
    EnvFormCheckout,
    ItemFormCheckout,
    EnvPayment,
    EnvClickPayment,
    ClickPayment,
    PaymentItem,
    ContentPix,
    CreditCard,
    Wallet,
    // ClickCopy,
} from "./styles";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import IconPix from "../../../public/icons/icon-pix.png";
import IconCCard from "../../../public/icons/icon-credit-card.png";
import IconPWallet from "../../../public/icons/icon-wallet.png";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useContractWrite,
    usePrepareContractWrite,
    useContractRead,
    useWaitForTransaction,
    useAccount,
    erc20ABI,
} from "wagmi";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import RainProductAbi from "../../utils/RainProductCLFunctions.json";

const createUseFormSchema = z.object({
    name: z.string().nonempty("Full name is required"),
    doc: z.string().nonempty("Tax id is required"),
    email: z
        .string()
        .email("Email is required and needs to be a valid email address"),
});

const FormCheckout = ({ setSimulation, simulation }) => {
    const [activeButton, setActiveButton] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [customer, setCustomer] = useState(false);
    const [transaction, setTransaction] = useState("");
    const [step, setStep] = useState(0); // 1 = riskId / 2 = creating risk / 3 = risk found or created / 4 = approving / 5 = approved / 6 = creating policy / 7 = policy created
    const { address } = useAccount();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createUseFormSchema),
    });

    const { data: riskId, refetch: getRiskId } = useContractRead({
        address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
        abi: RainProductAbi,
        functionName: "getRiskId",
        enabled: false,
        args: [
            simulation.place?.placeId,
            simulation.startDate / 1000,
            simulation.endDate / 1000,
        ],
        onSuccess(riskId) {
            console.log("getRiskId success", riskId);
            setSimulation({ ...simulation, riskId });
            setStep(1);
        },
    });

    const { data: risk, refetch: getRisk } = useContractRead({
        address: process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
        abi: RainProductAbi,
        functionName: "getRisk",
        enabled: false,
        args: [riskId],
        onSuccess(risk) {
            console.log("getRisk success", risk);
            if (risk && risk.createdAt > 0) {
                console.log("Existing risk!");
                setStep(3);
            } else {
                createRisk();
            }
        },
    });

    useWaitForTransaction({
        hash: transaction,
        onSuccess(data) {
            console.log("transaction success", data);
            if (step <= 3) {
                console.log("Risk created successfully!", data);
                getRisk();
            }
            if (step == 6) {
                console.log("Policy created successfully!", data);
                setStep(7);
            }
        },
    });

    const { config } = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_USDC_ADDRESS,
        abi: erc20ABI,
        functionName: "approve",
        args: [
            process.env.NEXT_PUBLIC_INSTANCE_TREASURY_ADDRESS,
            ethers.parseUnits(simulation.premium, 6),
        ],
    });

    const { write: approve } = useContractWrite({
        ...config,
        onError(error) {
            console.log("approve onError", error);
            setSubmitting(false);
            setStep(3);
        },
        onMutate() {
            setSubmitting(true);
            setStep(4);
        },
        onSuccess(data) {
            console.log("approve onSuccess", { data });
            setSubmitting(false);
            setStep(5);
        },
    });

    async function createRisk() {
        if (submitting) {
            return;
        }
        setSubmitting(true);
        console.log("Creating risk...");
        const response = await fetch("/api/risks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(simulation),
        });
        const data = await response.json();
        console.log("tx", data.tx);
        setTransaction(data.tx.hash);
        setSubmitting(false);
        setStep(2);
    }

    async function applyForPolicy() {
        console.log("applyForPolicy");
        console.log(customer);
        if (submitting) {
            return;
        }
        console.log({ ...simulation, ...customer })
        setSimulation({ ...simulation, ...customer });
        setSubmitting(true);
        console.log("Creating policy...");
        setStep(6);
        const response = await fetch("/api/policies/apply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                premium: simulation.premium,
                sumInsured: simulation.amount,
                riskId,
                customer: { ...customer, wallet: address },
            }),
        });
        const data = await response.json();
        console.log("response", data);
        //setTransaction(data.tx.hash);
        setSubmitting(false);
        setStep(7);
    }

    function submit(form) {
        setCustomer(form);
        if (activeButton > 0) {
            alert("Payment option not available");
            return;
        }
        if (submitting) {
            return;
        }
        if (step <= 5) {
            approve();
        }
    }

    useEffect(() => {
        console.log("current step is: ", step);
        console.log("simulation: ", simulation);
        console.log("riskId: ", riskId);
        console.log("risk: ", risk);
        if (step == 0) {
            getRiskId();
        }
        if (step == 1) {
            getRisk();
        }
        if (step == 5) {
            applyForPolicy();
        }
        if (step == 7) {
            router.push("/policies");
        }
    }, [step]);

    return (
        <EnvFormCheckout>
            <OverlayScrollbarsComponent defer>
                <h2>Checkout</h2>
                <form onSubmit={handleSubmit(submit)}>
                    <ItemFormCheckout>
                        <label>
                            Full name
                            <input type="text" {...register("name")} />
                        </label>
                        {errors.name && <span>{errors.name.message}</span>}
                    </ItemFormCheckout>
                    <ItemFormCheckout>
                        <label>
                            Tax ID
                            <input type="text" {...register("doc")} />
                        </label>
                        {errors.doc && <span>{errors.doc.message}</span>}
                    </ItemFormCheckout>
                    <ItemFormCheckout>
                        <label>
                            E-mail
                            <input type="email" {...register("email")} />
                        </label>
                        {errors.email && <span>{errors.email.message}</span>}
                    </ItemFormCheckout>
                    <EnvPayment>
                        <h3>
                            Select yout preferred
                            <br />
                            payment option
                        </h3>
                        <EnvClickPayment>
                            <ClickPayment
                                active={activeButton === 0}
                                onClick={() => setActiveButton(0)}
                            >
                                <Image
                                    src={IconPWallet}
                                    width={18}
                                    height={18}
                                    alt="Wallet"
                                />
                                <p>Wallet</p>
                            </ClickPayment>
                            <ClickPayment
                                active={activeButton === 1}
                                onClick={() => setActiveButton(1)}
                            >
                                <Image
                                    src={IconPix}
                                    width={15}
                                    height={15}
                                    alt="Wallet"
                                />
                                <p>PIX</p>
                            </ClickPayment>
                            <ClickPayment
                                active={activeButton === 2}
                                onClick={() => setActiveButton(2)}
                            >
                                <Image
                                    src={IconCCard}
                                    width={18}
                                    height={18}
                                    alt="Wallet"
                                />
                                <p>C.Credit</p>
                            </ClickPayment>
                        </EnvClickPayment>
                        <PaymentItem active={activeButton === 0}>
                            <Wallet>
                                <h4>
                                    {" "}
                                    <Image
                                        src={IconPWallet}
                                        width={18}
                                        height={18}
                                        alt="Wallet"
                                    />
                                    <span>
                                        We support all major web3 wallets
                                    </span>
                                </h4>
                            </Wallet>
                        </PaymentItem>
                        <PaymentItem active={activeButton === 1}>
                            <ContentPix>
                                <h4>
                                    {" "}
                                    <Image
                                        src={IconPix}
                                        width={15}
                                        height={15}
                                        alt="Pix"
                                    />
                                    <span>
                                        PIX transfer will be available soon for
                                        brazilian users
                                    </span>
                                </h4>
                                {/* <p>
                                    0x2564156sf20cx561fs56fs15fs40x124v2fdsjghdfs042524513450445645s1ds45ds45d45sdajhsadjkhnajsdhjkahsdxzh541564dsf123564f65dsfklhfiudsfjsdiuhkjUYTGERWUIHREUYFGDSUIGYRFJKkldfiodsioslaliuafsklao
                                </p>
                                <ClickCopy>
                                    <p>Copy Pix Code</p>
                                </ClickCopy>
                                <h5>Pay with QR CODE using a cellphone</h5> */}
                            </ContentPix>
                        </PaymentItem>
                        <PaymentItem active={activeButton === 2}>
                            <CreditCard>
                                <h4>
                                    {" "}
                                    <Image
                                        src={IconCCard}
                                        width={18}
                                        height={18}
                                        alt="C.Credit"
                                    />
                                    <span>
                                        Credit Card payment will be available
                                        soon worldwide
                                    </span>
                                </h4>
                            </CreditCard>
                        </PaymentItem>
                    </EnvPayment>

                    <button type="submit" disabled={submitting}>
                        {step <= 3 && "Confirm"}
                        {step == 4 &&
                            "Please confirm the transaction in your wallet"}
                        {(step == 5 || step == 6) && "Please wait..."}
                        {step == 7 && "Done!"}
                    </button>
                </form>
            </OverlayScrollbarsComponent>
        </EnvFormCheckout>
    );
};

export default FormCheckout;
