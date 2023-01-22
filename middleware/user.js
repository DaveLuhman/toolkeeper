import User from '../models/user.js';
import bcrypt from 'bcrypt';

async function getUsers(req, res, next) {
    console.info('[MW] getUsers-in'.bgBlue.white)
    if (req.params.id) {
        let user = await User.findById(req.params.id)
        res.locals.targetUser = user;
        console.info(`Found User ${user}`.green)
        console.info('[MW] getUsers-out-1'.bgWhite.blue)
        return next();
    }
    else
        res.locals.users = await User.find();
    console.info('[MW] getUsers-out-2'.bgWhite.blue)
    next();
}
async function createUser(req, res, next) {
    console.info('[MW] createUser-in'.bgBlue.white)
    const { firstName, lastName, email, password, confirmPassword, role } = req.body;
    console.log(JSON.stringify(req.body))
    if (!email || !password) {
        res.locals.error = 'Email and Password are required';
        console.warn('Email and Password are both required'.yellow);
        console.info('[MW] createUser-out-1'.bgWhite.blue)
        return next();
    }
    if (await User.findOne({ email: email })) {
        res.locals.error = 'Email is already registered';
        console.warn('Email is already registered'.yellow);
        console.info('[MW] createUser-out-2'.bgWhite.blue)
        return next();
    }
    if (password != confirmPassword) {
        res.locals.error = 'Passwords do not match';
        console.warn('Passwords do not match'.yellow);
        console.info('[MW] createUser-out-3'.bgWhite.blue)
        return next();
    }
    let hash = bcrypt.hashSync(password, 10);
    let newUser = await User.create({ firstName, lastName, email, password: hash, role });
    res.locals.newUser = newUser;
    console.info(`Created User ${newUser}`.green)
    console.info('[MW] createUser-out-4'.bgWhite.blue)
    return next();
}
async function verifySelf(req, res, next) {
    console.info('[MW] verifySelf-in'.bgBlue.white)
    let targetID = req.params.id || req.body._id;
    let currentUser = req.user._id;
    if (targetID != currentUser) {
        res.status(401)
        res.locals.error = 'Unauthorized'
        console.warn('Unauthorized'.yellow)
    }
    console.info('[MW] verifySelf-out-1'.bgWhite.blue)
    return next();
}
async function updateUser(req, _res, next) {
    console.info('[MW] disableUser-in'.bgBlue.white)
    await User.findByIdAndUpdate(req.params.id, { $set: req.body });
    console.info('[MW] disableUser-out'.bgWhite.blue)
    return next();
}
// async function updateUser(id, update, newUser) {
//     await User.findByIdAndUpdate(id, { $set: update });
//     return newUser;
// }
async function resetPassword(req, res, next) {
    console.info('[MW] resetPassword-in'.bgBlue.white)
    const { _id, password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
        res.status(400);
        res.locals.error = 'New password and confirm password are required';
        console.info('[MW] Password and Confirm Password are both required'.yellow);
        console.info('[MW] resetPassword-out-1'.bgWhite.blue)

        return next();
    }
    if (password != confirmPassword) {
        res.status(400);
        res.locals.error = 'Passwords do not match';
        console.info('[MW] Password and Confirm Password do not match'.yellow);
        console.info('[MW] resetPassword-out-2'.bgWhite.blue)
        return next();
    }
    if (7 > password.length || password.length > 20) {
        res.status(400);
        res.locals.error = 'Password must be between 8 and 20 characters';
        console.info('[MW] Password must be between 8 and 20 characters'.yellow);
        console.info('[MW] resetPassword-out-3'.bgWhite.blue)
        return next();
    }
    let hash = bcrypt.hashSync(password, 10);
    await User.findByIdAndUpdate(_id, { $set: { password: hash } });
    console.info('[MW] resetPassword-out-4'.bgWhite.blue)
    return next();
}
async function disableUser(req, res, next) {
    console.info('[MW] disableUser-in'.bgBlue.white)
    await User.findByIdAndUpdate(req.params.id, { $set: { isDisabled: true } });
    console.info('[MW] disableUser-out'.bgBlue.white)
    return next();
}
export { resetPassword, getUsers, createUser, verifySelf, updateUser, disableUser };