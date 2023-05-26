// aws-ses.js
import * as aws from "@aws-sdk/client-ses";
import * as nodemailer from "nodemailer";
const pluralize = require("pluralize");

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

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

let policiesUrl = process.env.NEXT_PUBLIC_APP_URL + "/policies";

export const sendPolicyMail = async (policy) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: policy.customer.email,
            subject: `Rainsurance - We've got you covered!`,
            html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
                <html>
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                </head>
                <body>
                    <div>
                        <div>
                            <h2>Hi ${policy.customer.name},</h2>
                            <p>
                                Thanks for choosing Rainsurance, you rock! We hope you have an amazing trip!<br>
                                But in case a bad weather gets in your way, you can rest assured :) <br>
                                Below you will find all the details regarding the policy you've just acquired with us.
                            </p>
                            <p>
                                <b> > Policy ID:</b> ${policy.id}<br>
                                <b> > Policy transaction info:</b> ${policy.processId}<br>
                                <b> > Wallet:</b> ${policy.walletAddress}<br>
                                <b> > Premium paid:</b> ${USDollar.format(policy.premium)}<br>
                                <b> > Amount insured:</b> ${USDollar.format(policy.sumInsured)}<br>
                            </p>
                            <p>
                                You can check all active policies and claim your refund, if applicable, by accessing your account at: <br>
                                <a href="${policiesUrl}">${policiesUrl}</a><br>
                                * Remember to connect the same wallet you used to purchase this policy.
                            </p>
                            <p><b><u>Policy conditions</u>:</b></p>
                            <p>
                                The historical daily average precipitation for this period of the
                                year at this location is ${policy.risk.aph} mm.
                            </p>
                            <p>
                                You will be entitled to a refund if the average${" "}
                                precipitation within the range of 10km of ${policy.risk.place.name}${" "}
                                is greater than the amount stated above for at least ${policy.risk.days}${" "}
                                ${pluralize("consecutive day", policy.risk.days)} from${" "}
                                ${new Date(policy.risk.startDate).toLocaleDateString()} to${" "}
                                ${new Date(policy.risk.endDate).toLocaleDateString()}.
                            </p>
                            <p>
                                You get ${USDollar.format(policy.sumInsured)} (100% refund) if the
                                rainfall is greater than or equal to 2x the value shown
                                above (${2 * policy.risk.aph} mm).
                                <br />
                                You get a proportional refund if the amount is in between
                                the two values.
                            </p>
                            <p>
                                Boa Viagem! <br />
                                Equipe Rainsurance
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

export const sendTestMail = async (customerEmail) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: customerEmail,
            subject: "Test Mail from Rainsurance",
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