import { authService } from "../api/authService.js";
import { noteService } from "../api/noteService.js";
import { createNoteCard } from "../components/noteCard.js";
import { showToast } from "../components/popup.js";

export async function renderProfile(container) {
  if (!localStorage.getItem("token")) {
    window.location.hash = "#login";
    return;
  }

  // Check URL hash for direct tab intent (from sidebar)
  const isLibraryIntent = window.location.hash.includes("tab=saved");

  container.innerHTML = `
    <!-- Top Stats / Profile Header -->
    <div class="glass-card p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start relative slide-up mb-12 rounded-3xl border-0 bg-gradient-to-r from-knest-blue/10 to-transparent">
        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900 flex-shrink-0 flex items-center justify-center relative group cursor-pointer">
            <span id="profile-avatar" class="text-4xl font-black text-slate-400">?</span>
            <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                <i data-lucide="camera" class="w-8 h-8 text-white"></i>
            </div>
        </div>
        
        <div class="flex-1 text-center md:text-left">
            <h2 class="text-3xl md:text-5xl font-black font-heading mb-2 text-slate-900 dark:text-white" id="profile-name">Loading...</h2>
            <p class="text-knest-blue font-bold mb-4 flex items-center justify-center md:justify-start gap-2 text-lg">
                <i data-lucide="graduation-cap" class="w-5 h-5"></i>
                <span id="profile-institute">Fetching institute...</span>
            </p>
            
            <div class="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                <div class="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div class="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-lg"><i data-lucide="upload-cloud" class="w-5 h-5"></i></div>
                    <div><p class="text-xs font-bold text-slate-500 uppercase">Uploads</p><p id="stat-uploads" class="text-xl font-black text-slate-900 dark:text-white">0</p></div>
                </div>
                <div class="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div class="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-lg"><i data-lucide="heart" class="w-5 h-5"></i></div>
                    <div><p class="text-xs font-bold text-slate-500 uppercase">Reputation</p><p id="stat-rep" class="text-xl font-black text-slate-900 dark:text-white">0</p></div>
                </div>
            </div>

            <!-- Basic Mock Activity Graph -->
            <div class="mt-6 md:mt-8 hidden sm:block">
                <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 text-center md:text-left">Recent Activity</p>
                <div class="flex gap-1 items-center justify-center md:justify-start opacity-70 hover:opacity-100 transition-opacity">
                    ${[...Array(14)].map((_, i) => `<div class="w-4 h-4 rounded-sm ${Math.random() > 0.6 ? 'bg-knest-blue' : (Math.random() > 0.8 ? 'bg-knest-blue/60' : 'bg-slate-200 dark:bg-slate-700')}" title="Activity day ${14-i}"></div>`).join('')}
                </div>
            </div>
        </div>

        <button onclick="alert('Profile updates are UI mapped externally. (Endpoint Missing)')" class="md:absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-slate-700 dark:text-slate-300 text-sm shadow-sm group">
            <i data-lucide="pencil" class="w-4 h-4 group-hover:text-knest-blue transition-colors"></i> Edit Profile
        </button>
    </div>

    <!-- Tabs System -->
    <div class="flex items-center gap-8 border-b border-slate-200 dark:border-white/10 mb-8 slide-up" style="animation-delay: 0.1s">
        <button id="tab-uploads" class="${!isLibraryIntent ? 'text-knest-blue border-b-2 border-knest-blue' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'} pb-4 font-bold transition-colors flex items-center gap-2">
            <i data-lucide="files" class="w-4 h-4"></i> My Uploads
        </button>
        <button id="tab-saved" class="${isLibraryIntent ? 'text-knest-blue border-b-2 border-knest-blue' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'} pb-4 font-bold transition-colors flex items-center gap-2">
            <i data-lucide="bookmark" class="w-4 h-4"></i> Saved Library
        </button>
    </div>
        
    <!-- Dynamic Inject Container -->
    <div id="tab-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 slide-up" style="animation-delay: 0.2s">
        ${[1,2,3,4].map(i => `<div class="h-64 skeleton"></div>`).join('')}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  try {
    const [user, myNotes] = await Promise.all([
      authService.getMe(),
      noteService.getMyNotes()
    ]);

    document.getElementById("profile-name").textContent = user.username || "User";
    document.getElementById("profile-institute").textContent = user.institute || "Global Academy";
    
    // Inject avatar initials
    const avatarEl = document.getElementById("profile-avatar");
    if (user.profile_photo) {
        avatarEl.parentElement.innerHTML = `<img src="${user.profile_photo}" class="w-full h-full object-cover">`;
    } else {
        avatarEl.textContent = (user.username || "U")[0].toUpperCase();
    }

    // Assign stats globally
    document.getElementById("stat-uploads").textContent = myNotes?.length || 0;
    
    let totalRep = 0;
    myNotes?.forEach(n => {
        totalRep += (parseInt(n.upvotes || 0) + parseInt(n.views || 0));
    });
    document.getElementById("stat-rep").textContent = totalRep;

    const tabContainer = document.getElementById("tab-container");
    const tabBtnUploads = document.getElementById("tab-uploads");
    const tabBtnSaved = document.getElementById("tab-saved");

    const renderMyUploads = () => {
        tabBtnUploads.className = "text-knest-blue border-b-2 border-knest-blue pb-4 font-bold transition-colors flex items-center gap-2";
        tabBtnSaved.className = "text-slate-500 hover:text-slate-800 dark:hover:text-white pb-4 font-bold transition-colors flex items-center gap-2";
        
        tabContainer.innerHTML = "";
        if (!myNotes || myNotes.length === 0) {
            tabContainer.innerHTML = `<div class="col-span-full py-16 text-center glass-card rounded-2xl border-dashed">
                <i data-lucide="inbox" class="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4"></i>
                <h3 class="font-bold text-xl mb-2 text-slate-800 dark:text-white">Start Building Your Portfolio</h3>
                <p class="text-slate-500 mb-6 font-medium">You haven't uploaded any notes yet.</p>
                <a href="#upload" class="bg-knest-blue text-white px-6 py-2 rounded-lg font-bold shadow-lg inline-block hover:-translate-y-1 transition-all">Upload Now</a>
            </div>`;
        } else {
            myNotes.forEach(note => {
                const card = createNoteCard(note);
                // Wrapper to inject delete specific to owner profile
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "absolute top-4 left-4 z-20 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all shadow-sm flex items-center justify-center border border-red-200 group/del hover:scale-110";
                deleteBtn.innerHTML = `<i data-lucide="trash-2" class="w-4 h-4"></i>`;
                deleteBtn.onclick = async (e) => {
                    e.stopPropagation();
                    if (confirm("Are you sure you want to delete this note permanently?")) {
                        await noteService.deleteNote(note.id);
                        card.remove();
                        showToast("Note deleted.", "success");
                    }
                };
                card.appendChild(deleteBtn);
                tabContainer.appendChild(card);
            });
        }
        if (window.lucide) window.lucide.createIcons();
    };

    const renderLibrary = async () => {
        tabBtnSaved.className = "text-knest-blue border-b-2 border-knest-blue pb-4 font-bold transition-colors flex items-center gap-2";
        tabBtnUploads.className = "text-slate-500 hover:text-slate-800 dark:hover:text-white pb-4 font-bold transition-colors flex items-center gap-2";
        
        tabContainer.innerHTML = `${[1,2].map(i => `<div class="h-64 skeleton"></div>`).join('')}`;
        
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        if (bookmarks.length === 0) {
            tabContainer.innerHTML = `<div class="col-span-full py-16 text-center glass-card rounded-2xl border-dashed">
                <i data-lucide="bookmark-minus" class="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4"></i>
                <h3 class="font-bold text-xl mb-2 text-slate-800 dark:text-white">Your Library is Empty</h3>
                <p class="text-slate-500 font-medium">Click the bookmark icon on any note to save it here.</p>
            </div>`;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        try {
            // Aggregate fetching logic (Because backend has no bulk ID fetch we run parallel GETs)
            const resolvedNotes = await Promise.all(
                bookmarks.map(id => noteService.getNoteById(id).catch(e => null))
            );
            
            tabContainer.innerHTML = "";
            const valid = resolvedNotes.filter(n => n !== null);
            valid.forEach(note => tabContainer.appendChild(createNoteCard(note)));

            if(valid.length === 0) tabContainer.innerHTML = `<p class="col-span-full">Bookmarked items are no longer available.</p>`;

        } catch (error) {
            showToast("Failed resolving library", "error");
        }
        if (window.lucide) window.lucide.createIcons();
    };

    // Bind Tabs
    tabBtnUploads.addEventListener("click", renderMyUploads);
    tabBtnSaved.addEventListener("click", renderLibrary);

    // Initial render switch
    if (isLibraryIntent) {
        renderLibrary();
    } else {
        renderMyUploads();
    }

  } catch (err) {
    showToast(err.message, "error");
  }
}
