import { renderNavbar } from "./components/navbar.js";
import { renderHome } from "./views/home.js";
import { renderAuth } from "./views/auth.js";
import { renderUpload } from "./views/upload.js";
import { renderSearch } from "./views/search.js";
import { renderProfile } from "./views/profile.js";
import { renderNoteDetail } from "./views/noteDetail.js";
import { renderSidebar } from "./components/sidebar.js";

function initTheme() {
  const isDark = localStorage.getItem("theme") !== "light";
  if (!isDark) {
    document.body.classList.remove("dark");
  }
}

function router() {
  const hash = window.location.hash || "#home";
  const app = document.getElementById("app");
  
  // Clear previous content and reset layout
  app.innerHTML = "";
  app.className = "max-w-7xl mx-auto px-6 mt-[100px] mb-20 fade-in flex gap-8 flex-col lg:flex-row items-start"; 

  // Re-render nav on route change to capture auth state changes
  renderNavbar();

  // Inject Sidebar globally
  app.insertAdjacentHTML('beforeend', renderSidebar());

  // Create inner content wrapper that flexes to fill space
  const contentWrapper = document.createElement("div");
  contentWrapper.className = "flex-1 w-full min-w-0";
  app.appendChild(contentWrapper);

  // Parsing query strings from hash (e.g., #search?q=math)
  const [route, queryString] = hash.split("?");
  const params = new URLSearchParams(queryString || "");

  switch (route) {
    case "#home":
      renderHome(contentWrapper);
      break;
    case "#login":
      renderAuth(contentWrapper, "login");
      break;
    case "#register":
      renderAuth(contentWrapper, "register");
      break;
    case "#upload":
      renderUpload(contentWrapper);
      break;
    case "#search":
      renderSearch(contentWrapper);
      break;
    case "#profile":
      renderProfile(contentWrapper);
      break;
    case "#note":
      renderNoteDetail(contentWrapper);
      break;
    default:
      renderHome(contentWrapper);
  }

  // Hydrate Lucide icons natively after DOM injection happens sequentially 
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 50);
}

// Global Event Listeners
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
    initTheme();
    router();
});
