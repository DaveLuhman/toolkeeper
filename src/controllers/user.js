import { User } from '../models/index.models.js'
import { createToken, sendResetPwEmail } from './util.js'
import { hash } from 'bcrypt'


/**
 * Initiates the password reset process for a user by generating a reset token and sending a reset password email.
 * @param {object} req The request object, containing the email address of the user who is requesting the reset.
 * @param {object} res The response object used to send back the HTTP response.
 */
export async function submitResetPasswordRequest(req, res) {
    const { email } = req.body
    const user = await User.findByEmail(email)
    if (!user) {
        res.locals.message = 'No user is registered with that email'
        res.redirect('/login')
        res.end()
    } else {
        user.token = createToken()
        user.tokenExpiry = Date.now() + 3600000
        user.save()
        await sendResetPwEmail(user.email, user.token)
        res.locals.message = `An e-mail has been sent to ${user.email} with further instructions.`
        res.redirect('/login')
    }
}

/**
 * Verifies the validity of a reset password request.
 * @param {object} req The request object, containing parameters and the reset token.
 * @param {object} res The response object, used to send replies to the client.
 * @param {function} next The next middleware function in the stack.
 * @returns {void} Does not return any value but redirects or renders a page based on token validity.
 */
export async function verifyResetPasswordRequest(req, res) {
    const token = req.params.token
    const user = await User.findByToken(token)
    if (!user) {
        res.locals.message = 'Password reset token is invalid'
        res.redirect('/login')
    } else if (user.tokenExpiry < Date.now()) {
        res.locals.message = 'Password reset token is expired'
        res.redirect('/login')
    } else {
        res.locals.token = token
        res.render('auth/forgotPassword', { layout: 'auth.hbs' })
    }
}
/**
 * Executes the reset password request by updating the user's password and resetting the token.
 * @param {object} req The request object, containing the reset token and the new password.
 * @param {object} res The response object used to send back the HTTP response.
 */
export async function executeResetPasswordRequest(req, res) {
    const token = req.params.token
    const user = await User.findByToken(token)
    if (!user || user.tokenExpiry < Date.now()) {
        res.locals.message = 'Password reset token is invalid or has expired.'
        res.redirect('/login')
    }
    const { password, confirmPassword } = req.body
    if (password !== confirmPassword) {
        res.locals.message = 'Passwords do not match'
        res.redirect(`/forgotPassword/${token}`)
    }
    user.password = await hash(password, 10)
    user.token = undefined
    user.tokenExpiry = undefined
    user.save()
    res.locals.message = 'Your password has been successfully reset. Please log in with your new password.'
    res.redirect('/login')
}

// src\controllers\user.js
