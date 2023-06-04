import { EnvForm, ItemForm, ButtonForm } from "./styles";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { destinations } from "../../utils/destinations";
import { ethers } from "ethers";
import slugify from "react-slugify";
import { useAccount } from "wagmi";

const createUseFormSchema = z.object({
    destination: z.string().nonempty("Destination city is required"),
    startDate: z
        .date()
        .optional()
        .refine((date) => date != null, {
            message: "Arrival date is required",
        }),
    days: z.string().nonempty("The number of days is required"),
    amount: z.string().nonempty("Coverege amount is required"),
});

function FormCalculate({ setModalOpen, setSimulation }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(createUseFormSchema),
    });
    const [startDate, setStartDate] = useState(null);
    const [calculating, setCalculating] = useState(false);

    function s2b(input) {
        return ethers.encodeBytes32String(slugify(input));
    }

    function currentTimestampUTC(date) {
        return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
    }

    async function calculatePremium(form) {
        if (calculating) {
            return;
        }
        const place = destinations.find((item) => item.id === form.destination);
        if (!place) {
            throw new Error("Destination not found");
        }
        const placeId = s2b(`${place.id} ${place.name}`);
        //const startDateTimestamp = new Date(startDate).getTime();
        const startDateTimestamp = currentTimestampUTC(new Date(startDate))
        const simulation = {
            startDate: startDateTimestamp,
            endDate: startDateTimestamp + (form.days * 24 * 60 * 60 - 1) * 1000,
            days: form.days,
            amount: form.amount,
            lat: place.lat,
            lng: place.lng,
            place: {...place, placeId}
        };
        setCalculating(true);
        const response = await fetch("/api/policies/simulation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(simulation),
        });
        const data = await response.json();
        console.log({ ...simulation, ...data });
        setSimulation({ ...simulation, ...data });
        setModalOpen(true);
        setCalculating(false);
    }

    return (
        <EnvForm>
            <h2>
                Your next trip <br />
                <span>protected</span>
            </h2>
            <form onSubmit={handleSubmit(calculatePremium)}>
                <ItemForm>
                    <label>Destination</label>
                    <select name="" {...register("destination")}>
                        <option value="" hidden>
                            Select Destination
                        </option>
                        {destinations.filter(dest => dest.enabled).map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {errors.destination && (
                        <span>{errors.destination.message}</span>
                    )}
                </ItemForm>
                <ItemForm>
                    <label>
                        Arrival date
                        <Controller
                            control={control}
                            name="startDate"
                            render={({ field }) => (
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => {
                                        field.onChange(date);
                                        setStartDate(date);
                                    }}
                                    placeholderText="mm/dd/aaaa"
                                    dateFormat="MM/dd/yyyy"
                                />
                            )}
                        />
                    </label>
                    {errors.startDate && (
                        <span>{errors.startDate.message}</span>
                    )}
                </ItemForm>
                <ItemForm>
                    <label>
                        Number of days
                        <input type="number" {...register("days")} />
                    </label>
                    {errors.days && <span>{errors.days.message}</span>}
                </ItemForm>
                <ItemForm>
                    <label>
                        Coverage amount (usd)
                        <input
                            type="number"
                            placeholder="USD 3000.00"
                            {...register("amount")}
                        />
                    </label>
                    {errors.amount && <span>{errors.amount.message}</span>}
                </ItemForm>
                <ItemForm>
                    <button type="submit" disabled={calculating}>
                        {calculating ? "Please wait..." : "Calculate Premium"}
                    </button>
                </ItemForm>
            </form>
        </EnvForm>
    );
}

export default FormCalculate;
