import User from '../models/user.js';

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
    if (!email || !password) { return res.status(400).send('Email and password are required'); return next(); }
    if (await User.findOne({ email: email })) { res.status(400).send('User already exists'); return next(); }
    let hash = bcrypt.hashSync(password, 10);
    res.locals.user = await User.create({ firstName, lastName, email, password: hash, role });
    return next();
}
async function verifySelf(req, res, next) {
    let targetID = req.params.id;
    let currentUser = req.user;
    if (targetID != currentUser._id) { return res.status(401).send('Unauthorized'); }
    return next();
}
async function updateUser(req, _res, next) {
    await User.findByIdAndUpdate(req.params.id, { $set: req.body });
    return next();
}
export { getUsers, createUser, verifySelf, updateUser };