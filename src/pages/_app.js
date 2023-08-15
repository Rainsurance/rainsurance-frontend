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
import Script from "next/script";

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

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;

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
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive"/>
            <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
            `}
            </Script>
        </>
    );
}

export default App;
