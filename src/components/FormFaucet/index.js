import { EnvForm, ItemForm, ButtonForm } from "../FormCalculate/styles";
import BackupText from '@/components/BackupText';
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUseFormSchema = z.object({
    wallet: z.string().nonempty("Wallet address is required"),
});


function FormFaucet() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(createUseFormSchema),
    });

    const [loading, setLoading] = useState(false);

    async function submit(form) {
        setLoading(true);
        const response = await fetch("/api/faucet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });
        const data = await response.json();
        console.log("tx", data.tx);
        alert(data.message);
        setLoading(false);
    }

    function shortenedAddress(address) {
        return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
    }

    return (
        <EnvForm>
            <h2>
                Faucet <br />
                <span>Get test Tokens!</span>
            </h2>
            <BackupText>
                <u>Address</u>: {shortenedAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS)} <br />
                <u>Name</u>: USD Coin - DUMMY <br />
                <u>Symbol</u>: USDC <br />
            </BackupText>
            <form onSubmit={handleSubmit(submit)}>
                <ItemForm>
                    <label>
                        Wallet address
                        <input {...register("wallet")} />
                    </label>
                    {errors.wallet && <span>{errors.wallet.message}</span>}
                </ItemForm>
                <ItemForm>
                    <button type="submit" disabled={loading}>
                        {loading ? "Please wait..." : "Submit"}
                    </button>
                </ItemForm>
            </form>
        </EnvForm>
    );
}

export default FormFaucet;
