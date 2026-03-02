// ----- INVENTORY ADMIN FUNCTIONS -----

function getProducts() {
    fetch(`http://${window.location.hostname}:5003/api/products`, {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        var productListBody = document.querySelector('#product-list tbody');
        if(!productListBody) return; // Prevent error if not on Admin page
        productListBody.innerHTML = ''; 

        data.forEach(product => {
            var row = document.createElement('tr');

            row.innerHTML = `
                <td class="ps-4 fw-bold text-secondary">${product.id}</td>
                <td class="fw-medium text-dark">${product.name}</td>
                <td class="text-success fw-bold">$${parseFloat(product.price).toFixed(2)}</td>
                <td><span class="badge ${product.quantity > 10 ? 'bg-success' : (product.quantity > 0 ? 'bg-warning text-dark' : 'bg-danger')}">${product.quantity} units</span></td>
            `;

            var actionsCell = document.createElement('td');
            actionsCell.className = 'text-end pe-4';

            var editLink = document.createElement('a');
            editLink.href = `/editProduct/${product.id}`;
            editLink.textContent = 'Edit';
            editLink.className = 'btn btn-outline-primary btn-sm rounded-pill px-3 me-2';
            actionsCell.appendChild(editLink);

            var deleteLink = document.createElement('button');
            deleteLink.textContent = 'Remove';
            deleteLink.className = 'btn btn-outline-danger btn-sm rounded-pill px-3';
            deleteLink.onclick = function() { deleteProduct(product.id) };
            actionsCell.appendChild(deleteLink);

            row.appendChild(actionsCell);
            productListBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function createProduct() {
    var data = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('quantity').value
    };

    fetch(`http://${window.location.hostname}:5003/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('add-product-form').reset();
        getProducts();
    })
    .catch(error => console.error('Error:', error));
}

function updateProduct() {
    var productId = document.getElementById('product-id').value;
    var data = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('quantity').value
    };

    fetch(`http://${window.location.hostname}:5003/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        window.location.href = '/products';
    })
    .catch(error => alert('Error updating product: ' + error));
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`http://${window.location.hostname}:5003/api/products/${productId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => { getProducts(); })
        .catch(error => console.error('Error:', error));
    }
}

// ----- FRONTEND SHOP FUNCTIONS -----

function getProductsForShop() {
    fetch(`http://${window.location.hostname}:5003/api/products`, {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        var productListBody = document.querySelector('#shop-product-list tbody');
        if(!productListBody) return;
        productListBody.innerHTML = ''; 

        data.forEach(product => {
            var row = document.createElement('tr');

            row.innerHTML = `
                <td class="ps-4 fw-bold text-secondary">${product.id}</td>
                <td class="fw-medium text-dark">${product.name}</td>
                <td class="text-success fw-bold">$${parseFloat(product.price).toFixed(2)}</td>
                <td><span class="badge ${product.quantity > 10 ? 'bg-success' : (product.quantity > 0 ? 'bg-warning text-dark' : 'bg-danger')}">${product.quantity} units</span></td>
            `;

    		// Order Qty Input
            var orderInputCell = document.createElement('td');
            orderInputCell.className = 'pe-4 text-end';
    		var orderInput = document.createElement('input');
    		orderInput.type = 'number';
            orderInput.min = '0';
            orderInput.max = product.quantity;
    		orderInput.value = "0";
            orderInput.className = 'form-control form-control-sm quantity-input ms-auto';
            if(product.quantity === 0) orderInput.disabled = true;
    		orderInputCell.appendChild(orderInput);
            row.appendChild(orderInputCell);

            productListBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function orderProducts() {
  const selectedProducts = [];
  const productRows = document.querySelectorAll('#shop-product-list tbody tr');
  
  productRows.forEach(row => {
    const quantityInput = row.querySelector('input[type="number"]');
    if(!quantityInput) return;
    
    const quantity = parseInt(quantityInput.value);
    if (quantity > 0) {
      var productId = parseInt(row.querySelector('td:nth-child(1)').textContent);
      selectedProducts.push({ id: productId, quantity });
    }
  });

  if (selectedProducts.length === 0) {
    alert('Please select at least one product to order with a quantity greater than 0.');
    return;
  }

  const orderData = {
    user: {
      name: sessionStorage.getItem('username'),
      email: sessionStorage.getItem('email')
    },
    products: selectedProducts
  };

  fetch(`http://${window.location.hostname}:5004/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Orden creada exitosamente') {
      alert('📦 Success! Purchase order confirmed and inventory updated.');
      getProductsForShop(); // reload to show updated stock
      window.scrollTo(0, 0); // scroll to top
    } else {
      alert('Error creating order: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An unexpected error occurred while placing your order.');
  });
}
