import Theme from "@/styles/theme";
import "../styles/overlayscrollbars.css";

// RainbowKit imports
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
    arbitrum,
    goerli,
    mainnet,
    optimism,
    polygon,
    polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "@wagmi/core/providers/infura";

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        // mainnet,
        // polygon,
        // optimism,
        // arbitrum,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
            ? [polygonMumbai]
            : []),
    ],
    [
        infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName: "Rainsurance",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

function App({ Component, pageProps }) {
    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <RainbowKitProvider chains={chains}>
                    <Theme>
                        <Component {...pageProps} />
                    </Theme>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}

export default App;
