import * as nodemailer from "nodemailer";
import { server } from "../../../config/conf";
export default async function sendMessage(to: string, subject: string, text: string) {
    const hostname: string = server.gmailHostname
    const username: string = server.gmailUsername
    const password: string = server.gmailPassowrd
    
    const transporter = nodemailer.createTransport({
        host: hostname,
        port: 465,
        logger: true,
        secure: true,
        auth: {
            user: username,
            pass: password,
        },
    });

    const info = await transporter.sendMail({
        from: username,
        to,
        subject,
        text,
    });

    return info
}