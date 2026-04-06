import { authService } from "../api/authService.js";

export function renderNavbar() {
  const token = localStorage.getItem("token");
  
  const navHTML = `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4 shadow-sm transition-colors duration-300">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-8">
            <a href="#home" class="flex items-center gap-2 group">
                <div class="p-2 bg-[var(--bg-secondary)] rounded-xl group-hover:bg-[var(--tertiary)] transition-colors">
                    <i data-lucide="book-open" class="text-[var(--accent)] w-6 h-6"></i>
                </div>
                <span class="text-2xl font-black font-heading tracking-tight text-[var(--text-primary)]">
                K<span class="text-[var(--accent)]">Nest</span>
                </span>
            </a>

            <!-- Search Bar -->
            <div class="hidden md:flex relative group ml-8">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"></i>
                <input type="text" onclick="window.location.hash='#search'" readonly placeholder="Quick search..." class="cursor-pointer bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-[var(--accent)] transition-all group-hover:bg-[var(--card-bg)] text-[var(--text-primary)]" />
            </div>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center gap-6 font-medium text-[var(--text-secondary)]">
          <a href="#home" class="hover:text-[var(--accent)] transition-colors flex items-center gap-2">Home</a>
          <a href="#search" class="hover:text-[var(--accent)] transition-colors flex items-center gap-2">Discover</a>
          
          <button id="theme-toggle" class="hover:text-[var(--accent)] transition-colors p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
            <i data-lucide="moon" class="w-5 h-5 block dark:hidden"></i>
          </button>

          ${token ? `
            <a href="#upload" class="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2 rounded-xl transition-all shadow-lg flex items-center gap-2 font-bold">
              <i data-lucide="upload-cloud" class="w-4 h-4"></i> Upload
            </a>
            <div class="relative group ml-2">
              <button class="hover:text-[var(--accent)] transition-colors outline-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-secondary)] border-2 border-transparent group-hover:border-[var(--accent)] text-[var(--text-secondary)]">
                <i data-lucide="user" class="w-5 h-5"></i>
              </button>
              <div class="absolute right-0 top-full mt-2 w-56 bg-[var(--card-bg)] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 border border-[var(--border)] transform origin-top-right scale-95 group-hover:scale-100 z-50">
                <div class="px-4 py-3 border-b border-[var(--border)] mb-1">
                    <p class="text-sm font-bold text-[var(--text-primary)]">My Account</p>
                </div>
                <a href="#profile" class="px-4 py-2 hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3 text-[var(--text-secondary)]"><i data-lucide="user-circle" class="w-4 h-4 text-[var(--text-muted)]"></i> Profile</a>
                <a href="#profile?tab=saved" class="px-4 py-2 hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3 text-[var(--text-secondary)]"><i data-lucide="bookmark" class="w-4 h-4 text-[var(--text-muted)]"></i> My Library</a>
                <button id="logout-btn" class="text-left w-full px-4 py-2 text-[var(--danger)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3 mt-1 border-t border-[var(--border)] pt-3"><i data-lucide="log-out" class="w-4 h-4"></i> Sign Out</button>
              </div>
            </div>
          ` : `
            <a href="#login" class="hover:text-[var(--accent)] transition-colors font-bold">Sign In</a>
            <a href="#register" class="bg-[var(--text-primary)] text-[var(--card-bg)] px-5 py-2.5 rounded-xl transition-all font-bold shadow-lg hover:scale-105 transform">Get Started</a>
          `}
        </div>

        <!-- Mobile Menu Button -->
        <button id="mobile-menu-btn" class="lg:hidden text-[var(--text-primary)] hover:text-[var(--accent)] p-2 rounded-xl bg-[var(--bg-secondary)]">
          <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
      </div>
      
      <!-- Mobile Dropdown -->
      <div id="mobile-menu" class="hidden lg:hidden absolute top-full left-0 right-0 bg-[var(--card-bg)] border-b border-[var(--border)] flex-col p-4 shadow-2xl space-y-2">
          <a href="#home" class="block w-full py-3 px-4 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center gap-3 text-[var(--text-secondary)]"><i data-lucide="home" class="w-5 h-5"></i> Home</a>
          <a href="#search" class="block w-full py-3 px-4 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center gap-3 text-[var(--text-secondary)]"><i data-lucide="search" class="w-5 h-5"></i> Discover</a>
          <div class="h-px bg-[var(--border)] my-2"></div>
          ${token ? `
            <a href="#upload" class="block w-full py-3 px-4 rounded-lg text-[var(--accent)] font-bold flex items-center gap-3 bg-[var(--bg-secondary)]"><i data-lucide="upload" class="w-5 h-5"></i> Upload Note</a>
            <a href="#profile" class="block w-full py-3 px-4 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center gap-3 text-[var(--text-secondary)]"><i data-lucide="user" class="w-5 h-5"></i> My Profile</a>
            <button id="mobile-logout-btn" class="text-left w-full py-3 px-4 rounded-lg text-[var(--danger)] hover:bg-[var(--bg-secondary)] flex items-center gap-3"><i data-lucide="log-out" class="w-5 h-5"></i> Sign Out</button>
          ` : `
            <a href="#login" class="block w-full py-3 px-4 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center gap-3 text-[var(--text-secondary)]"><i data-lucide="log-in" class="w-5 h-5"></i> Sign In</a>
            <a href="#register" class="block w-full py-3 px-4 rounded-lg bg-[var(--text-primary)] text-[var(--card-bg)] text-center font-bold mt-2">Get Started</a>
          `}
      </div>
    </nav>
  `;

  document.getElementById("nav-container").innerHTML = navHTML;

  // Hydrate icons specifically for navbar independent of router cycle occasionally
  if (window.lucide) window.lucide.createIcons();

  // Event Listeners
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("flex");
    });
  }

  // Theme Toggler
  const themeToggle = document.getElementById("theme-toggle");
  if(themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  const handleLogout = () => {
    authService.logout();
  };

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", handleLogout);
}
