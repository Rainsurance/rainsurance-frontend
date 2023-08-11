import Layout from '@/layout/Layout';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import {
  FlexInitial,
  Bundle,
  Table,
  TableHeader,
  TableBody,
  Status,
} from '../styles/bundles';
import Loading from '@/components/Loading';
import BackupText from '@/components/BackupText';
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { useState, useEffect } from "react";
import RainRiskPoolAbi from "../utils/RainRiskPool.json";
import { destinations } from "../utils/destinations";
import { formatDate } from '../lib/helpers';

const usdcMultiplier = Number(process.env.NEXT_PUBLIC_USDC_MULTIPLIER);
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
const bundleStates = ["Active", "Locked", "Closed", "Burned"];

function calculateStakeUsage(capitalSupport, lockedCapital) {
  if (capitalSupport !== undefined) {
      if (capitalSupport > 0) {
          return (lockedCapital / capitalSupport) * 100;
      } else {
          if (lockedCapital > 0) {
              return 1;
          }
      }
  }
  return 0;
}

function mapStatusColor(stakeUsage) {
  if (stakeUsage === undefined || stakeUsage < 0) {
    return '#d3d3d3';
  } else if (stakeUsage >= 1) {
    return '#d03537';
  } else if (stakeUsage >= 0.9) {
    return '#ffa500';
  } else {
    return '#19cd14';
  }
}

function prepareBundle(data) {
  console.log("prepareBundle: ", data);
  const cityId = data.place.split("-")[0];
  var city = destinations.find((item) => item.id === cityId);
  if (!city) {
      city = { name: "Unknown" };
  }
  const bundleId = Number(data.bundleId);
  const state = bundleStates[data.state];

  const lifetime = Number(data.lifetime);
  const createdAt = Number(data.createdAt);
  const openUntil = formatDate(createdAt + lifetime);

  const balance = Number(data.balance) / usdcMultiplier;
  const balanceUSD = USDollar.format(balance);

  const capital = Number(data.capital) / usdcMultiplier;
  const lockedCapital = Number(data.lockedCapital) / usdcMultiplier;
  const capacity = capital - lockedCapital;
  const capacityUSD = USDollar.format(capacity);

  const capitalSupportedByStaking = Number(data.capitalSupportedByStaking) / usdcMultiplier;
  const stakeUsage = calculateStakeUsage(capitalSupportedByStaking, lockedCapital);
  const statusColor = mapStatusColor(stakeUsage);

  const policies =  Number(data.policies);
  
  return {
    ...data,
    bundleId,
    state,
    openUntil,
    balance,
    balanceUSD,
    capacity,
    capacityUSD,
    lockedCapital,
    capitalSupportedByStaking,
    city,
    policies,
    statusColor,
    stakeUsage
  };
}

const BundleView = () => {

  const [bundleIds, setBundleIds] = useState(null);
  const [bundles, setBundles] = useState([]);
  const [connectMessage, setConnectMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

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

  async function getActivePolicies(bundle) {
    console.log(`getActivePolicies for bundle ${bundle.bundleId}...`);
    const policies = readContract({
        address: process.env.NEXT_PUBLIC_RAIN_RISKPOOL_ADDRESS,
        abi: RainRiskPoolAbi,
        functionName: "getActivePolicies",
        args: [bundle.bundleId],
    })
    return Promise.all([bundle, policies])
    .then(([bundle, policies])  => {
      console.log(`DONE! ${policies} policies for bundle ${bundle.bundleId}`);
      return {...bundle, policies};
    });
  }

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

  async function getBundles() {
    console.log(`getBundles with ids ${bundleIds}...`)
    setLoading(true);
    bundleIds.forEach((id) => {
      getBundleInfo(id)
      .then(getActivePolicies)
      .then((data) => {
        addBundle(prepareBundle(data));
        setLoading(false);
      })
    });
  }

  useEffect(() => {
    getBundleIds();
  }, []);

  useEffect(() => {
      if (bundleIds) {
        setConnectMessage("");
        getBundles();
      } else {
        setConnectMessage("No active bundle was found");
      }
  }, [bundleIds]);

  useEffect(() => {
    console.log(`Bundles:`);
    console.log(bundles);
  }, [bundles]);

  return (
    <FlexInitial>
      <Layout title="Bundles">
        <Bundle>
          <h2>
            <span>Risk bundles</span>
          </h2>
          { loading && <Loading /> }
          { !loading && connectMessage && <BackupText>{ connectMessage }</BackupText> }

          <Table>
            <OverlayScrollbarsComponent defer>
              <TableHeader>
                <p>ID</p>
                <p>NAME</p>
                <p>STATE</p>
                <p>PLACE</p>
                <p>BALANCE</p>
                <p>CAPACITY</p>
                <p>USAGE</p>
                <p></p>
                <p>OPEN UNTIL</p>
                <p>POLICIES</p>
              </TableHeader>
              {bundles.length > 0 && bundles.map((item) => (
                <TableBody key={item.bundleId}>
                  <p>{item.bundleId}</p>
                  <p>{item.name}</p>
                  <p>{item.state}</p>
                  <p>{item.city.name}</p>
                  <p>{item.balanceUSD}</p>
                  <p>{item.capacityUSD}</p>
                  <p>{item.stakeUsage}%</p>
                  <Status color={item.statusColor} />
                  <p>{item.openUntil}</p>
                  <p>{item.policies}</p>
                </TableBody>
              ))}
              <br />
            </OverlayScrollbarsComponent>
          </Table>
        </Bundle>
      </Layout>
    </FlexInitial>
  );
};
export default BundleView;
