import app from "./firebase-init.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth(app);
const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  // ✅ Buka iklan CPM di tab baru (hanya saat user submit login)
  window.open(
    "https://www.profitableratecpm.com/cwu9387em?key=02bfbeb34b378c0698be689bafdc7f94",
    "_blank"
  );

  const email = form.email.value;
  const password = form.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // simpan user uid sebagai session sederhana
    localStorage.setItem("userUID", userCredential.user.uid);
    // redirect ke halaman utama
    window.location.href = "index.html";
  } catch (error) {
    errorEl.textContent = error.message;
  }
});
