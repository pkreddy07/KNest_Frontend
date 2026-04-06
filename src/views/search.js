import { noteService } from "../api/noteService.js";
import { createNoteCard } from "../components/noteCard.js";
import { showToast } from "../components/popup.js";

// Hook to capture search terms locally
function saveSearchTerm(term) {
    if (!term || term.trim() === '') return;
    let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    history = [term, ...history.filter(t => t.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(history));
}

export function renderSearch(container) {
  const hashObj = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const initialQuery = hashObj.get("q") || "";
  const recentSearches = JSON.parse(localStorage.getItem("searchHistory") || "[]");

  container.innerHTML = `
    <!-- Search Header Element -->
    <div class="mb-12 slide-up text-center relative z-10 glass-card p-12 rounded-3xl border-0 bg-knest-blue/5">
        <h2 class="text-4xl md:text-5xl font-black font-heading mb-4 text-slate-900 dark:text-white">Discover Resources</h2>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 text-lg">Search through thousands of verified notes, past papers, and study materials uploaded by the community.</p>
        
        <form id="search-form" class="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 relative">
            <div class="relative flex-1 group">
                <i data-lucide="search" class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-knest-blue transition-colors"></i>
                <input type="text" id="search-input" value="${initialQuery}" class="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl py-5 pl-14 pr-6 text-slate-900 dark:text-white focus:outline-none focus:border-knest-blue transition-all shadow-xl shadow-slate-200/50 dark:shadow-none text-lg" placeholder="Search by topic, keyword, or title...">
            </div>
            <button type="submit" class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-knest-blue dark:hover:bg-knest-blue hover:text-white dark:hover:text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 text-lg shrink-0">
                Search
            </button>
        </form>

        <!-- Chips Row -->
        <div class="max-w-3xl mx-auto mt-6 flex flex-wrap gap-2 justify-center" id="search-chips">
            ${recentSearches.map(term => `<button class="search-chip px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-white/5 flex items-center gap-1"><i data-lucide="history" class="w-3 h-3"></i> ${term}</button>`).join('')}
            ${!recentSearches.length ? `
                <button class="search-chip px-4 py-1.5 rounded-full bg-knest-blue/10 text-knest-blue text-sm font-bold border border-knest-blue/20 hover:bg-knest-blue/20 transition-colors">Mathematics</button>
                <button class="search-chip px-4 py-1.5 rounded-full bg-knest-blue/10 text-knest-blue text-sm font-bold border border-knest-blue/20 hover:bg-knest-blue/20 transition-colors">Computer Science</button>
                <button class="search-chip px-4 py-1.5 rounded-full bg-knest-blue/10 text-knest-blue text-sm font-bold border border-knest-blue/20 hover:bg-knest-blue/20 transition-colors">Physics</button>
            ` : ''}
        </div>
    </div>

    <div class="flex justify-between items-end mb-6 slide-up" style="animation-delay: 0.1s">
        <h3 class="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="check-square" class="w-5 h-5 text-emerald-500"></i> Search Results
        </h3>
        <span class="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/5"><span id="result-count">0</span> matching notes</span>
    </div>

    <!-- Data Injection -->
    <div id="results-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 slide-up" style="animation-delay: 0.2s">
        <!-- Results inject here -->
    </div>
    
    <div id="loader" class="hidden text-center py-20 w-full col-span-full">
        <i data-lucide="loader-2" class="animate-spin text-knest-blue w-12 h-12 mx-auto"></i>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const resultsContainer = document.getElementById("results-container");
  const resultCount = document.getElementById("result-count");
  const loader = document.getElementById("loader");
  const searchInput = document.getElementById("search-input");

  // Clicking a chip forces a search
  document.querySelectorAll('.search-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
          const rawText = e.target.textContent.trim();
          searchInput.value = rawText;
          performSearch(rawText);
      });
  });

  const performSearch = async (query) => {
    try {
        resultsContainer.innerHTML = "";
        loader.classList.remove("hidden");
        
        window.history.replaceState(null, null, `#search?q=${encodeURIComponent(query)}`);

        // If performing valid query, log locally
        if (query) saveSearchTerm(query);

        const res = await noteService.getPublicNotes(1, 40, query);
        loader.classList.add("hidden");
        resultCount.textContent = res.results?.length || 0;

        if (!res.results || res.results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="col-span-full text-center py-20 glass-card rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <div class="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i data-lucide="search-x" class="w-10 h-10 text-slate-400 dark:text-slate-500"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Nothing matched your criteria</h3>
                    <p class="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find any documents matching "${query}". Try generalizing your search terms, check for typos, or browse the categories.</p>
                    <div class="flex items-center justify-center gap-4">
                        <button onclick="document.getElementById('search-input').value=''; document.getElementById('search-form').dispatchEvent(new Event('submit'))" class="text-knest-blue font-bold px-6 py-2 rounded-xl bg-knest-blue/10 hover:bg-knest-blue/20 transition-colors">Clear Search</button>
                        <a href="#home" class="text-slate-700 dark:text-slate-300 font-bold px-6 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Go Home</a>
                    </div>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        res.results.forEach(note => {
            resultsContainer.appendChild(createNoteCard(note));
        });

    } catch (err) {
        loader.classList.add("hidden");
        showToast("Error searching database", "error");
        resultsContainer.innerHTML = `<div class="col-span-full text-center text-red-500 font-bold py-10">Search subsystem failure...</div>`;
    }
  };

  // Bind Events
  document.getElementById("search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const val = searchInput.value.trim();
      performSearch(val);
  });

  // Initial load
  performSearch(initialQuery);
}
