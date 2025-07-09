const express = require('express');

const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const User = require('./models/User');
const Counter = require('./models/Counter');
const Product = require('./models/Product');
const Cart = require('./models/Cart'); // Import the Cart model
const cartRoutes = require('./routes/addtocart'); // Route for cart operations
const formRoutes = require('./routes/form'); // Import the new form route
const buyRoutes = require('./routes/buy'); // Import buy.js route
const accountRoutes = require('./routes/acc'); 
const userRoutes = require('./routes/user');  //order displaying
const Order = require('./models/Order'); // Adjust the path as necessary
const router = express.Router();

const ouserRoutes = require('./routes/users');


const productRoutes = require('./routes/products'); // Import the product routes





const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,

}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mst', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(error => console.error("MongoDB connection error:", error));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle signup form submission
// Handle signup form submission
app.post('/signup', async (req, res) => {
    const { username, password, email, mobile } = req.body;
    try {
        // Check if the username already exists
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).send("<script>alert('Username already exists. Please choose a different one.'); window.location.href = '/signup';</script>");
        }

        // Check if the email already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).send("<script>alert('Email already in use. Please use a different email.'); window.location.href = '/signup';</script>");
        }

        // If no existing user, create a new one
        const newUser = new User({ username, password, email, mobile });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Error registering user. Please try again.");
    }
});


// Handle login form submission
// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the credentials match "admin" and "admin@1"
        if (username === "admin" && password === "admin@1") {
            req.session.user = { username: "admin" };
            req.session.username = "admin";
            return res.redirect('/ahome.html'); // Redirect to ahome.html
        }

        // Otherwise, check the database for the user
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).send("Invalid username or password");
        }

        req.session.user = { id: user._id, username: user.username };
        req.session.username = user.username;
        
        // Redirect regular users to home.html
        res.send(`<script>sessionStorage.setItem('username', '${user.username}'); window.location.href = '/home';</script>`);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Error logging in. Please try again.");
    }
});

    

// Example of creating a new product
app.get('/add-product', async (req, res) => {
    try {
        const newProduct = new Product({
            name: 'Test Product',
            price: 100,
            count: 10,
            cat: 'Test Category',
            description: 'This is a test product',
            image_url: 'https://example.com/image.jpg'
        });
        await newProduct.save();
        res.send('Product added successfully');
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("Error adding product.");
    }
});

// API route to get products based on category
app.get('/api/products', async (req, res) => {
    const category = req.query.cat;

    try {
        const products = await Product.find({ cat: category });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//edit products by admin
app.put('/api/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
        if (updatedProduct) {
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Middleware to protect routes
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Protected route for home page
app.get('/home', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});




// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Error logging out. Please try again.");
        }
        res.redirect('/');
    });
});

// Use the cart route
app.use('/api', cartRoutes);

// Use the form route for order processing
app.use('/', formRoutes); // Add this line to connect the form route

// Route to serve cart.html
app.get('/cart', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});


// Remove item from cart
const removeFromCartRouter = require('./routes/removeFromCart');
app.use('/api', removeFromCartRouter);


//cart form buying
app.use('/', buyRoutes); // Register buy route
app.use('/', accountRoutes); // Register account route

app.use('/api', userRoutes); // Add this line to use the user routes for order


// Use the product routes
app.use('/api', productRoutes);

// Example Express.js route for adding a product


app.post('/api/products', async (req, res) => {
    try {
        const productData = req.body; // Get the product data from the request body

        // Validate the data
        if (!productData.name || !productData.price || !productData.count || !productData.image_url || !productData.cat) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new product
        const newProduct = new Product({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            count: productData.count,
            image_url: productData.image_url,
            cat: productData.cat // Ensure you're using cat as per the schema
        });

        // Save the product to the database
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error("Error adding product:", error); // Log the error
        res.status(500).json({ error: 'Failed to create product' });
    }
});

//removing product by admin
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ error: 'Failed to remove product' });
    }
});


// Example of an Express route for fetching orders


app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('products.pid'); // Assuming `products` is an array of objects with a `pid` field that references the Product model

        // Map through orders and structure the response to include product names
        const ordersWithDetails = orders.map(order => ({
            ...order.toObject(), // Convert Mongoose document to plain JavaScript object
            products: order.products.map(p => ({
                name: p.pid.name, // Fetch the product name
                count: p.count // Keep the count from the order
            }))
        }));

        res.json(ordersWithDetails);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

app.patch('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await Order.updateOne({ _id: id }, { status });
        res.status(200).send({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send({ error: 'Failed to update order status' });
    }
});


app.get('/api/orders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id)
            .populate('products.pid', 'name price'); // Populate the name and price fields
        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }
        res.send(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send({ error: 'Failed to fetch order' });
    }
});



//for users list
// Route to get all users
// routes/users.js



// Route to get all users
app.use(ouserRoutes);







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
