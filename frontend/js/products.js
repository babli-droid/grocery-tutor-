// ---------------- PRODUCTS DATA ----------------
const products = [
  { name: "Apple", price: 120, image: "images/products/apple.jpg" },
  { name: "Banana", price: 60, image: "images/products/banana.jpg" },
  { name: "Mango", price: 150, image: "images/products/mango.jpg" },
  { name: "Orange", price: 80, image: "images/products/orange.jpg" },
  { name: "Potato", price: 40, image: "images/products/potato.jpg" },
  { name: "Tomato", price: 50, image: "images/products/tomato.jpg" },
  { name: "Onion", price: 70, image: "images/products/onion.jpg" },
  { name: "Milk", price: 55, image: "images/products/milk.jpg" },
  { name: "Eggs", price: 70, image: "images/products/eggs.jpg" },
  { name: "Bread", price: 40, image: "images/products/bread.jpg" },
  { name: "Butter", price: 220, image: "images/products/butter.jpg" },
  { name: "Cheese", price: 300, image: "images/products/cheese.jpg" },
  { name: "Sugar", price: 50, image: "images/products/sugar.jpg" },
  { name: "Salt", price: 20, image: "images/products/salt.jpg" },
  { name: "Tea", price: 150, image: "images/products/tea.jpg" },
  { name: "Coffee", price: 250, image: "images/products/coffee.jpg" },
  { name: "Oil", price: 180, image: "images/products/oil.jpg" },
  { name: "Ice Cream", price: 120, image: "images/products/ice_cream.jpg" },
  { name: "Yogurt", price: 90, image: "images/products/yogurt.jpg" },
  { name: "Soap", price: 40, image: "images/products/soap.jpg" },
];

// ---------------- SELECT DOM ELEMENTS ----------------
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");

// ---------------- DISPLAY PRODUCTS ----------------
function displayProducts(items) {
  productList.innerHTML = "";
  if (items.length === 0) {
    productList.innerHTML = "<p style='text-align:center; color:#777;'>No products found</p>";
    return;
  }

  items.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button class="add-to-cart-btn"
        data-name="${p.name}"
        data-price="${p.price}"
        data-image="${p.image}">
        Add to Cart
      </button>
      <button class="add-to-wishlist-btn"
        data-name="${p.name}"
        data-price="${p.price}"
        data-image="${p.image}">
        Add to Wishlist
      </button>
    `;
    productList.appendChild(div);
  });
}

// ---------------- INITIAL RENDER ----------------
displayProducts(products);

// ---------------- ADD TO CART ----------------
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingIndex = cart.findIndex((item) => item.name === product.name);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
}

// ---------------- ADD TO WISHLIST ----------------
function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist.find((item) => item.name === product.name)) {
    wishlist.push({ ...product });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${product.name} added to wishlist!`);
  } else {
    alert(`${product.name} is already in your wishlist`);
  }
}

// ---------------- EVENT LISTENERS ----------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const btn = e.target;
    addToCart({
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      image: btn.dataset.image,
    });
  }
  if (e.target.classList.contains("add-to-wishlist-btn")) {
    const btn = e.target;
    addToWishlist({
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      image: btn.dataset.image,
    });
  }
});


// ---------------- SEARCH PRODUCTS ----------------
function searchProducts(query) {
  const results = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  displayProducts(results);
}

searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.trim();
  if (keyword.length > 0) {
    searchProducts(keyword);
  } else {
    displayProducts(products); // reload all products if search is empty
  }
});


