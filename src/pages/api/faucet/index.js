
import { token } from "../../../lib/rainProduct";

export default async function handler(req, res) {
    // POST /api/faucet
    if (req.method === "POST") {
        var { wallet } = req.body;

        const amount = 10_000;
        const amountBig = amount * process.env.NEXT_PUBLIC_USDC_MULTIPLIER;

        const balance = await token.balanceOf(wallet);
        console.log(`current balance is: ${balance}`);

        if (balance < amountBig) {
            const tx = await token.transfer(wallet, amountBig);
            console.log(tx);
            res.status(200).json({ tx, message: `${amount} USDC DUMMY were transferred successfully to this wallet.`, error: false });
        } else {
            res.status(200).json({ tx: null, message: `This wallet already has enough test tokens. Try again later.`, error: true });
        }
    }
}
