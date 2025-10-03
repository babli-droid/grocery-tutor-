// ---------------------------
// Admin.js
// ---------------------------

// Get token from localStorage
//const token = localStorage.getItem("adminToken");
//if (!token) {
  //alert("Please login first!");
  //window.location.href = "admin-login.html";
//}

const API_BASE = "http://localhost:5000/api/admin"; // 🔑 Termux IP

// ---------------------------
// Fetch Functions
// ---------------------------
async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    document.getElementById("totalProducts").innerText = data.stats.totalProducts;
    document.getElementById("totalUsers").innerText = data.stats.totalUsers;
    document.getElementById("totalOrders").innerText = data.stats.totalOrders;
    document.getElementById("revenue").innerText = `₹${data.stats.revenue}`;
  } catch (error) {
    console.error("Dashboard fetch error:", error);
  }
}

async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const users = await res.json();
    const tbody = document.getElementById("users-body");
    tbody.innerHTML = "";
    users.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td>`;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Users fetch error:", error);
  }
}

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const products = await res.json();
    const tbody = document.getElementById("products-body");
    tbody.innerHTML = "";
    products.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="images/${p.image}" width="50" /></td>
        <td>${p.name}</td>
        <td>${p.category || ""}</td>
        <td>₹${p.price}</td>
        <td>${p.stock}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Products fetch error:", error);
  }
}

async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const orders = await res.json();
    const tbody = document.getElementById("orders-body");
    tbody.innerHTML = "";
    orders.forEach(o => {
      const items = o.items.map(i => `${i.name} (x${i.quantity})`).join(", ");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.user?.name || "Unknown"}</td>
        <td>₹${o.total}</td>
        <td>${o.status}</td>
        <td>${items}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
  }
}

async function fetchAddresses() {
  try {
    const res = await fetch(`${API_BASE}/addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const addresses = await res.json();
    const tbody = document.getElementById("addresses-body");
    tbody.innerHTML = "";
    addresses.forEach(a => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.user?.name || a.name}</td>
        <td>${a.street}</td>
        <td>${a.city}</td>
        <td>${a.state || ""}</td>
        <td>${a.pincode}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Addresses fetch error:", error);
  }
}

// ---------------------------
// Sidebar Tabs
// ---------------------------
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeSidebar = document.getElementById('closeSidebar');

menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));

document.querySelectorAll('#sidebar a[data-tab]').forEach(link => {
  link.addEventListener('click', async (e)=>{
    e.preventDefault();
    const tab = link.getAttribute('data-tab');
    document.querySelectorAll('main > div').forEach(div => div.style.display = 'none');
    document.getElementById(`${tab}-tab`).style.display = 'block';

    if(tab === "dashboard") await fetchDashboard();
    if(tab === "users") await fetchUsers();
    if(tab === "products") await fetchProducts();
    if(tab === "orders") await fetchOrders();
    if(tab === "addresses") await fetchAddresses();

    sidebar.classList.remove('active');
  });
});

// Logout
document.getElementById('logout').addEventListener('click', ()=>{
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
});

// Auto-load dashboard on page load
window.addEventListener('DOMContentLoaded', fetchDashboard);
