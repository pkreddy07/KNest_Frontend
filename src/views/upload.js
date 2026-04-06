import { noteService } from "../api/noteService.js";
import { showToast } from "../components/popup.js";

export function renderUpload(container) {
  if (!localStorage.getItem("token")) {
    window.location.hash = "#login";
    return;
  }

  container.innerHTML = `
    <div class="max-w-2xl mx-auto glass border-t-4 border-t-[#8B5CF6] rounded-xl shadow-2xl p-8 slide-up">
        <h2 class="text-3xl font-heading font-black mb-2">Upload Note</h2>
        <p class="text-slate-400 mb-8">Share your knowledge with the KNest community.</p>

        <form id="upload-form" class="flex flex-col gap-6">
            
            <!-- File Drop Zone -->
            <div id="drop-zone" class="border-2 border-dashed border-white/20 hover:border-knest-blue rounded-xl p-10 text-center transition-colors cursor-pointer bg-white/5 relative">
                <input type="file" id="file" name="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required>
                <div class="pointer-events-none flex flex-col items-center">
                    <span class="material-icons text-5xl text-knest-blue mb-2">cloud_upload</span>
                    <p class="text-lg font-medium" id="file-name-display">Click or drag file to upload</p>
                    <p class="text-sm text-slate-400">PDF, DOCX, ZIP, IMAGES up to 50MB</p>
                </div>
            </div>

            <div>
                <label class="block font-medium text-slate-300 mb-2">Title</label>
                <input type="text" id="title" name="title" class="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-knest-blue focus:outline-none" required placeholder="E.g., Quantum Physics Lecture 3">
            </div>

            <div>
                <label class="block font-medium text-slate-300 mb-2">Description / Tags</label>
                <textarea id="description" name="description" rows="4" class="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-knest-blue focus:outline-none resize-none" required placeholder="Describe the contents..."></textarea>
            </div>

            <div class="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="show-author" name="allow_public_author" class="sr-only peer" checked>
                  <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-knest-blue"></div>
                </label>
                <span class="text-slate-300 font-medium">Show my name as the author</span>
            </div>

            <div class="flex items-center gap-2 mt-2">
                <input type="checkbox" id="terms" required class="w-4 h-4 rounded text-knest-blue bg-gray-700 border-gray-600 focus:ring-knest-blue focus:ring-2">
                <label for="terms" class="text-sm text-slate-400">I confirm this material does not violate copyright laws.</label>
            </div>

            <button type="submit" class="w-full bg-knest-blue hover:bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-500/20 transition-all text-lg flex items-center justify-center gap-2">
                <span class="material-icons">publish</span> Publish Note
            </button>
        </form>
    </div>
  `;

  // File Input UI Handle
  const fileInput = document.getElementById("file");
  const fileNameDisplay = document.getElementById("file-name-display");
  const dropZone = document.getElementById("drop-zone");

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      fileNameDisplay.textContent = e.target.files[0].name;
      fileNameDisplay.classList.add("text-green-400");
    }
  });

  // Drag visual feedback
  dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("border-knest-blue", "bg-knest-blue/10");
  });
  dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("border-knest-blue", "bg-knest-blue/10");
  });
  dropZone.addEventListener("drop", () => {
      dropZone.classList.remove("border-knest-blue", "bg-knest-blue/10");
  });

  // Submission Handle
  const form = document.getElementById("upload-form");
  
  form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      
      try {
          btn.disabled = true;
          btn.innerHTML = `<span class="material-icons animate-spin">refresh</span> Uploading...`;

          const formData = new FormData(form);
          const showAuthor = document.getElementById("show-author").checked;
          
          formData.set("allow_public_author", showAuthor ? "1" : "0");
          
          await noteService.uploadNote(formData);
          
          showToast("Note uploaded successfully!", "success");
          window.location.hash = "#home";
      } catch (err) {
          showToast(err.message, "error");
      } finally {
          btn.disabled = false;
          btn.innerHTML = originalText;
      }
  });
}
