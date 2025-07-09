async function fetchCartItems() {
    const username = sessionStorage.getItem('username');

    try {
        const response = await fetch(`/api/cart`);
        const cartItems = await response.json();

        if (response.ok) {
            console.log(cartItems); // Log cartItems to check the data structure
            if (cartItems.length === 0) {
                displayEmptyCartMessage(); // Display message if cart is empty
            } else {
                displayCartItems(cartItems); // Display cart items if available
            }
        } else {
            alert('Error fetching cart items: ' + cartItems.message);
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}


function displayEmptyCartMessage() {
    const cartTable = document.getElementById('cart-table').getElementsByTagName('tbody')[0]; // Target tbody
    cartTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">Your cart is empty.</td></tr>`; // Display message
    document.getElementById('total-price').innerHTML = ''; // Clear total price
}


function displayCartItems(cartItems) {
    const cartTable = document.getElementById('cart-table').getElementsByTagName('tbody')[0]; // Target tbody
    let cartTotal = 0;

    // Clear previous cart items
    cartTable.innerHTML = '';

    cartItems.forEach(item => {
        const productPrice = item.pid.price; // Access price from pid
        const productName = item.pid.name; // Access name from pid
        const totalPrice = productPrice * item.count; // Calculate total price for this item
        cartTotal += totalPrice; // Add to cart total

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${productName}</td>
            <td>₹${productPrice}</td>
            <td>${item.count}</td>
            <td>₹${totalPrice}</td>
            <td><button class="remove-btn" onclick="removeProduct('${item.pid._id}')">Remove</button></td>
        `;
        cartTable.appendChild(row);
    });

    // Update the total price display for all items
    const totalPriceDiv = document.getElementById('total-price');
    totalPriceDiv.innerHTML = `<strong>Total Price: ₹${cartTotal}</strong>`;

    // Set total price in the hidden input field for the form
    document.getElementById('totalPriceInput').value = cartTotal;
}


// Check cart item count before "Buy Now"
function checkCartBeforeBuying() {
    const cartItemCount = parseInt(sessionStorage.getItem('cartItemCount'), 10);

    if (cartItemCount > 0) {
        window.location.href = '/form.html'; // Redirect to form if cart has items
    } else {
        alert('Your cart is empty. Please add items to your cart before proceeding.');
    }
}

async function removeProduct(productId) {
    if (confirm("Are you sure you want to remove this product?")) {
        try {
            const response = await fetch(`/api/remove-from-cart?productId=${productId}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                location.reload(); // Reload the page to fetch updated cart items
            } else {
                alert('Error removing product: ' + result.message);
            }
        } catch (error) {
            console.error('Error removing product:', error);
        }
    }
}

// Fetch cart items on page load
window.onload = fetchCartItems;
