import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
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
    const resetEmail = {
        to: email,
        from: 'no-reply@ado.software',
        subject: 'Toolkeeper Password Reset',
        text: `
                        Please click on the following link, or paste this into your browser to complete the password reset:
                        ${process.env.PRIMARY_URL}/forgotPassword/${token}
                        If you did not request this, please ignore this email and your password will remain unchanged.
                        This link is valid for 24 hours and will expire after that.
                `,
    }

    await sgMail.send(resetEmail)
}

// Path: src/controllers/util.js