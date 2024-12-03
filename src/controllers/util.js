import nodemailer from 'nodemailer';
import process from "node:process";

/**
 * Generates a random string to be used as a token.
 * @returns {string} A random string token.
 */
export function createToken() {
    return Math.random().toString(36).slice(-8)
  }

/**
 * Sends a password reset email.
 * @param {string} email - The email address of the recipient.
 * @param {string} token - The password reset token.
 */
export async function sendResetPwEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const resetEmail = {
        from: 'no-reply@ado.software',
        to: email,
        subject: 'Toolkeeper Password Reset',
        text: `
            Please click on the following link, or paste this into your browser to complete the password reset:
            ${process.env.PRIMARY_URL}/forgotPassword/${token}
            If you did not request this, please ignore this email and your password will remain unchanged.
            This link is valid for 24 hours and will expire after that.
        `,
    };

    await transporter.sendMail(resetEmail);
}

/**
 * Sends an email using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body of the email.
 * @returns {Promise<void>}
 */
export const sendEmail = async (to, subject, body) => {
    const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const msg = {
        to,
        from: 'donotreply@toolkeeper.site', // The fixed 'from' address
        subject,
        text: body,
    };

    try {
        await transporter.sendMail(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

/**
 * Extracts the domain from a given email address.
 * @param {string} email - The email address to extract the domain from.
 * @returns {string} - The domain part of the email address.
 */
export const getDomainFromEmail = (email) => {
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) {
    throw new Error('Invalid email address');
  }
  return email.slice(atIndex + 1);
};

// Path: src/controllers/util.js
// src\controllers\util.js
