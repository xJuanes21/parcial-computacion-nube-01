function getOrders() {
    fetch(`http://${window.location.hostname}:5004/api/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const orderListBody = document.querySelector('#order-list tbody');
        orderListBody.innerHTML = ''; 

        // Reverse to show newest first if dates are roughly sequential
        data.reverse().forEach(order => {
            const row = document.createElement('tr');
            const totalFixed = parseFloat(order.total).toFixed(2);
            
            row.innerHTML = `
                <td class="ps-4 fw-bold">#${order.id}</td>
                <td>
                    <div class="fw-medium text-dark">${order.user_name}</div>
                    <div class="text-muted small">${order.user_email}</div>
                </td>
                <td class="fw-bold text-success">$${totalFixed}</td>
                <td><span class="badge bg-light text-secondary border">${new Date(order.date).toLocaleString()}</span></td>
                <td class="text-end pe-4">
                    <button class="btn btn-outline-primary btn-sm rounded-pill px-3" onclick='showOrderDetails(${JSON.stringify(order.items)}, "${totalFixed}")'>
                        View Invoice
                    </button>
                </td>
            `;
            orderListBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching orders:', error));
}

function showOrderDetails(itemsStr, total) {
    const items = typeof itemsStr === 'string' ? JSON.parse(itemsStr) : itemsStr;
    const detailsContainer = document.getElementById('order-details-container');
    const placeholderContainer = document.getElementById('order-details-placeholder');
    const itemsListBody = document.querySelector('#order-items-list tbody');
    
    // Hide placeholder, show details
    placeholderContainer.style.display = 'none';
    detailsContainer.style.display = 'flex';
    detailsContainer.classList.add('flex-column');
    
    document.getElementById('invoice-meta').innerText = `Displaying ${items.length} items from selected order`;
    document.getElementById('invoice-total').innerText = `$${total}`;
    
    itemsListBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        const priceFixed = parseFloat(item.price).toFixed(2);
        const subtotal = item.price * item.quantity;
        
        row.innerHTML = `
            <td class="text-secondary">Prod #${item.product_id}</td>
            <td class="text-end text-muted">$${priceFixed}</td>
            <td class="text-center fw-medium bg-light px-2 rounded">${item.quantity}</td>
            <td class="text-end fw-semibold text-dark">$${subtotal.toFixed(2)}</td>
        `;
        itemsListBody.appendChild(row);
    });
}
