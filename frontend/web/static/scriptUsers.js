function getUsers() {
    fetch(`http://${window.location.hostname}:5002/api/users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => {
        var userListBody = document.querySelector('#user-list tbody');
        if(!userListBody) return;
        userListBody.innerHTML = ''; 

        data.forEach(user => {
            var row = document.createElement('tr');

            // ID / Name
            var nameCell = document.createElement('td');
            nameCell.className = 'ps-4';
            nameCell.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; font-weight: 600;">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="fw-bold">${user.name}</div>
                        <div class="text-muted small">ID: ${user.id}</div>
                    </div>
                </div>
            `;
            row.appendChild(nameCell);

            // Email
            var emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            row.appendChild(emailCell);

            // Username
            var usernameCell = document.createElement('td');
            usernameCell.innerHTML = `<span class="badge bg-light text-dark border">${user.username}</span>`;
            row.appendChild(usernameCell);

            // Actions
            var actionsCell = document.createElement('td');
            actionsCell.className = 'text-end pe-4';

            var editLink = document.createElement('a');
            editLink.href = `/editUser/${user.id}`;
            editLink.textContent = 'Edit';
            editLink.className = 'btn btn-outline-primary btn-sm rounded-pill px-3 me-2';
            actionsCell.appendChild(editLink);

            var deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-outline-danger btn-sm rounded-pill px-3';
            deleteBtn.textContent = 'Remove';
            deleteBtn.onclick = function() { deleteUser(user.id); };
            actionsCell.appendChild(deleteBtn);

            row.appendChild(actionsCell);
            userListBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

function createUser() {
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch(`http://${window.location.hostname}:5002/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('add-user-form').reset();
        getUsers();
    })
    .catch(error => console.error('Error:', error));
}

function updateUser() {
    var userId = document.getElementById('user-id').value;
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch(`http://${window.location.hostname}:5002/api/users/${userId}`, {
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
        window.location.href = '/users';
    })
    .catch(error => alert('Error updating user: ' + error));
}

function deleteUser(userId) {
    if (confirm('Are you certain you want to remove this user from the system?')) {
        fetch(`http://${window.location.hostname}:5002/api/users/${userId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            getUsers();
        })
        .catch(error => console.error('Error:', error));
    }
}

function handleLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch(`http://${window.location.hostname}:5002/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  })
  .then(response => {
     if(!response.ok) throw new Error('Invalid credentials');
     return response.json();
  })
  .then(data => {
      sessionStorage.setItem('username', data.username);
      sessionStorage.setItem('email', data.email);
      window.location.href = '/dashboard';
  })
  .catch(error => alert('Login failed. Please check your username and password.'));
}
