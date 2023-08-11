import Layout from '@/layout/Layout';
import {
  EnvForm,
  GridItem,
  ItemForm,
  Checkbox,
  Txt,
  ButtonForm,
} from '../styles/stake';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
  useWaitForTransaction,
  useAccount,
  erc20ABI,
} from "wagmi";
import { useIsMounted } from '@/hooks/useIsMounted';
import { ethers } from "ethers";
import slugify from "react-slugify";
import { useRouter } from "next/router";
import { destinations } from "../utils/destinations";
import RainRiskPoolAbi from "../utils/RainRiskPool.json";

const oneDay = 24 * 60 * 60;
const oneDayMili = oneDay * 1000;

//TODO: duplicated in src/components/FormCalculate
Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const createBundleFormSchema = z.object({
  name: z.string().nonempty('Name is required'),
  lifetime: z.number().int()
    .gte(Number(process.env.NEXT_PUBLIC_MIN_BUNDLE_LIFETIME), { message: "Lifetime is too short" })
    .lte(Number(process.env.NEXT_PUBLIC_MAX_BUNDLE_LIFETIME), { message: "Lifetime is too long" }),
  stakedAmount: z.string().nonempty('Staked amount is required'),
  openUntil: z.date()
    .min((new Date()).addDays(Number(process.env.NEXT_PUBLIC_MIN_BUNDLE_LIFETIME)), { message: "Lifetime is too short" })
    .max((new Date()).addDays(Number(process.env.NEXT_PUBLIC_MAX_BUNDLE_LIFETIME)), { message: "Lifetime is too long" }),
  minPolicyDuration: z.number().int()
    .gte(Number(process.env.NEXT_PUBLIC_MIN_POLICY_DURATION), { message: `Min allowed value is ${process.env.NEXT_PUBLIC_MIN_POLICY_DURATION} day` }),
  maxPolicyDuration: z.number().int()
    .lte(Number(process.env.NEXT_PUBLIC_MAX_POLICY_DURATION), { message: `Max allowed value is ${process.env.NEXT_PUBLIC_MAX_POLICY_DURATION} days` }),
  minProtectedAmount: z.number().int()
    .gte(Number(process.env.NEXT_PUBLIC_MIN_POLICY_COVERAGE), { message: `Min allowed value is ${process.env.NEXT_PUBLIC_MIN_POLICY_COVERAGE}` }),
  maxProtectedAmount: z.number().int()
    .lte(Number(process.env.NEXT_PUBLIC_MAX_POLICY_COVERAGE), { message: `Max allowed value is ${process.env.NEXT_PUBLIC_MAX_POLICY_COVERAGE}` }),
  destination: z.string().nonempty('Destination city is required'),
  accept: z.boolean().refine((value) => value === true, {
    message: 'You need to accept the terms and conditions.',
  }),
})
.refine((obj) => obj.minPolicyDuration <= obj.maxPolicyDuration, {
  message: "Min policy duration must be less than max policy duration",
  path: ["minPolicyDuration"],
})
.refine((obj) => obj.minProtectedAmount <= obj.maxProtectedAmount, {
  message: "Min protected amount must be less than max protected amount",
  path: ["minProtectedAmount"],
})

const StakeView = () => {

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(createBundleFormSchema),
  });

  const { isConnected } = useAccount()
  const mounted = useIsMounted();
  const router = useRouter();
  
  const [endDate, setEndDate] = useState(null);
  const [duration, setDuration] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0); // 1 = wallet connected / 2 = data entered / 3 = approving / 4 = approved / 5 = creating bundle / 6 = bundle created
  const [transaction, setTransaction] = useState("");

  const handleDateChange = (date) => {
    var newDuration = Math.ceil((date.getTime() - new Date().getTime()) / oneDayMili);
    setEndDate(date);
    setDuration(newDuration);
    setValue("lifetime", newDuration, {
      shouldValidate: false,
      shouldDirty: true
    })
  };

  const handleLifetimeChange = async (event) => {
    const newDuration = event.target.valueAsNumber;
    const newEndDateTimestamp = new Date().getTime() + newDuration * oneDayMili;
    const newEndDate = new Date(newEndDateTimestamp);
    setDuration(newDuration);
    setEndDate(newEndDate);
    setValue("openUntil", newEndDate, {
      shouldValidate: false,
      shouldDirty: true
    })
  }

  const { write: approve } = useContractWrite({
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS,
    abi: erc20ABI,
    functionName: "approve",
    enabled: false,
    onError(error) {
        console.log("approve onError", error);
        setSubmitting(false);
        setStep(2);
    },
    onMutate({ args, overrides }) {
        console.log("approve onMutate", { args, overrides });
        setSubmitting(true);
        setStep(3);
    },
    onSuccess(data) {
        console.log("approve onSuccess", { data });
        setTransaction(data.hash)
        // setSubmitting(false);
        // setStep(4);
    },
  });

  const { write: stake } = useContractWrite({
    address: process.env.NEXT_PUBLIC_RAIN_RISKPOOL_ADDRESS,
    abi: RainRiskPoolAbi,
    functionName: "createBundle",
    enabled: false,
    onError(error) {
        console.log("createBundle onError", error);
        setSubmitting(false);
        setStep(4);
    },
    onMutate({ args, overrides }) {
        console.log("createBundle onMutate", { args, overrides });
        setSubmitting(true);
        setStep(5);
    },
    onSuccess(data) {
        console.log("createBundle onSuccess", { data });
        setTransaction(data.hash)
        // setSubmitting(true);
        // setStep(6);
    },
  });

  useWaitForTransaction({
    hash: transaction,
    onSuccess(data) {
        console.log("transaction success", data);
        if (step == 3) {
            console.log("Approved successfully!");
            setSubmitting(false);
            setStep(4);
        }
        if (step == 5) {
            console.log("Bundle created successfully!");
            setSubmitting(false);
            setStep(6);
            setTimeout(() => {
              router.push("/bundles");
          }, 5000);
        }
    },
});

  async function submit(data) {
    console.log(data);
    if (submitting) {
      return;
    }
    if (step <= 2) {
      const tx = approve({
        args: [
            process.env.NEXT_PUBLIC_GIF_TREASURY_ADDRESS,
            ethers.utils.parseUnits(data.stakedAmount, 6),
        ],
      });
    }
    if(step == 4) {
      const tx = stake({
        args: [
            data.name,
            data.lifetime * oneDay,
            ethers.utils.parseUnits(data.minProtectedAmount.toString(), 6),
            ethers.utils.parseUnits(data.maxProtectedAmount.toString(), 6),
            data.minPolicyDuration * oneDay,
            data.maxPolicyDuration * oneDay,
            ethers.utils.parseUnits(data.stakedAmount.toString(), 6),
            data.destination,
        ],
      });
    }   
  }

  return (
    <Layout title="Stake">
      <EnvForm>
        <h2>
          <span>Create a new risk bundle</span>
        </h2>
        <form onSubmit={handleSubmit(submit)}>
          <GridItem>
            <ItemForm>
              <label>
                NAME
                <input type="text" placeholder="Risk bundle name" {...register('name')} />
              </label>
              {errors.name && <span>{errors.name.message}</span>}
            </ItemForm>
            <ItemForm>
              <label>
                STAKED AMOUNT
                <input
                  type="number"
                  placeholder="USD 0,00"
                  {...register('stakedAmount')}
                />
              </label>
              {errors.stakedAmount && (
                <span>{errors.stakedAmount.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                LIFETIME
                <input
                  type="number"
                  value={duration}
                  {...register('lifetime', { valueAsNumber: true })}
                  onChange={handleLifetimeChange}
                />
                <Txt>Days</Txt>
              </label>
              {errors.lifetime && <span>{errors.lifetime.message}</span>}
            </ItemForm>
            <ItemForm>
              <label>
                OPEN UNTIL
                <Controller
                  control={control}
                  name="openUntil"
                  render={({ field }) => (
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        field.onChange(date);
                        handleDateChange(date);
                      }}
                      placeholderText="mm/dd/aaaa"
                      dateFormat="MM/dd/yyyy"
                    />
                  )}
                />
              </label>
              {errors.openUntil && <span>{errors.openUntil.message}</span>}
            </ItemForm>
            <ItemForm>
              <label>
                MINIMUM PROTECTED AMOUNT
                <input
                  type="number"
                  placeholder="USD 0,00"
                  min={process.env.NEXT_PUBLIC_MIN_POLICY_COVERAGE}
                  {...register('minProtectedAmount', { valueAsNumber: true })}
                />
              </label>
              {errors.minProtectedAmount && (
                <span>{errors.minProtectedAmount.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                MAXIMUM PROTECTED AMOUNT
                <input
                  type="number"
                  placeholder="USD 0,00"
                  min={process.env.NEXT_PUBLIC_MIN_POLICY_COVERAGE}
                  max={process.env.NEXT_PUBLIC_MAX_POLICY_COVERAGE}
                  {...register('maxProtectedAmount', { valueAsNumber: true })}
                />
              </label>
              {errors.maxProtectedAmount && (
                <span>{errors.maxProtectedAmount.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                MINIMUM POLICY DURATION
                <input 
                  type="number"
                  min={process.env.NEXT_PUBLIC_MIN_POLICY_DURATION}
                  {...register('minPolicyDuration', { valueAsNumber: true })}
                />
                <Txt>Days</Txt>
              </label>
              {errors.minPolicyDuration && (
                <span>{errors.minPolicyDuration.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                MAXIMUM POLICY DURATION
                <input
                  type="number"
                  min={process.env.NEXT_PUBLIC_MIN_POLICY_DURATION}
                  max={process.env.NEXT_PUBLIC_MAX_POLICY_DURATION}
                  {...register('maxPolicyDuration', { valueAsNumber: true })}
                />
                <Txt>Days</Txt>
              </label>
              {errors.maxPolicyDuration && (
                <span>{errors.maxPolicyDuration.message}</span>
              )}
            </ItemForm>
            {/* <ItemForm>
              <label>
                ANUAL PERCENTAGE RETURN
                <input type="number" {...register('anualpercentage')} />
                <Txt>%</Txt>
              </label>
              {errors.anualpercentage && (
                <span>{errors.anualpercentage.message}</span>
              )}
            </ItemForm> */}
            <ItemForm>
              <label>Destination</label>
              <select name="" {...register('destination')}>
                <option value="" hidden>
                  Select Destination
                </option>
                {destinations.filter(dest => dest.enabled).map((item) => (
                  <option key={item.id} value={ item.wildcard ? item.id : slugify(`${item.id}-${item.name}`) }>
                      {item.name}
                  </option>
                ))}
              </select>
              {errors.destination && <span>{errors.destination.message}</span>}
            </ItemForm>
          </GridItem>
          <Checkbox>
            <label>
              <input type="checkbox" name="" {...register('accept')} />
              By checking this box, I confirm that I have read and agree to the Terms of service.
            </label>
            {errors.accept && <span>{errors.accept.message}</span>}
          </Checkbox>
          { mounted ? 
            isConnected && 
              (<ButtonForm type="submit" disabled={submitting}>
                {step <= 2 && "Confirm"}
                {(step == 3 || step == 5) && "Please wait..."}
                {step == 4 && "Stake"}
                {step == 6 && "You are done!"}
              </ButtonForm>) 
            : null } 
          { mounted ? !isConnected && <ConnectButton showBalance={false}/> : null } 
        </form>
      </EnvForm>
    </Layout>
  );
};
export default StakeView;
