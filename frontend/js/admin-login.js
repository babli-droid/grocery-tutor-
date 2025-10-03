const form = document.getElementById('admin-login-form');
const errorMsg = document.getElementById('error-msg');

// If admin is already logged in, redirect to dashboard
if(localStorage.getItem('adminToken')){
  window.location.href = 'admin.html';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5000/api/admin/login', {  // 🔑 use Termux IP
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if(res.ok){
      // Save admin token in localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminName', data.admin.name);
      // Redirect to admin dashboard
      window.location.href = 'admin.html';
    } else {
      errorMsg.textContent = data.message || 'Invalid credentials';
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = 'Server error. Try again later.';
  }
});
