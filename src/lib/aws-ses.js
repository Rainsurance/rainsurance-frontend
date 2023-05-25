// aws-ses.js
import * as aws from "@aws-sdk/client-ses";
import * as nodemailer from "nodemailer";

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

    }
});

// Create a transporter of nodemailer
const transporter = nodemailer.createTransport({
    SES: { ses, aws },
});

export const sendTestMail = async (customerEmail) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: customerEmail,
            subject: "Test Mail from AWS SES",
            html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
                <html>
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                </head>
                <body>
                <div style="padding:20px;">
                <div style="max-width: 500px;">
                <h2>Test Mail</h2>
                <p>
                Hi there,<br/><br/>
                This is a test mail.
                </p>
                </div>
                </div>
                </body>
                </html>
            `,
            });

        return response?.messageId
            ? { ok: true }
            : { ok: false, msg: "Failed to send email" };

    } catch (error) {
        console.log("ERROR", error.message);
        return { ok: false, msg: "Failed to send email" };
    }
};