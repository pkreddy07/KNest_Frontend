import { authService } from "../api/authService.js";
import { showToast } from "../components/popup.js";
import { renderNavbar } from "../components/navbar.js";

export function renderAuth(container, type = "login") {
  const isLogin = type === "login";

  container.innerHTML = `
    <div class="max-w-xl mx-auto glass-card p-10 mt-12 slide-up rounded-3xl border-0 shadow-2xl relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
      
      <!-- Premium decorative background blob -->
      <div class="absolute top-[-50%] right-[-50%] w-full h-full bg-knest-blue/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="text-center relative z-10 mb-8">
          <div class="w-16 h-16 bg-knest-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <i data-lucide="shield-check" class="w-8 h-8 text-knest-blue"></i>
          </div>
          <h2 class="text-3xl font-black font-heading mb-2 text-slate-900 dark:text-white">${isLogin ? 'Welcome Back' : 'Join KNest Platform'}</h2>
          <p class="text-slate-500 font-medium">${isLogin ? 'Sign in to access your library' : 'Create an account to start sharing notes'}</p>
      </div>
      
      <form id="auth-form" class="flex flex-col gap-5 relative z-10">
        ${!isLogin ? `
          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Username</label>
            <div class="relative group">
                <i data-lucide="user" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-knest-blue transition-colors"></i>
                <input type="text" id="username" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-knest-blue dark:focus:border-knest-blue focus:bg-white dark:focus:bg-slate-900 rounded-xl px-4 py-3 pl-12 text-slate-900 dark:text-white outline-none transition-all shadow-sm" placeholder="JohnDoe" required>
            </div>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Institute <span class="text-slate-400 font-normal">(Optional)</span></label>
            <div class="relative group">
                <i data-lucide="building-2" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-knest-blue transition-colors"></i>
                <input type="text" id="institute" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-knest-blue dark:focus:border-knest-blue focus:bg-white dark:focus:bg-slate-900 rounded-xl px-4 py-3 pl-12 text-slate-900 dark:text-white outline-none transition-all shadow-sm" placeholder="Global University">
            </div>
          </div>
        ` : ''}

        <div class="space-y-1">
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
          <div class="relative group">
              <i data-lucide="mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-knest-blue transition-colors"></i>
              <input type="email" id="email" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-knest-blue dark:focus:border-knest-blue focus:bg-white dark:focus:bg-slate-900 rounded-xl px-4 py-3 pl-12 text-slate-900 dark:text-white outline-none transition-all shadow-sm" placeholder="john@example.com" required>
          </div>
        </div>
        
        <div class="space-y-1">
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
          <div class="relative group">
              <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-knest-blue transition-colors"></i>
              <input type="password" id="password" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-knest-blue dark:focus:border-knest-blue focus:bg-white dark:focus:bg-slate-900 rounded-xl px-4 py-3 pl-12 text-slate-900 dark:text-white outline-none transition-all shadow-sm" placeholder="••••••••" required>
          </div>
        </div>

        <button type="submit" class="w-full bg-gradient-to-r from-knest-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl mt-4 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5">
          ${isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <!-- OTP Section (Hidden initially) -->
      <form id="otp-form" class="hidden flex-col gap-5 mt-8 pt-8 border-t border-slate-200 dark:border-white/10 relative z-10 flex items-center">
        <div class="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
            <i data-lucide="mail-check" class="w-6 h-6 text-emerald-500"></i>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 text-center font-medium max-w-[250px]">We've sent a 6-digit verification code to your email.</p>
        <div class="w-full relative mt-4 group">
            <i data-lucide="key-round" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-knest-blue transition-colors"></i>
            <input type="text" id="otp" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-knest-blue dark:focus:border-knest-blue focus:bg-white dark:focus:bg-slate-900 rounded-xl px-4 py-4 pl-12 text-slate-900 dark:text-white text-center tracking-[1em] font-black text-2xl outline-none transition-all shadow-sm" placeholder="000000" maxlength="6" required>
        </div>
        <button type="submit" class="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-0.5 mt-2">
          Verify & Access
        </button>
      </form>

      <div class="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium relative z-10">
        ${isLogin 
          ? `Don't have an account? <a href="#register" class="text-knest-blue hover:text-blue-600 dark:hover:text-knest-blue transition-colors font-bold ml-1">Sign up</a>` 
          : `Already have an account? <a href="#login" class="text-knest-blue hover:text-blue-600 dark:hover:text-knest-blue transition-colors font-bold ml-1">Login</a>`}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  let pendingUserId = null;

  const authForm = document.getElementById("auth-form");
  const otpForm = document.getElementById("otp-form");

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = authForm.querySelector('button[type="submit"]');
    
    try {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-5 h-5 mx-auto"></i>`;

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (isLogin) {
        const res = await authService.login(email, password);
        localStorage.setItem("token", res.token);
        renderNavbar(); // re-render nav
        showToast("Logged in successfully!", "success");
        window.location.hash = "#home";
      } else {
        const username = document.getElementById("username").value;
        const institute = document.getElementById("institute").value;
        const res = await authService.register({ username, email, password, institute });
        
        pendingUserId = res.userId;
        
        authForm.classList.add("opacity-50", "pointer-events-none");
        otpForm.classList.remove("hidden");
        otpForm.classList.add("flex");
        showToast("OTP sent to your email", "info");
      }
    } catch (err) {
      showToast(err.message || "Failed Authentication", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = isLogin ? 'Sign In' : 'Create Account';
      if (window.lucide) window.lucide.createIcons();
    }
  });

  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = otpForm.querySelector('button[type="submit"]');
    
    try {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-5 h-5 mx-auto"></i>`;
      const otp = document.getElementById("otp").value;
      
      await authService.verifyEmail(pendingUserId, otp);
      showToast("Email verified! Please log in.", "success");
      
      window.location.hash = "#login";
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = 'Verify & Login';
      if (window.lucide) window.lucide.createIcons();
    }
  });
}
