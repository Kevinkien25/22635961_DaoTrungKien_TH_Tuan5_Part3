require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes'); // ✅ thêm auth routes
const Supplier = require('./models/Supplier'); // added
const Product = require('./models/Product'); // added

// Swagger setup (optional)
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
// load swagger yaml
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // ✅ thêm để parse JSON
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// DB connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// ✅ Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "mySecretKey",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
        cookie: { maxAge: 1000 * 60 * 60 } // 1 giờ
    })
);

// Routes
app.get('/', async(req, res) => {
    try {
        const suppliers = await Supplier.find();
        const products = await Product.find().populate('supplier');
        const msg = req.query.msg || null;
        res.render('index', { suppliers, products, msg });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes); // ✅ thêm auth routes

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));