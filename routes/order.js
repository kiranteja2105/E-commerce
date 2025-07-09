router.post('/order', async (req, res) => {
    const { fullName, email, phone, address, totalPrice } = req.body;
    const username = req.session.user?.username; // Fetch username from session

    try {
        // Step 2: Fetch cart items for the user
        const cartItems = await Cart.find({ username: username });

        // Step 3: Create an order entry
        const order = new Order({
            username: username, // Store username correctly
            email: email,
            phone: phone,
            address: address,
            totalPrice: totalPrice,
            products: cartItems,
            status: 'Pending',
            orderDate: new Date(),
        });

        // Step 4: Save the order to the database
        await order.save();

        // Step 5: Clear the cart after the order is created
        await Cart.deleteMany({ username: username });

        res.redirect('/order-success'); // Redirect to a success page or show a success message
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).send('Error processing order');
    }
});
