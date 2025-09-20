require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// DB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error', err));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Make session user available in views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId || null;
    next();
});

// Home / Dashboard
app.get('/', async(req, res) => {
    try {
        const suppliers = await Supplier.find().lean();
        const products = await Product.find().populate('supplier').lean();
        const msg = req.query.msg || null;
        res.render('index', { suppliers, products, msg, query: '' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Search
app.get('/search', async(req, res) => {
    try {
        const q = req.query.q || '';
        const supplierFilter = req.query.supplier || '';
        const query = { name: { $regex: q, $options: 'i' } };
        if (supplierFilter) query.supplier = supplierFilter;
        const suppliers = await Supplier.find().lean();
        const products = await Product.find(query).populate('supplier').lean();
        res.render('index', { suppliers, products, msg: null, query: q });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));