const form = document.getElementById("login-form");
const msgEl = document.getElementById("login-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    msgEl.textContent = "Login successful! Redirecting...";
    window.location.href = "index.html";
  } catch (err) {
    msgEl.textContent = err.message;
  }
});
