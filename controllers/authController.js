const User = require('../models/User');

exports.showRegister = (req, res) => {
    res.render('register', { error: null });
};

exports.register = async(req, res) => {
    try {
        const { username, password, email, phone } = req.body;
        if (!username || !password) {
            return res.render('register', { error: 'Username and password required' });
        }
        const exists = await User.findOne({ username });
        if (exists) return res.render('register', { error: 'Username already taken' });

        const user = new User({ username, password, email, phone });
        await user.save();
        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Registration failed' });
    }
};

exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.render('login', { error: 'Invalid credentials' });

        const ok = await user.comparePassword(password);
        if (!ok) return res.render('login', { error: 'Invalid credentials' });

        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Login failed' });
    }
};

exports.showForgot = (req, res) => {
    res.render('forgot', { error: null });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};