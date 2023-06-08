const fs = require("fs");
const path = require("path")
const process = require("process")
import { ethers } from "ethers";
import {rainProductContract, rainOracleContract, oracle, registry} from "../../../lib/rainProduct";
const { RequestStore } = require("../../../lib/FunctionsSandboxLibrary/utils/artifact");
const { generateOffchainSecrets } = require("../../../lib/FunctionsSandboxLibrary/utils/generateOffchainSecrets");
const { createGist } = require("../../../lib/FunctionsSandboxLibrary/utils/github")
const { deleteGist } = require("../../../lib/FunctionsSandboxLibrary/utils/github")
const utils = require("../../../lib/FunctionsSandboxLibrary/utils")
const {
    getDecodedResultLog,
    buildRequest,
    getRequestConfig,
} = require("../../../lib/FunctionsSandboxLibrary")

const Location = {
    Inline: 0,
    Remote: 1,
}
  
const CodeLanguage = {
    JavaScript: 0,
}

const ReturnType = {
    uint: "uint256",
    uint256: "uint256",
    int: "int256",
    int256: "int256",
    string: "string",
    bytes: "Buffer",
    Buffer: "Buffer",
}

const generateRequest = async (requestConfig, oracle) => {
  
    const [nodeAddresses, perNodePublicKeys] = await oracle.getAllNodePublicKeys()
    const DONPublicKey = await oracle.getDONPublicKey()
  
    if (
      (requestConfig.secrets && Object.keys(requestConfig.secrets).length > 0) ||
      (requestConfig.perNodeSecrets && Object.keys(requestConfig.perNodeSecrets).length > 0)
    ) {
        if (!requestConfig.secretsURLs || requestConfig.secretsURLs.length === 0) {
            // If their are secrets (or per-node secrets) and no secretsURLs are provided, create and upload an off-chain secrets Gist
            const offchainSecrets = await generateOffchainSecrets(
                requestConfig,
                process.env.INSURER_PRIVATE_KEY,
                DONPublicKey,
                nodeAddresses,
                perNodePublicKeys
            )

            if (!process.env["GITHUB_API_TOKEN"] || process.env["GITHUB_API_TOKEN"] === "") {
                throw Error("GITHUB_API_TOKEN environment variable not set")
            }

            const secretsURL = await createGist(process.env["GITHUB_API_TOKEN"], offchainSecrets)
            console.log(`Successfully created encrypted secrets Gist: ${secretsURL}`)
            requestConfig.secretsURLs = [`${secretsURL}/raw`]
        } else {
            // Else, verify the provided off-chain secrets URLs are valid
            await verifyOffchainSecrets(requestConfig.secretsURLs, nodeAddresses)
        }
    }
  
    // Remove the preceding 0x from the DON public key
    requestConfig.DONPublicKey = DONPublicKey.slice(2)
    // Build the parameters to make a request from the client contract
    const request = await buildRequest(requestConfig)
    request.secretsURLs = requestConfig.secretsURLs
    return request
}
  

export default async function handler(req, res) {
    // POST /api/policies/process
    // RainProduct triggerOracle(bytes32 policyId)
    // inputs: policyId (bytes32)
    if (req.method === "POST") {
        var { policyId } = req.body;

        let functionFile;
        if(process.env.CHAINLINK_FUNCIONS_DEBUG === "true") {
            functionFile = `meteoblue.functions.debug.js`
        } else {
            functionFile = `meteoblue.functions.min.js`
        }
        console.log(0);
        console.log(functionFile);
        console.log(1);
        console.log(`__dirname: ${__dirname}`);
        console.log(2);
        console.log(`process.cwd(): ${process.cwd()}`);
        console.log(3);
        console.log(functionFile);
        console.log(4);
        const functionPath = path.join(process.cwd(), 'src', 'lib', functionFile);
        console.log(functionPath);
        let fileContents;
        try {
            console.log(5);
            fileContents = fs.readFileSync(`./${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(6);
            fileContents = fs.readFileSync(`./../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(7);
            fileContents = fs.readFileSync(`./../../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(8);
            fileContents = fs.readFileSync(`./../../../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(9);
            fileContents = fs.readFileSync(`./../../../../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(10);
            fileContents = fs.readFileSync(`./../../../../../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(11);
            fileContents = fs.readFileSync(`./../../../../../../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(12);
            fileContents = fs.readFileSync(`./../../../../../../../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(13);
            fileContents = fs.readFileSync(`./../../../../../../../../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(14);
            fileContents = fs.readFileSync(`./../../../../../../../../../${functionPath}`, 'utf8').toString();
        } catch {}
        try {
            console.log(15);
            fileContents = fs.readFileSync(`./../../../../../../../../../${functionPath}`, 'utf8').toString();
        } catch {}
        console.log(fileContents);
        console.log(16);
        return;

        const unvalidatedRequestConfig = {
            codeLocation: Location.Inline,
            codeLanguage: CodeLanguage.JavaScript,
            source: fileContents,
            secrets: { apiKey: process.env.METEOBLUE_API_KEY ?? "" },
            perNodeSecrets: [],
            walletPrivateKey: process.env.ORACLE_PROVIDER_PRIVATE_KEY,
            args: ["startDate", "endDate", "lat", "lng", "coordMultiplier", "precMultiplier"],
            //args: [`${startDate}`, `${endDate}`, `${lat}`, `${lng}`, `${coordMultiplier}`, `${precMultiplier}`],
            expectedReturnType: ReturnType.uint256,
            //expectedReturnType: ReturnType.Buffer,
            secretsURLs: [],
        }
        
        const requestConfig = getRequestConfig(unvalidatedRequestConfig)

        // COPIED FROM chainlink-functions-hardhat-starter-kit/tasks/Functions-client/request.js

            // doGistCleanup indicates if an encrypted secrets Gist was created automatically and should be cleaned up once the request is complete
            let doGistCleanup = !(requestConfig.secretsURLs && requestConfig.secretsURLs.length > 0);
            const request = await generateRequest(requestConfig, oracle);
            doGistCleanup = doGistCleanup && request.secrets;

            const store = new RequestStore(process.env.NEXT_PUBLIC_CHAIN_ID, process.env.NEXT_PUBLIC_CHAIN_NAME, "consumer");

            const spinner = utils.spin({
                text: `Submitting transaction for FunctionsConsumer contract`,
            })

            // Use a promise to wait & listen for the fulfillment event before returning
            await new Promise(async (resolve, reject) => {
                let requestId
        
                let cleanupInProgress = false
                const cleanup = async () => {
                    spinner.stop()
                    if (doGistCleanup) {
                        if (!cleanupInProgress) {
                            cleanupInProgress = true
                            const success = await deleteGist(process.env["GITHUB_API_TOKEN"], request.secretsURLs[0].slice(0, -4))
                            if (success) {
                                await store.update(requestId, { activeManagedSecretsURLs: false })
                            }
                            return resolve()
                        }
                        return
                    }
                    return resolve()
                }
        
                // Initiate the listeners before making the request
                // Listen for fulfillment errors
                oracle.on("UserCallbackError", async (eventRequestId, msg) => {
                    if (requestId == eventRequestId) {
                        spinner.fail(
                        "Error encountered when calling fulfillRequest in client contract.\n" +
                            "Ensure the fulfillRequest function in the client contract is correct and the --gaslimit is sufficient."
                        )
                        console.log(`${msg}\n`)
                        await store.update(requestId, { status: "failed", error: msg })
                        await cleanup()
                    }
                })
                oracle.on("UserCallbackRawError", async (eventRequestId, msg) => {
                    if (requestId == eventRequestId) {
                        spinner.fail("Raw error in contract request fulfillment. Please contact Chainlink support.")
                        console.log(Buffer.from(msg, "hex").toString())
                        await store.update(requestId, { status: "failed", error: msg })
                        await cleanup()
                    }
                })

                // Listen for successful fulfillment, both must be true to be finished
                let billingEndEventReceived = false
                let ocrResponseEventReceived = false
                rainOracleContract.on("OCRResponse", async (eventRequestId, result, err) => {
                    // Ensure the fulfilled requestId matches the initiated requestId to prevent logging a response for an unrelated requestId
                    if (eventRequestId !== requestId) {
                        return
                    }
            
                    spinner.succeed(`Request ${requestId} fulfilled! Data has been written on-chain.\n`)
                    if (result !== "0x") {
                        console.log(
                        `Response returned to client contract represented as a hex string: ${result}\n${getDecodedResultLog(
                            requestConfig,
                            result
                        )}`
                        )
                    }
                    if (err !== "0x") {
                        console.log(`Error message returned to client contract: "${Buffer.from(err.slice(2), "hex")}"\n`)
                    }
                    ocrResponseEventReceived = true
                    await store.update(requestId, { status: "complete", result })
            
                    if (billingEndEventReceived) {
                        await cleanup()
                    }
                })

                // Listen for the BillingEnd event, log cost breakdown & resolve
                registry.on(
                    "BillingEnd",
                    async (
                        eventRequestId,
                        eventSubscriptionId,
                        eventSignerPayment,
                        eventTransmitterPayment,
                        eventTotalCost,
                        eventSuccess
                    ) => {
                        if (requestId == eventRequestId) {
                        const baseFee = eventTotalCost.sub(eventTransmitterPayment)
                        spinner.stop()
                        console.log(`Actual amount billed to subscription #${eventSubscriptionId}:`)
                        const costBreakdownData = [
                            {
                            Type: "Transmission cost:",
                            Amount: `${ethers.utils.formatUnits(eventTransmitterPayment, 18)} LINK`,
                            },
                            { Type: "Base fee:", Amount: `${ethers.utils.formatUnits(baseFee, 18)} LINK` },
                            { Type: "", Amount: "" },
                            { Type: "Total cost:", Amount: `${ethers.utils.formatUnits(eventTotalCost, 18)} LINK` },
                        ]
                        utils.logger.table(costBreakdownData)
            
                        // Check for a successful request
                        billingEndEventReceived = true
                        if (ocrResponseEventReceived) {
                            await cleanup()
                        }
                        }
                    }
                )
        
                let requestTx
                try {
                    // Initiate the on-chain request after all listeners are initialized
                    requestTx = await rainProductContract.triggerOracle(
                        policyId,
                        request.secrets ?? [],
                        request.source,
                        { gasLimit: 6_000_000 }
                    );
                } catch (error) {
                    // If the request fails, ensure the encrypted secrets Gist is deleted
                    if (doGistCleanup) {
                        await deleteGist(process.env["GITHUB_API_TOKEN"], request.secretsURLs[0].slice(0, -4))
                    }
                    res.status(500).json({ error });
                    //throw error
                }
                spinner.start("Waiting 2 blocks for transaction to be confirmed...")
                const requestTxReceipt = await requestTx.wait(2)
                spinner.info(
                    `Transaction confirmed, see ${
                        utils.getEtherscanURL(process.env.NEXT_PUBLIC_CHAIN_ID) + "tx/" + requestTx.hash
                    } for more details.`
                )
                spinner.stop()
                requestId = requestTxReceipt.events[2].topics[1] //requestTxReceipt.events[2].args.id
                spinner.start(
                    `Request ${requestId} has been initiated. Waiting for fulfillment from the Decentralized Oracle Network...\n`
                )
                await store.create({
                    type: "consumer",
                    requestId,
                    transactionReceipt: requestTxReceipt,
                    codeLocation: requestConfig.codeLocation,
                    codeLanguage: requestConfig.codeLanguage,
                    source: requestConfig.source,
                    secrets: requestConfig.secrets,
                    perNodeSecrets: requestConfig.perNodeSecrets,
                    secretsURLs: request.secretsURLs,
                    activeManagedSecretsURLs: doGistCleanup,
                    args: requestConfig.args,
                    expectedReturnType: requestConfig.expectedReturnType,
                    DONPublicKey: requestConfig.DONPublicKey,
                })
                // If a response is not received in time, the request has exceeded the Service Level Agreement
                // setTimeout(async () => {
                //     spinner.fail(
                //         "A response has not been received within 5 minutes of the request being initiated and has been canceled. Your subscription was not charged. Please make a new request."
                //     )
                //     await store.update(requestId, { status: "pending_timed_out" })
                //     reject()
                // }, 300_000) // TODO: use registry timeout seconds

                res.status(200).json({ requestTxReceipt });

            })

        //COPIED END
      
        // try {
        //     // insurer must be whitelisted to use chainlink functions beta
        //     const tx = await rainProductContract.triggerOracle(policyId, secrets, source, { gasLimit: 3_000_000 });
        //     console.log(tx);
        //     res.status(200).json({ tx });
        // } catch (error) {
        //     console.error(error);
        //     res.status(500).json({ error });
        // }
    }
}
