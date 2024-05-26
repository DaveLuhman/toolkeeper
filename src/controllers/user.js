import User from '../models/user.js'
import { createToken, sendResetPwEmail } from '../middleware/util.js'
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
        req.flash('error', 'No user is registered with that email')
        res.redirect('/auth/login')
        res.end()
    } else {
        user.token = createToken()
        user.tokenExpiry = Date.now() + 3600000
        user.save()
        await sendResetPwEmail(user.email, user.token)
        req.flash(
            'info',
            `An e-mail has been sent to ${user.email} with further instructions.`
        )
        res.redirect('/auth/login')
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
        req.flash('error', 'Password reset token is invalid')
        res.redirect('/auth/login')
    } else if (user.tokenExpiry < Date.now()) {
        req.flash('error', 'Password reset token is expired')
        res.redirect('/auth/login')
    } else {
        res.locals.token = token
        res.render('auth/forgotPassword')
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
        req.flash('error', 'Password reset token is invalid or has expired.')
        res.redirect('/auth/login')
    }
    const { password, confirmPassword } = req.body
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match')
        res.redirect(`/auth/forgotPassword/${token}`)
    }
    user.password = await hash(password, 10)
    user.token = undefined
    user.tokenExpiry = undefined
    user.save()
    req.flash(
        'success',
        'Your password has been successfully reset. Please log in with your new password.'
    )
    res.redirect('/auth/login')
}
