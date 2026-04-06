import { noteService } from "../api/noteService.js";
import { showToast } from "./popup.js";

// Helper for Mock Bookmarking
export function toggleBookmark(noteId, cardElement) {
    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const isBookmarked = saved.includes(noteId);
    
    if (isBookmarked) {
        localStorage.setItem("bookmarks", JSON.stringify(saved.filter(id => id !== noteId)));
        showToast("Removed from Library", "info");
        cardElement.querySelector('.bookmark-icon').classList.remove('fill-knest-blue', 'text-knest-blue');
    } else {
        saved.push(noteId);
        localStorage.setItem("bookmarks", JSON.stringify(saved));
        showToast("Added to Library", "success");
        cardElement.querySelector('.bookmark-icon').classList.add('fill-knest-blue', 'text-knest-blue');
    }
}

export function createNoteCard(note) {
  const upvotes = parseInt(note.upvotes) || 0;
  const downvotes = parseInt(note.downvotes) || 0;
  const netScore = upvotes - downvotes;
  
  const id = note.id;
  
  // Track mock bookmark state
  const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  const isBookmarked = savedBookmarks.includes(id);

  const card = document.createElement("div");
  card.className = "p-6 flex flex-col justify-between h-full group bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-sm hover:shadow-xl transition-all";

  // Infer tags or use generic
  const fileExt = note.file_url ? note.file_url.split('.').pop().toUpperCase() : 'DOC';

  card.innerHTML = `
    <!-- Bookmark action layer -->
    <div class="absolute top-4 right-4 z-10 flex gap-2">
        <button class="bookmark-btn p-2 rounded-full bg-slate-50 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-white/10 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
            <i data-lucide="bookmark" class="bookmark-icon w-4 h-4 text-slate-400 hover:text-knest-blue transition-colors ${isBookmarked ? 'fill-knest-blue text-knest-blue' : ''}"></i>
        </button>
    </div>

    <div class="mb-4 pt-1">
      <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] uppercase font-bold tracking-wider">${fileExt}</span>
          ${netScore > 10 ? `<span class="px-2 py-1 rounded bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1"><i data-lucide="flame" class="w-3 h-3"></i> HOT</span>` : ''}
      </div>
      <div class="flex justify-between items-start mb-2 pr-8">
        <h3 class="text-xl font-bold font-heading line-clamp-1 group-hover:text-knest-blue transition-colors cursor-pointer text-slate-800 dark:text-white" id="goto-note-${id}">${note.title}</h3>
      </div>
      <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-2 leading-relaxed">${note.description}</p>
    </div>
    
    <div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4 mt-auto">
      <div class="flex items-center gap-1 text-slate-500 dark:text-slate-300">
        <button id="upvote-${id}" class="hover:text-green-500 transition-colors flex items-center p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <i data-lucide="arrow-up" class="w-4 h-4"></i>
        </button>
        <span class="font-bold text-sm w-4 text-center text-slate-700 dark:text-slate-200" title="${upvotes} Up, ${downvotes} Down">${netScore}</span>
        <button id="downvote-${id}" class="hover:text-red-500 transition-colors flex items-center p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <i data-lucide="arrow-down" class="w-4 h-4"></i>
        </button>
      </div>

      <button id="download-${id}" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-knest-blue/10 text-knest-blue hover:bg-knest-blue hover:text-white transition-all text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
          <i data-lucide="download" class="w-4 h-4"></i> Save
      </button>
    </div>
  `;

  // Attach events
  const goBtn = card.querySelector(`#goto-note-${id}`);
  if (goBtn) goBtn.addEventListener("click", () => {
    window.location.hash = `#note?id=${id}`;
  });

  const upBtn = card.querySelector(`#upvote-${id}`);
  if (upBtn) {
    upBtn.addEventListener("click", async () => {
      try {
        await noteService.voteNote(id, "upvote");
        showToast("Upvoted successfully", "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  const downBtn = card.querySelector(`#downvote-${id}`);
  if (downBtn) {
    downBtn.addEventListener("click", async () => {
      try {
        await noteService.voteNote(id, "downvote");
        showToast("Downvoted successfully", "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  const downloadBtn = card.querySelector(`#download-${id}`);
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      try {
        await noteService.downloadNote(id);
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  const bookmarkBtn = card.querySelector('.bookmark-btn');
  if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleBookmark(id, card);
      });
  }

  return card;
}
