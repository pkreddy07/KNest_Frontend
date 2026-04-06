export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  
  // Design system mapped icons and colors
  let icon = "info";
  let colorClass = "bg-knest-panel text-white dark:bg-slate-800 dark:border dark:border-white/10";
  
  if (type === "success") {
      icon = "check-circle-2";
      colorClass = "bg-emerald-500 text-white shadow-emerald-500/20";
  } else if (type === "error") {
      icon = "alert-circle";
      colorClass = "bg-red-500 text-white shadow-red-500/20";
  }

  // Animation and layout classes
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl transform transition-all duration-300 translate-x-full opacity-0 ${colorClass}`;
  
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0"></i>
    <span class="font-medium text-sm">${message}</span>
    <button class="ml-4 opacity-70 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  
  // Hydrate icons exclusively for this dynamically injected chunk
  if (window.lucide) {
      window.lucide.createIcons({ root: toast });
  }

  // Trigger entrance animation next frame
  requestAnimationFrame(() => {
    toast.classList.remove("translate-x-full", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-full");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
