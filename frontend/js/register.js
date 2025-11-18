const form = document.getElementById("register-form");
const msgEl = document.getElementById("register-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registration failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    msgEl.textContent = "Registration successful! Redirecting...";
    window.location.href = "index.html";
  } catch (err) {
    msgEl.textContent = err.message;
  }
});
