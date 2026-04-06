import { noteService } from "../api/noteService.js";
import { showToast } from "../components/popup.js";

export async function renderNoteDetail(container) {
  const hashObj = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const noteId = hashObj.get("id");

  if (!noteId) {
    window.location.hash = "#home";
    return;
  }

  container.innerHTML = `
    <div class="max-w-4xl mx-auto">
        <a href="javascript:history.back()" class="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
            <span class="material-icons text-sm">arrow_back</span> Back
        </a>

        <div id="note-content" class="glass-card p-8 md:p-12 slide-up">
            <div class="text-center py-12"><span class="material-icons animate-spin text-4xl text-knest-blue">refresh</span></div>
        </div>
    </div>
  `;

  try {
    const note = await noteService.getNoteById(noteId);
    if (!note) throw new Error("Note not found");

    const contentBox = document.getElementById("note-content");
    
    // Note details structure based on backend schema
    contentBox.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-white/10 pb-8 mb-8">
            <div class="flex-1">
                <h1 class="text-3xl md:text-5xl font-black font-heading mb-4 text-white">${note.title}</h1>
                <div class="flex items-center gap-4 text-slate-400 text-sm">
                    <span class="flex items-center gap-1"><span class="material-icons text-sm">person</span> ${note.allow_public_author ? note.username : "Anonymous"}</span>
                    <span class="flex items-center gap-1"><span class="material-icons text-sm">visibility</span> ${note.views || 0} Views</span>
                    <span class="flex items-center gap-1"><span class="material-icons text-sm">event</span> ${new Date(note.created_at).toLocaleDateString()}</span>
                </div>
            </div>
            
            <button id="detail-download-btn" class="w-full md:w-auto bg-knest-blue hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 flex-shrink-0">
                <span class="material-icons">download</span> Download File
            </button>
        </div>

        <div class="prose prose-invert max-w-none">
            <h3 class="text-xl font-bold mb-4 font-heading">Description</h3>
            <p class="text-slate-300 leading-relaxed whitespace-pre-line">${note.description}</p>
        </div>

        <div class="mt-12 flex items-center justify-between bg-slate-800/50 p-6 rounded-xl border border-white/5">
            <div class="flex gap-4">
                <button id="detail-upvote" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-green-500/20 hover:text-green-400 transition-colors">
                    <span class="material-icons">thumb_up</span> Upvote
                </button>
                <button id="detail-downvote" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                    <span class="material-icons">thumb_down</span> Downvote
                </button>
            </div>
            
            <button id="detail-report" class="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-sm">
                <span class="material-icons text-sm">flag</span> Report Content
            </button>
        </div>
    `;

    // Bind events
    document.getElementById("detail-download-btn").addEventListener("click", async () => {
        try {
            await noteService.downloadNote(note.id);
        } catch(e) {
            showToast(e.message, "error");
        }
    });
    
    document.getElementById("detail-upvote").addEventListener("click", async () => {
        try {
            await noteService.voteNote(note.id, "upvote");
            showToast("Voted successfully", "success");
        } catch(e) { showToast(e.message, "error"); }
    });
    
    document.getElementById("detail-downvote").addEventListener("click", async () => {
        try {
            await noteService.voteNote(note.id, "downvote");
            showToast("Downvoted successfully", "success");
        } catch(e) { showToast(e.message, "error"); }
    });

    document.getElementById("detail-report").addEventListener("click", async () => {
        const reason = prompt("Please enter a reason for reporting this note:");
        if (reason) {
            try {
                await noteService.reportNote(note.id, reason);
                showToast("Report submitted.", "info");
            } catch(e) { showToast(e.message, "error"); }
        }
    });

  } catch (err) {
      document.getElementById("note-content").innerHTML = `
        <div class="text-center py-12">
            <span class="material-icons text-6xl text-red-500 mb-4">error_outline</span>
            <h2 class="text-2xl font-bold mb-2">Error loading note</h2>
            <p class="text-slate-400">${err.message}</p>
        </div>
      `;
  }
}
