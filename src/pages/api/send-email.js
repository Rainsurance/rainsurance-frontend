import { sendTestMail } from "../../lib/aws-ses";

export default async function handler(req, res) {
    const { query } = req;

    const result = await sendTestMail(query.email);
    res.json(result);
}