const API = "http://localhost:5000/api/users";
const token = localStorage.getItem("userToken");

// Redirect if not logged in
if (!token) {
  alert("Please login first!");
  window.location.href = "login.html";
}

// DOM Elements
const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const ordersContainer = document.getElementById("orders");

const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAddress = document.getElementById("profileAddress");

// Fetch and display user profile
async function fetchProfile() {
  try {
    const res = await fetch(`${API}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();

    if (user.message) throw new Error(user.message);

    // Fill form and profile card
    nameInput.value = user.name || "";
    emailInput.value = user.email || "";
    addressInput.value = user.address || "";

    profileName.textContent = user.name || "User Name";
    profileEmail.textContent = user.email || "user@example.com";
    profileAddress.textContent = `Address: ${user.address || "N/A"}`;

    // Set default profile picture
    profileAvatar.src = user.avatar || "images/default_dp.png";

    // Display order history
    ordersContainer.innerHTML = "";
    if (user.orders && user.orders.length > 0) {
      user.orders.forEach(order => {
        const div = document.createElement("div");
        div.classList.add("order");
        div.innerHTML = `
          <h4>Order #${order._id}</h4>
          <p>Status: ${order.status}</p>
          <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        `;
        ordersContainer.appendChild(div);
      });
    } else {
      ordersContainer.innerHTML = "<p>No orders yet.</p>";
    }

  } catch (err) {
    console.error(err);
    alert("Failed to load profile: " + err.message);
  }
}

// Update profile info
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const data = {
      name: nameInput.value,
      email: emailInput.value,
      address: addressInput.value
    };

    const res = await fetch(`${API}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const updated = await res.json();
    if (updated.message) {
      alert(updated.message);
    }

    fetchProfile(); // reload profile after update
  } catch (err) {
    console.error(err);
    alert("Failed to update profile: " + err.message);
  }
});

// Initialize profile page
fetchProfile();
