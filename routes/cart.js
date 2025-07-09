async function fetchCartItems() {
    const username = sessionStorage.getItem('username');

    try {
        const response = await fetch(`/api/cart?username=${username}`);
        const cartItems = await response.json();

        if (response.ok) {
            displayCartItems(cartItems);
        } else {
            alert('Error fetching cart items: ' + cartItems.message);
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

function displayCartItems(cartItems) {
    const cartTable = document.getElementById('cart-table').getElementsByTagName('tbody')[0]; // Target tbody
    let cartTotal = 0;

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        const totalPrice = item.price * item.count;
        cartTotal += totalPrice;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${item.count}</td>
            <td>₹${totalPrice}</td>
            <td><button class="remove-btn" onclick="removeProduct('${item.pid}')">Remove</button></td>
        `;
        cartTable.appendChild(row);
    });

    const totalPriceDiv = document.getElementById('total-price');
    totalPriceDiv.innerHTML = `<strong>Total Price: ₹${cartTotal}</strong>`;
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
