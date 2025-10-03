const API = "http://localhost:5000/api/addresses";
const list = document.querySelector(".address-list");
const form = document.querySelector("form");

// JWT token from localStorage
const token = localStorage.getItem("userToken");
if (!token) {
  alert("You must be logged in to view addresses!");
  window.location.href = "login.html";
}

// Fetch wrapper with Authorization
const fetchWithAuth = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Load addresses
async function loadAddresses() {
  try {
    list.innerHTML = "<p>Loading addresses...</p>";
    const res = await fetchWithAuth(API);
    if (!res.ok) throw new Error("Failed to load addresses");

    const data = await res.json();
    if (data.length === 0) {
      list.innerHTML = "<p>No addresses found. Add one below.</p>";
      return;
    }

    list.innerHTML = "";
    data.forEach(addr => {
      const div = document.createElement("div");
      div.className = "address-item";
      div.innerHTML = `
        <p><strong>${addr.name}</strong></p>
        <p>${addr.street}, ${addr.city}</p>
        <p>Pincode: ${addr.pincode}</p>
        <p>Phone: ${addr.phone}</p>
        <div>
          <button onclick="editAddress('${addr._id}')">Edit</button>
          <button onclick="deleteAddress('${addr._id}')">Delete</button>
        </div>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    list.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Add new address
form.addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    name: form.name.value,
    street: form.street.value,
    city: form.city.value,
    pincode: form.pincode.value,
    phone: form.phone.value,
  };

  try {
    const res = await fetchWithAuth(API, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add address");
    form.reset();
    loadAddresses();
  } catch (err) {
    alert(err.message);
  }
});

// Delete address
async function deleteAddress(id) {
  if (!confirm("Are you sure you want to delete this address?")) return;
  try {
    const res = await fetchWithAuth(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete address");
    loadAddresses();
  } catch (err) {
    alert(err.message);
  }
}

// Edit address
function editAddress(id) {
  const div = document.querySelector(`button[onclick="editAddress('${id}')"]`).parentElement.parentElement;
  const p = div.querySelectorAll("p");

  const name = p[0].innerText;
  const streetCity = p[1].innerText.split(", ");
  const street = streetCity[0];
  const city = streetCity[1];
  const pincode = p[2].innerText.replace("Pincode: ", "");
  const phone = p[3].innerText.replace("Phone: ", "");

  div.innerHTML = `
    <input type="text" value="${name}" placeholder="Name">
    <input type="text" value="${street}" placeholder="Street">
    <input type="text" value="${city}" placeholder="City">
    <input type="text" value="${pincode}" placeholder="Pincode">
    <input type="tel" value="${phone}" placeholder="Phone">
    <button>Save</button>
    <button onclick="loadAddresses()">Cancel</button>
  `;

  div.querySelector("button").addEventListener("click", async () => {
    const inputs = div.querySelectorAll("input");
    const updatedData = {
      name: inputs[0].value,
      street: inputs[1].value,
      city: inputs[2].value,
      pincode: inputs[3].value,
      phone: inputs[4].value,
    };

    try {
      const res = await fetchWithAuth(`${API}/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update address");
      loadAddresses();
    } catch (err) {
      alert(err.message);
    }
  });
}

// Initial load
loadAddresses();
