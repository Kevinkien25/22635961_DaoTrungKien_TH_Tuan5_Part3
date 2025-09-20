const Supplier = require('../models/Supplier');

exports.index = async(req, res) => {
    try {
        const suppliers = await Supplier.find();
        const msg = req.query.msg || null;
        res.render('suppliers/index', { suppliers, msg });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.newForm = (req, res) => {
    res.render('suppliers/new');
};

exports.create = async(req, res) => {
    try {
        const { name, phone, address } = req.body;
        await Supplier.create({ name, phone, address });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.editForm = async(req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).send('Not found');
        res.render('suppliers/edit', { supplier });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.update = async(req, res) => {
    try {
        const { name, phone, address } = req.body;
        await Supplier.findByIdAndUpdate(req.params.id, { name, phone, address });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.delete = async(req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        const referer = req.get('referer') || '/';
        const sep = referer.includes('?') ? '&' : '?';
        res.redirect(`${referer}${sep}msg=Supplier+deleted`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
// exports.index = async(req, res) => {
//     const suppliers = await Supplier.find();
//     res.render('suppliers/index', { suppliers });
// };

// exports.newForm = (req, res) => {
//     res.render('suppliers/new');
// };

// exports.create = async(req, res) => {
//     await Supplier.create(req.body);
//     res.redirect('/suppliers');
// };

// exports.editForm = async(req, res) => {
//     const supplier = await Supplier.findById(req.params.id);
//     res.render('suppliers/edit', { supplier });
// };

// exports.update = async(req, res) => {
//     await Supplier.findByIdAndUpdate(req.params.id, req.body);
//     res.redirect('/suppliers');
// };

// exports.delete = async(req, res) => {
//     await Supplier.findByIdAndDelete(req.params.id);
//     res.redirect('/suppliers');
// };