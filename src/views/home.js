import { noteService } from "../api/noteService.js";
import { createNoteCard } from "../components/noteCard.js";

export async function renderHome(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden glass-card rounded-3xl p-8 md:p-16 mb-12 slide-up border-0 bg-gradient-to-br from-slate-900 via-knest-dark to-slate-900">
        <div class="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <i data-lucide="book-open" class="w-64 h-64 text-knest-blue"></i>
        </div>
        <div class="relative z-10 max-w-2xl">
            <span class="inline-block py-1 px-3 rounded-full bg-knest-blue/20 text-knest-blue font-bold text-xs mb-6 border border-knest-blue/30 tracking-widest uppercase">
                V2.0 Platform Upgrade
            </span>
            <h1 class="text-4xl md:text-6xl font-black font-heading mb-6 text-white leading-tight">
                Master your craft with <span class="text-gradient">Open Knowledge.</span>
            </h1>
            <p class="text-lg text-slate-400 mb-8 max-w-xl">
                Join thousands of students and professionals sharing verified study materials, lecture notes, and research data.
            </p>
            <div class="flex flex-wrap items-center gap-4">
                <a href="#upload" class="bg-knest-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
                    <i data-lucide="upload" class="w-5 h-5"></i> Start Uploading
                </a>
                <a href="#search" class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all border border-slate-700 flex items-center gap-2">
                    <i data-lucide="search" class="w-5 h-5"></i> Explore Library
                </a>
            </div>
        </div>
    </section>

    <!-- Categories Mock Strip -->
    <section class="mb-12 slide-up" style="animation-delay: 0.1s">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="layers" class="w-5 h-5 text-knest-blue"></i> Popular Categories
            </h3>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
            ${["Computer Science", "Business & Finance", "Deep Learning", "Mathematics", "Physics", "Medicine"].map(cat => `
                <a href="#search?q=${encodeURIComponent(cat)}" class="snap-start flex-shrink-0 glass-card px-6 py-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-3 cursor-pointer group border border-slate-200 dark:border-white/5">
                    <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-knest-blue/10 transition-colors">
                        <i data-lucide="hash" class="w-4 h-4 text-slate-400 group-hover:text-knest-blue transition-colors"></i>
                    </div>
                    <span class="font-bold text-slate-700 dark:text-slate-300 group-hover:text-knest-blue transition-colors">${cat}</span>
                </a>
            `).join('')}
        </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-12">
            <!-- Trending -->
            <section class="slide-up" style="animation-delay: 0.2s">
                <div class="flex justify-between items-end mb-6">
                    <h3 class="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                        <i data-lucide="flame" class="w-6 h-6 text-orange-500 fill-orange-500/20"></i> Trending Now
                    </h3>
                    <a href="#search" class="text-sm font-bold text-knest-blue hover:underline">View all</a>
                </div>
                <div id="trending-container" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    ${[1,2,3,4].map(i => `<div class="h-48 skeleton"></div>`).join('')}
                </div>
            </section>
        </div>

        <!-- Sidebar Column -->
        <div class="space-y-8 slide-up" style="animation-delay: 0.3s">
            <!-- Top Contributor -->
            <div class="glass-card p-6 border-t-4 border-t-knest-blue rounded-2xl">
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <i data-lucide="award" class="w-4 h-4 text-knest-blue"></i> Top Contributor
                </h3>
                
                <div id="top-user-widget" class="flex items-center gap-4">
                    <div class="w-12 h-12 skeleton rounded-full"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 skeleton w-24"></div>
                        <div class="h-3 skeleton w-16"></div>
                    </div>
                </div>
            </div>

            <!-- Recently Added Container (Mocked via Public Query) -->
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4 text-emerald-500"></i> Just Added
                </h3>
                <div id="recent-container" class="space-y-4">
                     ${[1,2,3].map(i => `<div class="h-16 skeleton"></div>`).join('')}
                </div>
            </div>
        </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Fetch Data
  try {
    const [topUserResult, trendingResult, recentResult] = await Promise.allSettled([
      noteService.getTopContributor(),
      noteService.getTrending(),
      noteService.getPublicNotes(1, 4, "")
    ]);

    // Top Contributor logic
    const topUser = topUserResult.status === 'fulfilled' ? topUserResult.value : null;
    const topUserWidget = document.getElementById("top-user-widget");
    
    if (topUser) {
        topUserWidget.innerHTML = `
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-knest-blue/30 bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
               <i data-lucide="user" class="text-slate-400 w-6 h-6"></i>
            </div>
            <div>
                <h4 class="font-bold text-slate-900 dark:text-white line-clamp-1">${topUser.username || topUser.name || "Unknown"}</h4>
                <p class="text-sm text-knest-blue font-medium">${topUser.total_notes || 0} uploads</p>
            </div>
        `;
    } else {
        topUserWidget.innerHTML = `<div class="text-slate-500 text-sm italic">Not available right now</div>`;
    }

    // Trending Notes logic
    const trending = trendingResult.status === 'fulfilled' ? trendingResult.value : null;
    const trendingContainer = document.getElementById("trending-container");
    trendingContainer.innerHTML = ""; 

    if (!trending || trending.length === 0) {
      trendingContainer.innerHTML = `
        <div class="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <i data-lucide="inbox" class="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600"></i>
            <p>No trending notes this week.</p>
        </div>
      `;
    } else {
      trending.slice(0, 4).forEach(note => {
        trendingContainer.appendChild(createNoteCard(note));
      });
    }

    // Recent Notes logic
    const recent = recentResult.status === 'fulfilled' && recentResult.value ? recentResult.value.results : null;
    const recentContainer = document.getElementById("recent-container");
    recentContainer.innerHTML = "";

    if (!recent || recent.length === 0) {
        recentContainer.innerHTML = `<p class="text-sm text-slate-500 italic">No recent uploads.</p>`;
    } else {
        recent.forEach(note => {
            recentContainer.innerHTML += `
               <a href="#note?id=${note.id}" class="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group cursor-pointer block border border-transparent hover:border-slate-200 dark:hover:border-white/5">
                   <div class="w-8 h-8 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500 group-hover:text-knest-blue transition-colors">
                       ${note.file_url?.split('.').pop()?.substring(0,3)?.toUpperCase() || 'DOC'}
                   </div>
                   <div class="flex-1 min-w-0">
                       <p class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-knest-blue transition-colors">${note.title}</p>
                       <p class="text-xs text-slate-400 truncate">${new Date(note.created_at).toLocaleDateString()}</p>
                   </div>
               </a>
            `;
        });
    }

    if (window.lucide) window.lucide.createIcons();

  } catch (error) {
    console.error("Home loading error:", error);
  }
}
