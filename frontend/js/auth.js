const API = "http://localhost:5000/api/users";

// ---------------- REGISTER ----------------
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: document.getElementById("register-name").value,
        email: document.getElementById("register-email").value,
        password: document.getElementById("register-password").value
      };

      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration failed");

      // Save token and user info
      localStorage.setItem("userToken", result.token);
      localStorage.setItem("userName", result.user.name);
      localStorage.setItem("userId", result.user._id);

      alert("Registration successful!");
      window.location.href = "products.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// ---------------- LOGIN ----------------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = {
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value
      };

      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");

      // Store user info and JWT
      localStorage.setItem("userToken", result.token);
      localStorage.setItem("userName", result.user.name);
      localStorage.setItem("userId", result.user._id);

      // Clear old cart
      localStorage.removeItem("cart");

      alert("Login successful!");
      window.location.href = "products.html";
    } catch (err) {
      alert(err.message);
    }
  });
}
