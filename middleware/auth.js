module.exports = {
    ensureAuth: (req, res, next) => {
        if (req.session.userId) return next();
        res.redirect('/auth/login');
    },
    forwardAuth: (req, res, next) => {
        if (!req.session.userId) return next();
        res.redirect('/');
    }
};