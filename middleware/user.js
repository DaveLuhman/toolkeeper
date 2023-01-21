import User from '../models/user.js';
import bcrypt from 'bcrypt';

async function getUsers(req, res, next) {
    let users = [];
    if (req.params.id) {
        users.push(await User.findById(req.params.id));
        res.locals.users = users;
        return next();
    }
    else
        res.locals.users = await User.find(); next();
}
async function createUser(req, res, next) {
    const { firstName, lastName, email, password, role } = req.body;
    if (!email || !password) { res.status(400).send('Email and password are required'); return next(); }
    if (await User.findOne({ email: email })) { res.status(400).send('User already exists'); return next(); }
    let hash = bcrypt.hashSync(password, 10);
    res.locals.user = await User.create({ firstName, lastName, email, password: hash, role });
    return next();
}
async function verifySelf(req, res, next) {
    let targetID = req.params.id || req.body._id;
    console.log(`targetID: ${targetID}`)
    let currentUser = req.user._id;
    console.log(`currentUser: ${currentUser}`)
    if (targetID != currentUser) { return res.status(401).send('Unauthorized'); }
    return next();
}
async function updateUser(req, _res, next) {
    await User.findByIdAndUpdate(req.params.id, { $set: req.body });
    return next();
}
async function resetPassword(req, res, next) {
    console.log('user reset password mw')
    const { _id, password, confirmPassword } = req.body;
    console.log(`_id: ${_id}`, `Password: ${password}`, `confirmPassword: ${confirmPassword}`)
    if (!password || !confirmPassword) { res.status(400); res.locals.error = 'New password and confirm password are required'; return next(); }
    if (password != confirmPassword) { res.status(400); res.locals.error = 'Passwords do not match'; return next(); }
    if (7 > password.length || password.length > 20) { res.status(400); res.locals.error = 'Password must be between 8 and 20 characters'; return next(); }
    let hash = bcrypt.hashSync(password, 10);
    console.log('hash: ' + hash)
    await User.findByIdAndUpdate(_id, { $set: { password: hash } });
    return next();
}
export { resetPassword, getUsers, createUser, verifySelf, updateUser };