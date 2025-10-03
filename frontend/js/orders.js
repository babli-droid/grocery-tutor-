const token = localStorage.getItem("userToken");

async function loadOrders() {
  if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/orders/myorders", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const orders = await res.json();
    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = "";

    if (!orders || orders.length === 0) {
      ordersContainer.innerHTML = `<p class="empty">No orders placed yet.</p>`;
      return;
    }

    orders.forEach(order => {
      const div = document.createElement("div");
      div.classList.add("order-card");

      div.innerHTML = `
        <div class="order-header">
          <h3>Order ID: ${order._id}</h3>
          <span>₹${order.total}</span>
        </div>
        <p class="order-status ${order.status}">${order.status}</p>
        <ul>
          ${order.items.map(i => `<li>${i.name} x ${i.quantity} - ₹${i.price}</li>`).join("")}
        </ul>
        <p class="shipping-info">
          <strong>Shipping:</strong> ${order.shippingInfo.fullname}, ${order.shippingInfo.address}, ${order.shippingInfo.city} - ${order.shippingInfo.zipcode}<br>
          <strong>Payment:</strong> ${order.shippingInfo.paymentMethod.toUpperCase()}
        </p>
      `;
      ordersContainer.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    document.getElementById("orders-container").innerHTML = `<p class="empty">Failed to load orders.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadOrders);
