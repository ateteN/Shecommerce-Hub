document.addEventListener("DOMContentLoaded", () => {
  const navbarEl = document.getElementById("navbar");
  
  // Check if the user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  
  // login state
  const authLinksHTML = `
    <li id="auth-links">
      <a href="login.html">SIGN IN</a> | <a href="register.html">CREATE ACCOUNT</a>
    </li>`;

  const userLinksHTML = (user) => `
    <li id="user-links">
      <span id="username">${user.name}</span> | <a href="#" id="logout">LOGOUT</a>
    </li>`;

  const finalAuthHTML = (user && token) ? userLinksHTML(user) : authLinksHTML;
  
  // header
  navbarEl.innerHTML = `
    <div class="header-middle">
        <h1 class="logo">SHE-COMMERCE</h1>
    </div>

    <hr class="header-separator">

    <div class="header-nav">
        <nav class="main-menu">
            <ul>
              <li><a href="index.html">HOME</a></li>
              <li><a href="store.html">STORE</a></li>
              <li class="has-dropdown">
                  <a href="#">CATEGORIES <span>&#9662;</span></a>
              </li>
              <li><a href="about.html">ABOUT</a></li>
              <li><a href="cart.html">CART</a></li> 
              ${finalAuthHTML}
            </ul>
        </nav>
    </div>
  `;

  // Re-select elements 
  const authLinks = document.getElementById("auth-links");
  const userLinks = document.getElementById("user-links");
  const usernameEl = document.getElementById("username");
  const logoutBtn = document.getElementById("logout");
  
  //display logic (only needed if using the simplified JS logic)
 
  if (user && token) {
    if (authLinks) authLinks.style.display = "none";
    if (userLinks) userLinks.style.display = "inline";
    if (usernameEl) usernameEl.textContent = user.name;
  } else {
    if (authLinks) authLinks.style.display = "inline";
    if (userLinks) userLinks.style.display = "none";
  }

  // Logout listener
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault(); 
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload(); 
  });
});