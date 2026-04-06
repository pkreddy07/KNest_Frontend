export function renderSidebar() {
  const token = localStorage.getItem("token");

  // Determine active route
  const hash = window.location.hash || "#home";
  
  const navItem = (route, icon, label, badge = "") => {
      const isActive = hash.startsWith(route);
      return `
        <a href="${route}" class="flex items-center justify-between w-full p-3 rounded-xl transition-all ${isActive ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]' }">
            <div class="flex items-center gap-3">
                <i data-lucide="${icon}" class="w-5 h-5"></i>
                <span class="font-medium">${label}</span>
            </div>
            ${badge ? `<span class="px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}">${badge}</span>` : ''}
        </a>
      `;
  };

  const html = `
    <aside class="hidden lg:flex w-64 flex-col gap-8 flex-shrink-0 sticky top-[100px] h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar transition-colors">
        
        <div class="space-y-1">
            <h3 class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-3">Menu</h3>
            ${navItem("#home", "home", "Home")}
            ${navItem("#search", "compass", "Discover", "New")}
        </div>

        ${token ? `
        <div class="space-y-1">
            <h3 class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-3">My Library</h3>
            ${navItem("#profile", "user", "My Profile")}
            ${navItem("#profile?tab=saved", "bookmark", "Saved Notes", "★")}
        </div>
        ` : `
        <div class="bg-[var(--card-bg)] p-5 rounded-2xl flex flex-col items-center text-center mt-4 border border-dashed border-[var(--border)] shadow-sm">
            <div class="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-3">
                <i data-lucide="lock" class="text-[var(--accent)] w-6 h-6"></i>
            </div>
            <h4 class="font-bold text-[var(--text-primary)] mb-1">Unlock Features</h4>
            <p class="text-xs text-[var(--text-secondary)] mb-4">Sign in to save notes and build your library.</p>
            <a href="#login" class="w-full bg-[var(--text-primary)] text-[var(--card-bg)] py-2 rounded-xl text-sm font-bold transition-transform hover:scale-105 shadow-md">Sign In</a>
        </div>
        `}

        <div class="mt-auto">
            <a href="#upload" class="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold shadow-lg transition-all hover:-translate-y-1">
                <i data-lucide="plus-circle" class="w-5 h-5"></i>
                Upload Resource
            </a>
        </div>
    </aside>
  `;

  return html;
}
