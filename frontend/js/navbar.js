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

  // --- Dropdown CSS for hover (FIXED) ---
  const dropdownStyles = `
    <style>
      .has-dropdown { position: relative; cursor: pointer; }
      .has-dropdown > a { display: inline-block; padding: 5px 10px; user-select: none; }

      .dropdown-menu {
        /*
          CRITICAL FIX: Changed initial 'display: none' to 'visibility: hidden;' 
          and adjusted hover rule to use 'visibility: visible;'. 
          This prevents the element from interfering with the layout (like 'display: none'), 
          but prevents the flicker/rendering issue you are seeing on load.
        */
        visibility: hidden; /* Start hidden without affecting layout space */
        opacity: 0; /* Add for smooth transition (optional) */
        transition: opacity 0.2s; /* Add transition for smoothness (optional) */
        
        position: absolute;
        top: 100%;
        left: 0;
        background: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        list-style: none;
        margin: 0;
        padding: 0;
        min-width: 150px;
        /* Removed flex-direction: column; as it's not strictly necessary for simple vertical lists */
        z-index: 10;
      }

      .dropdown-menu li {
        padding: 10px;
        cursor: pointer;
        white-space: nowrap;
        display: block; /* Ensure list items behave like blocks inside the menu */
      }

      .dropdown-menu li:hover {
        background-color: #f2f2f2;
      }

      /* Show dropdown on hover */
      .has-dropdown:hover .dropdown-menu {
        visibility: visible; /* Show menu */
        opacity: 1; /* Fade in (optional) */
      }
      
      /* New style to ensure the list items are vertical */
      #categories-dropdown > .dropdown-menu {
        display: block; /* Use block display for the main menu container */
      }
      
    </style>
  `;

  // --- Navbar HTML ---
  navbarEl.innerHTML = `
    ${dropdownStyles}
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
          <li><a href="about.html">ABOUT</a></li>
          <li><a href="cart.html">CART</a></li> 
          ${finalAuthHTML}
        </ul>
      </nav>
    </div>
  `;

  // --- Re-select elements ---
  const logoutBtn = document.getElementById("logout");
  const homeLink = document.getElementById("home-link");

  // Authentication/Logout Logic (Kept as is)
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault(); 
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload(); 
  });

  // --- CATEGORY CLICK ---
  const dropdownItems = document.querySelectorAll(".dropdown-menu li");
  dropdownItems.forEach(item => {
    item.addEventListener("click", () => {
      const category = item.getAttribute("data-category");
      localStorage.setItem("selectedCategory", category);
      window.location.href = "index.html"; // go to homepage filtered
    });
  });

  // --- HOME CLICK: clear selected category ---
  homeLink.addEventListener("click", () => {
    // This uses event delegation on the <li> wrapper to ensure the removal happens
    localStorage.removeItem("selectedCategory");
  });
});