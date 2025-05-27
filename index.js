import app from "./firebase-init.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth(app);
const content = document.getElementById("content");

// Cek user login status pakai Firebase Auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User sudah login, tampilkan konten dashboard
    content.classList.remove("hidden");
  } else {
    // User belum login, redirect ke login.html
    window.location.href = "login.html";
  }
});
