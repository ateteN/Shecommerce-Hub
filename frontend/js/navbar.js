document.addEventListener("DOMContentLoaded", () => {
  const navbarEl = document.getElementById("navbar");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const authLinksHTML = `
    <li id="auth-links">
      <a href="login.html">SIGN IN</a> | <a href="register.html">CREATE ACCOUNT</a>
    </li>`;
  const userLinksHTML = (user) => `
    <li id="user-links">
      <span id="username">${user.name}</span> | <a href="#" id="logout">LOGOUT</a>
    </li>`;

  const finalAuthHTML = (user && token) ? userLinksHTML(user) : authLinksHTML;

/* --- Dropdown + Search CSS --- */
const styles = `
  <style>
    .has-dropdown { position: relative; cursor: pointer; }
    .has-dropdown > a { display: inline-block; padding: 5px 10px; user-select: none; }

    /* --- DROPDOWN MENU FIX AND STYLE --- */
    .dropdown-menu {
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.2s;
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--color-background-white); /* White background */
      border: 1px solid var(--color-border-light); /* Light border */
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      list-style: none;
      margin: 0;
      padding: 0;
      min-width: 180px;
      z-index: 10;
      /* FIX: Override parent flex container for vertical stacking */
      display: block; 
      flex-direction: column; /* Ensure vertical stacking */
      text-align: left;
    }

    .dropdown-menu li {
      padding: 10px 15px;
      cursor: pointer;
      white-space: nowrap;
      font-size: 0.95em;
      border-bottom: 1px solid #f9f9f9; /* Subtle separator */
    }

    .dropdown-menu li:last-child {
      border-bottom: none;
    }

    .dropdown-menu li:hover {
      background-color: var(--color-light-grey); /* Light grey hover */
      color: var(--color-dark-brown);
    }

    .has-dropdown:hover .dropdown-menu {
      visibility: visible;
      opacity: 1;
    }

    /* --- SEARCH BAR STYLE --- */
    .navbar-search {
      display: inline-flex;
      align-items: center;
      margin-right: 15px;
      border: 1px solid var(--color-border-light); /* Enclose the whole search box */
      border-radius: 0;
      overflow: hidden; /* Ensure clean edges */
    }

    .navbar-search input {
      padding: 6px 10px;
      border: none; /* Remove individual border */
      outline: none;
      width: 180px;
      font-size: 0.95em;
      font-family: var(--font-sans);
    }

    .navbar-search button {
      padding: 6px 12px;
      border: none;
      background-color: var(--color-dark-brown); /* Brown background for button */
      color: var(--color-text-light); /* Light text on button */
      cursor: pointer;
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      font-size: 0.9em;
      transition: background-color 0.2s ease;
    }

    .navbar-search button:hover {
      background-color: var(--color-accent-brown); /* Lighter brown on hover */
    }

    .main-menu ul { display: flex; align-items: center; gap: 15px; }
  </style>
`;

  // --- Navbar HTML ---
  navbarEl.innerHTML = `
    ${styles}
    <div class="header-middle">
      <h1 class="logo">SHE-COMMERCE</h1>
    </div>

    <hr class="header-separator">

    <div class="header-nav">
      <nav class="main-menu">
        <ul>
          <li id="home-link"><a href="index.html">HOME</a></li>
          <li><a href="store.html">STORE</a></li>
          <li class="has-dropdown" id="categories-dropdown">
            <a href="#" id="categories-link">CATEGORIES <span>&#9662;</span></a>
            <ul class="dropdown-menu">
              <li data-category="technology">Technology</li>
              <li data-category="jewelry">Jewelry</li>
              <li data-category="beauty">Beauty</li>
              <li data-category="sports">Sports</li>
              <li data-category="others">Others</li>
            </ul>
          </li>

          <!-- SEARCH BAR BEFORE CART -->
          <li class="navbar-search">
            <input type="text" id="search-input" placeholder="Search products...">
            <button id="search-btn">Search</button>
          </li>

          <li><a href="cart.html">CART</a></li> 
          ${finalAuthHTML}
        </ul>
      </nav>
    </div>
  `;

  const logoutBtn = document.getElementById("logout");
  const homeLink = document.getElementById("home-link");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");

  // --- Logout ---
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault(); 
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload(); 
  });

  // --- CATEGORY CLICK ---
  document.querySelectorAll(".dropdown-menu li").forEach(item => {
    item.addEventListener("click", () => {
      const category = item.getAttribute("data-category");
      localStorage.setItem("selectedCategory", category);
      localStorage.removeItem("searchQuery");
      window.location.href = "index.html";
    });
  });

  // --- HOME CLICK ---
  homeLink.addEventListener("click", () => {
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("searchQuery");
  });

  // --- SEARCH BUTTON CLICK ---
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if(query) localStorage.setItem("searchQuery", query);
    else localStorage.removeItem("searchQuery");
    localStorage.removeItem("selectedCategory"); // clear category filter
    window.location.href = "index.html";
  });

  // --- PRESS ENTER KEY ---
  searchInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter") searchBtn.click();
  });
});
