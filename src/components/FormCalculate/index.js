import { EnvForm, ItemForm, ButtonForm } from "./styles";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { readContract } from "@wagmi/core";
import { destinations } from "../../utils/destinations";
import RainRiskPoolAbi from "../../utils/RainRiskPool.json";
import { formatDate, s2b } from '../../lib/helpers';
import slugify from "react-slugify";

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function currentTimestampUTC(date) {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
}

const createUseFormSchema = z.object({
    destination: z.string().nonempty("Destination city is required"),
    startDate: z
        .date({
            required_error: "Arrival date is required",
        })
        //.refine((date) => date > (new Date()).addDays(21), {
        .refine((date) => (date < new Date() || date > (new Date()).addDays(21)), {
            message: "Arrival date is too close (min 21 days ahead)",
        }),
    days: z.string().nonempty("Number of days is required"),
    amount: z.string().nonempty("Coverege amount is required"),
});

function prepareBundle(data) {
    console.log("prepareBundle: ", data);
    const cityId = data.place.split("-")[0];
    var city = destinations.find((item) => item.id === cityId);
    if (!city) {
        city = null;
    }

    const bundleId = Number(data.bundleId);

    const lifetime = Number(data.lifetime);
    const createdAt = Number(data.createdAt);
    const openFrom = formatDate(createdAt);
    const openUntil = formatDate(createdAt + lifetime);

    const usdcMultiplier = Number(process.env.NEXT_PUBLIC_USDC_MULTIPLIER);
    const capital = Number(data.capital) / usdcMultiplier;
    const lockedCapital = Number(data.lockedCapital) / usdcMultiplier;
    const capacity = capital - lockedCapital;
    const minSumInsured = Number(data.minSumInsured) / usdcMultiplier;
    const maxSumInsured = Number(data.maxSumInsured) / usdcMultiplier;
    const oneDay = 24 * 60 * 60;
    const minDuration = Number(data.minDuration) / oneDay;
    const maxDuration = Number(data.maxDuration) / oneDay;
      
    return {
      ...data,
      bundleId,
      openFrom,
      openUntil,
      capacity,
      city,
      minSumInsured,
      maxSumInsured,
      minDuration,
      maxDuration,
      lifetime,
      createdAt
    };
}

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
    const [loading, setLoading] = useState(true);
    const [bundleIds, setBundleIds] = useState(null);
    const [bundles, setBundles] = useState([]);
    const [bundlesGrouped, setBundlesGrouped] = useState({});
    const [places, setPlaces] = useState([]);

    //TODO: duplicated in src/pages/bundles.js
    function addBundle(newBundle) {
        console.log(`Adding Bundle...`);
        setBundles((oldArray) => [
            // eslint-disable-next-line no-undef
            ...new Map(
                [...oldArray, newBundle].map((item) => [
                    item["bundleId"],
                    item,
                ])
            ).values(),
        ]);
    }

    //TODO: duplicated in src/pages/bundles.js
    async function getBundleIds() {
        setLoading(true);
        console.log(`getBundleIds...`);
        await readContract({
            address: process.env.NEXT_PUBLIC_RAIN_RISKPOOL_ADDRESS,
            abi: RainRiskPoolAbi,
            functionName: "getActiveBundleIds",
            args: [],
        }).then((data) => {
            console.log("all bundleIds", data);
            if(data.length > 0) {
              setBundleIds(data);
            } else {
              setBundleIds(null);
            }
            setLoading(false);
        });
    }

    //TODO: duplicated in src/pages/bundles.js
    async function getBundleInfo(id) {
        console.log(`getBundleInfo for bundle ${id}...`);
        return readContract({
            address: process.env.NEXT_PUBLIC_RAIN_RISKPOOL_ADDRESS,
            abi: RainRiskPoolAbi,
            functionName: "getBundleInfo",
            args: [id],
        }).then((data) => {
          console.log(`DONE! Bundle ${id} is:`);
          console.log(data);
          return data;
        });
    }

    //TODO: duplicated in src/pages/bundles.js
    async function getBundles() {
        console.log(`getBundles with ids ${bundleIds}...`)
        setLoading(true);
        bundleIds.forEach((id) => {
          getBundleInfo(id)
          .then((data) => {
            addBundle(prepareBundle(data));
            setLoading(false);
          })
        });
    }

    function findBundlesMatchApplication(application) {
        return bundles.filter(item => (
            (application.place.placeSlug == item.place || item.place == "*") &&
            application.amount >= item.minSumInsured  &&
            application.amount <= item.maxSumInsured  && 
            application.amount <= item.capacity && 
            application.days >= item.minDuration  &&
            application.days <= item.maxDuration  &&
            (application.startDate / 1000) >= item.createdAt &&
            (application.endDate / 1000) <= item.createdAt + item.lifetime
        ));
    }

    async function calculatePremium(form) {
        if (calculating) {
            return;
        }
        const place = destinations.find((item) => item.id === form.destination);
        if (!place) {
            throw new Error("Destination not found");
        }
        const placeSlug = slugify(`${place.id}-${place.name}`);
        //const startDateTimestamp = new Date(startDate).getTime();
        const startDateTimestamp = currentTimestampUTC(new Date(startDate))
        const application = {
            startDate: startDateTimestamp,
            endDate: startDateTimestamp + (form.days * 24 * 60 * 60 - 1) * 1000,
            days: Number(form.days),
            amount: Number(form.amount),
            lat: place.lat,
            lng: place.lng,
            place: {...place, placeSlug}
        };
        const applicableBundles = findBundlesMatchApplication(application);
        if(applicableBundles.length > 0) {
            const selectedBundle = applicableBundles.pop();
            application.bundleId = selectedBundle.bundleId;
        } else {
            alert("No bundle available for this application");
            console.log("No bundle available for this application");
            return;
        }
        setCalculating(true);
        const response = await fetch("/api/policies/simulation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(application),
        });
        const data = await response.json();
        console.log({ ...application, ...data });
        setSimulation({ ...application, ...data });
        setModalOpen(true);
        setCalculating(false);
    }

    useEffect(() => {
        console.log(`Places:`);
        console.log(places);
    }, [places]);

    useEffect(() => {
        console.log(`Bundles:`);
        console.log(bundles);
        var groupedBlundles = {};
        var cities = [];
        bundles.forEach((bundle) => {
            if(bundle.city != null) {
                const city = bundle.city
                if(groupedBlundles[city.id]) {
                    groupedBlundles[city.id]["bundles"].push(bundle);
                } else {
                    groupedBlundles[city.id] = {city, bundles: [bundle]};
                }
                if(city.wildcard) {
                    cities = destinations.filter(dest => dest.enabled && !dest.wildcard);
                } else {
                    cities.push(city);
                }
            }
        });
        setBundlesGrouped(groupedBlundles);
        setPlaces([
            ...new Map(
                cities.map((item) => [
                    item["id"],
                    item,
                ])
            ).values(),
        ]);
    }, [bundles]);

    useEffect(() => {
        if (bundleIds) {
            getBundles()
        }
    }, [bundleIds]);

    useEffect(() => {
        getBundleIds();
    }, []);

    return (
        <EnvForm>
            <h2>
                Your next trip <br />
                <span>covered!</span>
            </h2>
            <form onSubmit={handleSubmit(calculatePremium)}>
                <ItemForm>
                    <label>Destination</label>
                    <select name="" {...register("destination")}>
                        <option value="" hidden>
                            {loading ? "Loading destinations..." : "Select Destination" }
                        </option>
                        { places.length > 0 && places.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        )) }
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
