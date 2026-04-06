(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))t(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function o(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(a){if(a.ep)return;a.ep=!0;const s=o(a);fetch(a.href,s)}})();const y="http://localhost:5000/api";async function c(n,e={}){var a;const o=localStorage.getItem("token"),t={...e.headers};o&&(t.Authorization=`Bearer ${o}`),e.body&&!(e.body instanceof FormData)&&(t["Content-Type"]="application/json",e.body=JSON.stringify(e.body));try{const s=await fetch(`${y}${n}`,{...e,headers:t}),r=((a=s.headers.get("content-type"))==null?void 0:a.includes("application/json"))?await s.json():await s.text();if(!s.ok)throw(s.status===401||s.status===403)&&(localStorage.removeItem("token"),window.location.hash="#login"),new Error(r.message||r||"API Error");return r}catch(s){throw console.error(`API calls failed at ${n}:`,s),s}}const b={login:(n,e)=>c("/auth/login",{method:"POST",body:{email:n,password:e}}),register:n=>c("/auth/register",{method:"POST",body:n}),verifyEmail:(n,e)=>c("/auth/verify",{method:"POST",body:{userId:n,otp:e}}),logout:()=>{localStorage.removeItem("token"),window.location.hash="#login"},getMe:()=>c("/auth/me",{method:"GET"})};function x(){const n=localStorage.getItem("token"),e=`
    <nav class="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#home" class="flex items-center gap-2">
          <span class="material-icons text-knest-blue text-3xl">menu_book</span>
          <span class="text-2xl font-black font-heading tracking-tight text-white">
            K<span class="text-knest-blue">Nest</span>
          </span>
        </a>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6 font-medium">
          <a href="#home" class="hover:text-knest-blue transition-colors">Home</a>
          <a href="#search" class="hover:text-knest-blue transition-colors">Discover</a>
          
          ${n?`
            <a href="#upload" class="bg-knest-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow shadow-blue-500/20">
              Upload
            </a>
            <div class="relative group">
              <button class="flex items-center gap-2 hover:text-knest-blue transition-colors outline-none cursor-pointer">
                <span class="material-icons">account_circle</span>
              </button>
              <div class="absolute right-0 top-full mt-2 w-48 glass rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 border border-white/10">
                <a href="#profile" class="px-4 py-2 hover:bg-white/5 transition-colors">My Profile</a>
                <button id="logout-btn" class="text-left w-full px-4 py-2 text-red-400 hover:bg-white/5 transition-colors">Logout</button>
              </div>
            </div>
          `:`
            <a href="#login" class="hover:text-knest-blue transition-colors">Login</a>
            <a href="#register" class="bg-white text-knest-dark hover:bg-gray-200 px-4 py-2 rounded-lg transition-all font-bold">Sign Up</a>
          `}
        </div>

        <!-- Mobile Menu Button -->
        <button id="mobile-menu-btn" class="md:hidden text-white hover:text-knest-blue">
          <span class="material-icons text-3xl">menu</span>
        </button>
      </div>
      
      <!-- Mobile Dropdown -->
      <div id="mobile-menu" class="hidden md:hidden absolute top-full left-0 right-0 glass border-b border-white/10 flex-col p-4 gap-4 shadow-xl">
          <a href="#home" class="block w-full py-2 border-b border-white/5">Home</a>
          <a href="#search" class="block w-full py-2 border-b border-white/5">Discover</a>
          ${n?`
            <a href="#upload" class="block w-full py-2 text-knest-blue font-bold border-b border-white/5">Upload Note</a>
            <a href="#profile" class="block w-full py-2 border-b border-white/5">My Profile</a>
            <button id="mobile-logout-btn" class="text-left w-full py-2 text-red-400">Logout</button>
          `:`
            <a href="#login" class="block w-full py-2 border-b border-white/5">Login</a>
            <a href="#register" class="block w-full py-2">Sign Up</a>
          `}
      </div>
    </nav>
  `;document.getElementById("nav-container").innerHTML=e;const o=document.getElementById("mobile-menu-btn"),t=document.getElementById("mobile-menu");o&&t&&o.addEventListener("click",()=>{t.classList.toggle("hidden"),t.classList.toggle("flex")});const a=()=>{b.logout()},s=document.getElementById("logout-btn");s&&s.addEventListener("click",a);const l=document.getElementById("mobile-logout-btn");l&&l.addEventListener("click",a)}const u={uploadNote:n=>c("/notes/upload",{method:"POST",body:n}),getPublicNotes:(n=1,e=10,o="")=>c(`/notes/public?page=${n}&limit=${e}&search=${encodeURIComponent(o)}`,{method:"GET"}),getMyNotes:()=>c("/notes/my-notes",{method:"GET"}),getNoteById:n=>c(`/notes/${n}`,{method:"GET"}),deleteNote:n=>c(`/notes/${n}`,{method:"DELETE"}),getTrending:()=>c("/notes/trending",{method:"GET"}),getRecommended:()=>c("/notes/recommended",{method:"GET"}),getTopContributor:()=>c("/notes/top-contributor",{method:"GET"}),voteNote:(n,e)=>c(`/notes/${n}/vote`,{method:"POST",body:{vote_type:e}}),reportNote:(n,e)=>c(`/notes/${n}`,{method:"POST",body:{reason:e}}),downloadNote:async n=>{const e=localStorage.getItem("token");window.open(`http://localhost:5000/api/notes/download/${n}?token=${e}`,"_blank")}};function d(n,e="info"){const o=document.getElementById("toast-container");if(!o)return;const t=document.createElement("div"),a=e==="error"?"bg-red-500":e==="success"?"bg-green-500":"bg-knest-panel";t.className=`glass ${a} text-white px-6 py-3 rounded-lg shadow-xl fade-in flex items-center gap-3`,t.innerHTML=`
    <span class="material-icons">${e==="error"?"error":e==="success"?"check_circle":"info"}</span>
    <span class="font-medium">${n}</span>
  `,o.appendChild(t),setTimeout(()=>{t.style.animation="slideUp 0.3s ease-in reverse forwards",setTimeout(()=>t.remove(),300)},3e3)}function h(n){const e=parseInt(n.upvotes)||0,o=n.id,t=document.createElement("div");t.className="glass-card p-6 flex flex-col justify-between h-full group bg-slate-800/80 min-w-[300px]",t.innerHTML=`
    <div class="mb-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-xl font-bold font-heading line-clamp-1 group-hover:text-knest-blue transition-colors cursor-pointer" id="goto-note-${o}">${n.title}</h3>
      </div>
      <p class="text-slate-400 text-sm line-clamp-3">${n.description}</p>
    </div>
    <div class="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
      <div class="flex items-center gap-1 text-slate-300">
        <button id="upvote-${o}" class="hover:text-green-400 transition-colors flex items-center p-1 rounded-full hover:bg-white/5">
            <span class="material-icons text-base">thumb_up</span>
        </button>
        <span class="font-medium text-sm w-4 text-center">${e}</span>
        <button id="downvote-${o}" class="hover:text-red-400 transition-colors flex items-center p-1 rounded-full hover:bg-white/5">
            <span class="material-icons text-base">thumb_down</span>
        </button>
      </div>
      
      <button id="download-${o}" class="bg-knest-blue/10 text-knest-blue hover:bg-knest-blue hover:text-white rounded-full p-2 transition-all">
        <span class="material-icons">download</span>
      </button>
    </div>
  `;const a=t.querySelector(`#goto-note-${o}`);a&&a.addEventListener("click",()=>window.location.hash=`#note?id=${o}`);const s=t.querySelector(`#upvote-${o}`);s&&s.addEventListener("click",async()=>{try{await u.voteNote(o,"upvote"),d("Voted!","success")}catch(i){d(i.message,"error")}});const l=t.querySelector(`#downvote-${o}`);l&&l.addEventListener("click",async()=>{try{await u.voteNote(o,"downvote"),d("Voted down","success")}catch(i){d(i.message,"error")}});const r=t.querySelector(`#download-${o}`);return r&&r.addEventListener("click",()=>u.downloadNote(o)),t}async function f(n){n.innerHTML=`
    <!-- Top section -->
    <section class="glass-card p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-knest-blue slide-up">
        <div class="flex items-center gap-8">
            <div class="relative">
                <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-knest-dark bg-slate-800 flex items-center justify-center text-4xl shadow-2xl">🏆</div>
            </div>
            <div>
                <h2 class="text-3xl md:text-5xl font-heading font-black mb-2 text-white" id="top-user-name">Loading...</h2>
                <p class="text-knest-blue font-semibold tracking-wide uppercase text-sm md:text-base">Top Contributor</p>
            </div>
        </div>
        <div class="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-2xl min-w-[200px]">
            <span class="text-4xl md:text-5xl font-black text-gradient" id="top-user-uploads">-</span>
            <span class="text-slate-400 mt-2 font-medium">Uploads</span>
        </div>
    </section>

    <!-- Trending section -->
    <section class="slide-up" style="animation-delay: 0.1s">
        <h3 class="heading-cursive text-[#8B5CF6] mb-8">Trending Now</h3>
        <div id="trending-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div class="col-span-full py-12 text-center text-slate-400">Loading trending files...</div>
        </div>
    </section>
  `;try{const[e,o]=await Promise.all([u.getTopContributor(),u.getTrending()]),t=document.getElementById("top-user-name"),a=document.getElementById("top-user-uploads");e?(t.textContent=e.username||e.name||"Unknown",a.textContent=e.total_notes):(t.textContent="No Data",a.textContent="0");const s=document.getElementById("trending-container");s.innerHTML="",!o||o.length===0?s.innerHTML='<div class="col-span-full text-center text-slate-500 py-8">No trending notes found.</div>':o.forEach(l=>{s.appendChild(h(l))})}catch(e){console.error("Home loading error:",e);const o=document.getElementById("trending-container");o&&(o.innerHTML='<div class="col-span-full py-8 text-center text-red-400">Failed to load content.</div>')}}function g(n,e="login"){const o=e==="login";n.innerHTML=`
    <div class="max-w-md mx-auto glass-card p-8 mt-12 slide-up">
      <h2 class="text-3xl font-black font-heading mb-6 text-center">${o?"Welcome Back":"Join KNest"}</h2>
      
      <form id="auth-form" class="flex flex-col gap-4">
        ${o?"":`
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input type="text" id="username" class="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-knest-blue transition-colors" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Institute</label>
            <input type="text" id="institute" class="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-knest-blue transition-colors">
          </div>
        `}

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input type="email" id="email" class="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-knest-blue transition-colors" required>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input type="password" id="password" class="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-knest-blue transition-colors" required>
        </div>

        <button type="submit" class="w-full bg-knest-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 transition-colors shadow-lg shadow-blue-500/20">
          ${o?"Login":"Sign Up"}
        </button>
      </form>

      <!-- OTP Section (Hidden initially) -->
      <form id="otp-form" class="hidden flex-col gap-4 mt-6 pt-6 border-t border-white/10">
        <p class="text-sm text-green-400 text-center mb-2">Check your email for the OTP</p>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Enter OTP</label>
          <input type="text" id="otp" class="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white text-center tracking-[0.5em] text-xl focus:outline-none focus:border-knest-blue" placeholder="000000" maxlength="6" required>
        </div>
        <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
          Verify & Login
        </button>
      </form>

      <div class="mt-6 text-center text-slate-400 text-sm">
        ${o?`Don't have an account? <a href="#register" class="text-knest-blue hover:underline">Sign up</a>`:'Already have an account? <a href="#login" class="text-knest-blue hover:underline">Login</a>'}
      </div>
    </div>
  `;let t=null;const a=document.getElementById("auth-form"),s=document.getElementById("otp-form");a.addEventListener("submit",async l=>{l.preventDefault();const r=a.querySelector('button[type="submit"]');try{r.disabled=!0,r.innerHTML='<span class="material-icons animate-spin">refresh</span>';const i=document.getElementById("email").value,m=document.getElementById("password").value;if(o){const p=await b.login(i,m);localStorage.setItem("token",p.token),x(),d("Logged in successfully!","success"),window.location.hash="#home"}else{const p=document.getElementById("username").value,w=document.getElementById("institute").value;t=(await b.register({username:p,email:i,password:m,institute:w})).userId,a.classList.add("opacity-50","pointer-events-none"),s.classList.remove("hidden"),s.classList.add("flex"),d("OTP sent to your email","info")}}catch(i){d(i.message||"Failed Authentication","error")}finally{r.disabled=!1,r.textContent=o?"Login":"Sign Up"}}),s.addEventListener("submit",async l=>{l.preventDefault();const r=s.querySelector('button[type="submit"]');try{r.disabled=!0;const i=document.getElementById("otp").value;await b.verifyEmail(t,i),d("Email verified! Please log in.","success"),window.location.hash="#login"}catch(i){d(i.message,"error")}finally{r.disabled=!1}})}function k(n){if(!localStorage.getItem("token")){window.location.hash="#login";return}n.innerHTML=`
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
  `;const e=document.getElementById("file"),o=document.getElementById("file-name-display"),t=document.getElementById("drop-zone");e.addEventListener("change",s=>{s.target.files.length>0&&(o.textContent=s.target.files[0].name,o.classList.add("text-green-400"))}),t.addEventListener("dragover",s=>{s.preventDefault(),t.classList.add("border-knest-blue","bg-knest-blue/10")}),t.addEventListener("dragleave",()=>{t.classList.remove("border-knest-blue","bg-knest-blue/10")}),t.addEventListener("drop",()=>{t.classList.remove("border-knest-blue","bg-knest-blue/10")});const a=document.getElementById("upload-form");a.addEventListener("submit",async s=>{s.preventDefault();const l=a.querySelector('button[type="submit"]'),r=l.innerHTML;try{l.disabled=!0,l.innerHTML='<span class="material-icons animate-spin">refresh</span> Uploading...';const i=new FormData(a),m=document.getElementById("show-author").checked;i.set("allow_public_author",m?"1":"0"),await u.uploadNote(i),d("Note uploaded successfully!","success"),window.location.hash="#home"}catch(i){d(i.message,"error")}finally{l.disabled=!1,l.innerHTML=r}})}function E(n){const o=new URLSearchParams(window.location.hash.split("?")[1]||"").get("q")||"";n.innerHTML=`
    <div class="mb-12 slide-up text-center">
        <h2 class="text-4xl font-black font-heading mb-4">Discover Resources</h2>
        <p class="text-slate-400 max-w-2xl mx-auto mb-8">Search through thousands of verified notes, past papers, and study materials uploaded by the community.</p>
        
        <form id="search-form" class="max-w-3xl mx-auto flex gap-2">
            <div class="relative flex-1">
                <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input type="text" id="search-input" value="${o}" class="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-knest-blue transition-colors text-lg" placeholder="Search by topic, keyword, or title...">
            </div>
            <button type="submit" class="bg-knest-blue hover:bg-blue-600 text-white px-8 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20">
                Search
            </button>
        </form>
    </div>

    <div class="flex justify-between items-center mb-6 slide-up" style="animation-delay: 0.1s">
        <h3 class="text-xl font-bold font-heading">Search Results</h3>
        <span class="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full"><span id="result-count">0</span> matching notes</span>
    </div>

    <div id="results-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 slide-up" style="animation-delay: 0.2s">
        <!-- Results inject here -->
    </div>
    
    <div id="loader" class="hidden text-center py-12 w-full col-span-full">
        <span class="material-icons animate-spin text-knest-blue text-4xl">refresh</span>
    </div>
  `;const t=document.getElementById("results-container"),a=document.getElementById("result-count"),s=document.getElementById("loader"),l=async r=>{var i;try{t.innerHTML="",s.classList.remove("hidden"),window.history.replaceState(null,null,`#search?q=${encodeURIComponent(r)}`);const m=await u.getPublicNotes(1,40,r);if(s.classList.add("hidden"),a.textContent=((i=m.results)==null?void 0:i.length)||0,!m.results||m.results.length===0){t.innerHTML=`
                <div class="col-span-full text-center py-16 glass rounded-xl border border-white/5">
                    <span class="material-icons text-6xl text-slate-600 mb-4">search_off</span>
                    <h3 class="text-xl font-bold mb-2">No results found</h3>
                    <p class="text-slate-400">Try adjusting your search terms or keywords.</p>
                </div>
            `;return}m.results.forEach(p=>{t.appendChild(h(p))})}catch(m){s.classList.add("hidden"),d(m.message,"error"),t.innerHTML='<div class="col-span-full text-center text-red-500">Search failed...</div>'}};document.getElementById("search-form").addEventListener("submit",r=>{r.preventDefault();const i=document.getElementById("search-input").value.trim();l(i)}),l(o)}async function L(n){if(!localStorage.getItem("token")){window.location.hash="#login";return}n.innerHTML=`
    <div class="glass-card p-8 flex flex-col md:flex-row gap-8 items-start relative slide-up mb-12">
        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-knest-dark shadow-xl bg-slate-800 flex-shrink-0 flex items-center justify-center">
            <span class="material-icons text-6xl text-slate-500" id="profile-avatar">account_circle</span>
        </div>
        <div class="flex-1">
            <h2 class="text-4xl font-black font-heading mb-2" id="profile-name">Loading...</h2>
            <p class="text-knest-blue font-medium mb-4 flex items-center gap-2">
                <span class="material-icons text-sm">school</span>
                <span id="profile-institute">Fetching institute...</span>
            </p>
            <p class="text-slate-400 flex items-center gap-2">
                <span class="material-icons text-sm">email</span>
                <span id="profile-email">Fetching email...</span>
            </p>
        </div>
    </div>

    <div class="slide-up" style="animation-delay: 0.1s">
        <div class="flex items-center justify-between mb-8">
            <h3 class="heading-cursive text-[#8B5CF6]">My Uploads</h3>
            <a href="#upload" class="bg-knest-blue/10 hover:bg-knest-blue text-knest-blue hover:text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-2">
                <span class="material-icons text-sm">add</span> New Note
            </a>
        </div>
        
        <div id="my-notes-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="col-span-full py-12 text-center text-slate-400">Loading your notes...</div>
        </div>
    </div>
  `;try{const[e,o]=await Promise.all([b.getMe(),u.getMyNotes()]);document.getElementById("profile-name").textContent=e.username||"User",document.getElementById("profile-institute").textContent=e.institute||"Not provided",document.getElementById("profile-email").textContent=e.email||"No email";const t=document.getElementById("profile-avatar");e.profile_photo&&(t.parentElement.innerHTML=`<img src="${e.profile_photo}" class="w-full h-full object-cover">`);const a=document.getElementById("my-notes-container");a.innerHTML="",!o||o.length===0?a.innerHTML=`
        <div class="col-span-full py-16 text-center glass rounded-xl border border-white/5">
            <span class="material-icons text-6xl text-slate-600 mb-4">folder_open</span>
            <p class="text-slate-400">You haven't uploaded any notes yet.</p>
        </div>
      `:o.forEach(s=>{const l=h(s),r=document.createElement("button");r.className="absolute top-4 right-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center",r.innerHTML='<span class="material-icons text-sm">delete</span>',r.onclick=async i=>{if(i.stopPropagation(),confirm("Are you sure you want to delete this note?"))try{await u.deleteNote(s.id),d("Note deleted","success"),l.remove()}catch(m){d(m.message,"error")}},l.classList.add("relative"),l.appendChild(r),a.appendChild(l)})}catch(e){d(e.message,"error")}}async function I(n){const o=new URLSearchParams(window.location.hash.split("?")[1]||"").get("id");if(!o){window.location.hash="#home";return}n.innerHTML=`
    <div class="max-w-4xl mx-auto">
        <a href="javascript:history.back()" class="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
            <span class="material-icons text-sm">arrow_back</span> Back
        </a>

        <div id="note-content" class="glass-card p-8 md:p-12 slide-up">
            <div class="text-center py-12"><span class="material-icons animate-spin text-4xl text-knest-blue">refresh</span></div>
        </div>
    </div>
  `;try{const t=await u.getNoteById(o);if(!t)throw new Error("Note not found");const a=document.getElementById("note-content");a.innerHTML=`
        <div class="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-white/10 pb-8 mb-8">
            <div class="flex-1">
                <h1 class="text-3xl md:text-5xl font-black font-heading mb-4 text-white">${t.title}</h1>
                <div class="flex items-center gap-4 text-slate-400 text-sm">
                    <span class="flex items-center gap-1"><span class="material-icons text-sm">person</span> ${t.allow_public_author?t.username:"Anonymous"}</span>
                    <span class="flex items-center gap-1"><span class="material-icons text-sm">visibility</span> ${t.views||0} Views</span>
                    <span class="flex items-center gap-1"><span class="material-icons text-sm">event</span> ${new Date(t.created_at).toLocaleDateString()}</span>
                </div>
            </div>
            
            <button id="detail-download-btn" class="w-full md:w-auto bg-knest-blue hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 flex-shrink-0">
                <span class="material-icons">download</span> Download File
            </button>
        </div>

        <div class="prose prose-invert max-w-none">
            <h3 class="text-xl font-bold mb-4 font-heading">Description</h3>
            <p class="text-slate-300 leading-relaxed whitespace-pre-line">${t.description}</p>
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
    `,document.getElementById("detail-download-btn").addEventListener("click",()=>u.downloadNote(t.id)),document.getElementById("detail-upvote").addEventListener("click",async()=>{try{await u.voteNote(t.id,"upvote"),d("Voted successfully","success")}catch(s){d(s.message,"error")}}),document.getElementById("detail-downvote").addEventListener("click",async()=>{try{await u.voteNote(t.id,"downvote"),d("Downvoted successfully","success")}catch(s){d(s.message,"error")}}),document.getElementById("detail-report").addEventListener("click",async()=>{const s=prompt("Please enter a reason for reporting this note:");if(s)try{await u.reportNote(t.id,s),d("Report submitted.","info")}catch(l){d(l.message,"error")}})}catch(t){document.getElementById("note-content").innerHTML=`
        <div class="text-center py-12">
            <span class="material-icons text-6xl text-red-500 mb-4">error_outline</span>
            <h2 class="text-2xl font-bold mb-2">Error loading note</h2>
            <p class="text-slate-400">${t.message}</p>
        </div>
      `}}function v(){const n=window.location.hash||"#home",e=document.getElementById("app");e.innerHTML="",e.className="max-w-7xl mx-auto px-6 mt-24 fade-in",x();const[o,t]=n.split("?");switch(new URLSearchParams(t||""),o){case"#home":f(e);break;case"#login":g(e,"login");break;case"#register":g(e,"register");break;case"#upload":k(e);break;case"#search":E(e);break;case"#profile":L(e);break;case"#note":I(e);break;default:f(e)}}window.addEventListener("hashchange",v);window.addEventListener("DOMContentLoaded",v);
