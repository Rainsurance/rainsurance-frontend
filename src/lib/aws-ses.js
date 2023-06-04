// aws-ses.js
import * as aws from "@aws-sdk/client-ses";
import * as nodemailer from "nodemailer";
import { renderToStaticMarkup } from 'react-dom/server';
import PolicyConditions from "../components/PolicyConditions";

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
                                The historical average daily precipitation for this period at this location is ${policy.risk.precHist} mm.
                            </p>
                            ${renderToStaticMarkup(
                                <PolicyConditions 
                                    place={policy.risk.place.name}
                                    startDate={policy.risk.startDate}
                                    endDate={policy.risk.endDate}
                                    days={policy.risk.days}
                                    amount={policy.sumInsured}
                                    precHist={policy.risk.precHist}
                                />)
                            }
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