// ---------------- LOAD CART ----------------
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.getElementById("cart-items"); // ✅ fixed selector
  const subtotalEl = document.getElementById("cart-subtotal");
  tbody.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5">Your cart is empty</td>`;
    tbody.appendChild(row);
  }

  cart.forEach((item, index) => {
    const row = document.createElement("tr");
    const total = item.price * item.quantity;
    subtotal += total;

    row.innerHTML = `
      <td>
        <img src="${item.image}" alt="${item.name}" width="50" style="border-radius:6px; margin-right:8px;">
        ${item.name}
      </td>
      <td>₹${item.price}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input">
      </td>
      <td>₹${total}</td>
      <td><button class="remove-btn" data-index="${index}">Remove</button></td>
    `;
    tbody.appendChild(row);
  });

  subtotalEl.textContent = subtotal;
}

// ---------------- UPDATE QUANTITY ----------------
document.addEventListener("input", (e) => {
  if (e.target.classList.contains("qty-input")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = e.target.dataset.index;
    cart[index].quantity = parseInt(e.target.value) || 1; // prevent NaN
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
});

// ---------------- REMOVE ITEM ----------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
});

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", () => {
  loadCart();

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      window.location.href = "checkout.html"; // ✅ navigate properly
    });
  }
});
