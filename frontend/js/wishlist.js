// wishlist.js
// Works with products.js which should store wishlist entries as:
// { name, price, image } inside localStorage 'wishlist'

// Fallback image (in case product.image is missing)
const FALLBACK_IMG = "images/products/default.png"; // add a default image if you like

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch (e) {
    console.error("Invalid wishlist in localStorage:", e);
    return [];
  }
}

function setWishlist(list) {
  localStorage.setItem("wishlist", JSON.stringify(list));
}

// Renders wishlist table rows
function renderWishlist() {
  const wishlist = getWishlist();
  const tbody = document.getElementById("wishlist-items");
  const countEl = document.getElementById("wishlist-count");

  tbody.innerHTML = "";

  if (!wishlist.length) {
    // empty row
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:24px;color:#666">Your wishlist is empty.</td></tr>`;
    countEl.textContent = "0";
    return;
  }

  wishlist.forEach((item, idx) => {
    const image = item.image || FALLBACK_IMG;
    const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="text-align:left">
        <div class="product-cell">
          <img src="${image}" alt="${escapeHtml(item.name)}" onerror="this.src='${FALLBACK_IMG}'">
          <div class="product-info">
            <div style="font-weight:700">${escapeHtml(item.name)}</div>
          </div>
        </div>
      </td>
      <td>₹${price}</td>
      <td>
        <div style="display:flex;justify-content:center;gap:8px">
          <button class="btn btn-move" data-index="${idx}">Move to Cart</button>
          <button class="btn btn-remove" data-index="${idx}">Remove</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  countEl.textContent = String(wishlist.length);
}

/* Move single wishlist item to cart, then remove from wishlist */
function moveToCart(index) {
  const wishlist = getWishlist();
  const item = wishlist[index];
  if (!item) return;

  // load cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // find by name (you can change to id if you have one)
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ name: item.name, price: item.price, image: item.image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // remove from wishlist
  wishlist.splice(index, 1);
  setWishlist(wishlist);

  renderWishlist();
  alert(`${item.name} moved to cart`);
}

/* Remove item from wishlist */
function removeFromWishlist(index) {
  const wishlist = getWishlist();
  const item = wishlist[index];
  if (!item) return;
  wishlist.splice(index, 1);
  setWishlist(wishlist);
  renderWishlist();
}

/* Event delegation for move/remove buttons */
document.addEventListener("click", function (e) {
  const moveBtn = e.target.closest(".btn-move");
  if (moveBtn) {
    const idx = Number(moveBtn.dataset.index);
    if (!Number.isNaN(idx)) moveToCart(idx);
    return;
  }
  const remBtn = e.target.closest(".btn-remove");
  if (remBtn) {
    const idx = Number(remBtn.dataset.index);
    if (!Number.isNaN(idx)) removeFromWishlist(idx);
    return;
  }
});

/* small helper to avoid inserting raw HTML for names */
function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
