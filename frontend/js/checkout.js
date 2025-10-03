const cart = JSON.parse(localStorage.getItem("cart")) || [];
const summaryItemsContainer = document.getElementById("summary-items");
const summaryTotal = document.getElementById("summary-total");

// Clear previous items
summaryItemsContainer.innerHTML = "";

let total = 0;
cart.forEach(item => {
  const itemTotal = item.price * item.quantity;
  total += itemTotal;

  const div = document.createElement("div");
  div.classList.add("summary-item");
  div.innerHTML = `
    <span>${item.name} x ${item.quantity}</span>
    <span>₹${itemTotal}</span>
  `;
  summaryItemsContainer.appendChild(div);
});
summaryTotal.textContent = total;

// Handle checkout form submission
document.getElementById("checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("userToken");
  if (!token) {
    alert("Please login to place an order.");
    window.location.href = "login.html";
    return;
  }

  const fullname = document.getElementById("fullname").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const zipcode = document.getElementById("zipcode").value;
  const paymentMethod = document.getElementById("payment").value;

  if (!fullname || !phone || !address || !city || !zipcode || !paymentMethod) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/orders/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart.map(item => ({
          product: item._id || null,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingInfo: { fullname, phone, address, city, zipcode, paymentMethod },
        total
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "orders.html";
    } else {
      alert(data.message || "Something went wrong!");
    }

  } catch (err) {
    console.error(err);
    alert("Server error, try again later!");
  }
});
