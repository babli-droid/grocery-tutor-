const API_BASE = "http://localhost:5000/api/admin"; // Change if different

const token = localStorage.getItem("adminToken");
if (!token) {
  alert("Please login first!");
  window.location.href = "admin-login.html";
}

// Sidebar functionality
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeSidebar = document.getElementById('closeSidebar');

menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));

// Tab navigation
document.querySelectorAll('#sidebar a[data-tab]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tab = link.getAttribute('data-tab');
    document.querySelectorAll('main > div').forEach(div => div.style.display = 'none');
    document.getElementById(`${tab}-tab`).style.display = 'block';
    sidebar.classList.remove('active');
  });
});

// Logout
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
});

// ----------- Fetch Functions -----------
async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById('totalProducts').innerText = data.stats.totalProducts;
  document.getElementById('totalUsers').innerText = data.stats.totalUsers;
  document.getElementById('totalOrders').innerText = data.stats.totalOrders;
  document.getElementById('revenue').innerText = `₹${data.stats.revenue}`;
}

async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const products = await res.json();
  const tbody = document.getElementById('products-body');
  tbody.innerHTML = "";
  products.forEach(p => {
    tbody.innerHTML += `<tr>
      <td><img src="images/${p.image}" width="50"></td>
      <td>${p.name}</td>
      <td>${p.category || '-'}</td>
      <td>₹${p.price}</td>
      <td>${p.stock}</td>
    </tr>`;
  });
}

async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const orders = await res.json();
  const tbody = document.getElementById('orders-body');
  tbody.innerHTML = "";
  orders.forEach(o => {
    const items = o.items.map(i => `${i.name} (x${i.quantity})`).join(", ");
    tbody.innerHTML += `<tr>
      <td>${o.user.name}</td>
      <td>₹${o.total}</td>
      <td>${o.status}</td>
      <td>${items}</td>
    </tr>`;
  });
}

async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const users = await res.json();
  const tbody = document.getElementById('users-body');
  tbody.innerHTML = "";
  users.forEach(u => {
    tbody.innerHTML += `<tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
    </tr>`;
  });
}

async function fetchAddresses() {
  const res = await fetch(`${API_BASE}/addresses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const addresses = await res.json();
  const tbody = document.getElementById('addresses-body');
  tbody.innerHTML = "";
  addresses.forEach(a => {
    tbody.innerHTML += `<tr>
      <td>${a.user?.name || a.name}</td>
      <td>${a.street || a.address}</td>
      <td>${a.city}</td>
      <td>${a.state || '-'}</td>
      <td>${a.pincode || a.zipcode}</td>
    </tr>`;
  });
}

// ----------- Initialize Dashboard -----------
fetchDashboard();
fetchProducts();
fetchOrders();
fetchUsers();
fetchAddresses();
