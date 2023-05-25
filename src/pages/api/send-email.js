import { sendTestMail } from "../../lib/aws-ses";

export default async function handler(req, res) {
    const result = await sendTestMail("andreteves@gmail.com");
    res.json(result);
}