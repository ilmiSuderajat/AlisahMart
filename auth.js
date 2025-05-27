import app from "./firebase-init.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname;

  if (!user && currentPage !== "/login.html") {
    // belum login, bukan di halaman login → redirect ke login
    window.location.href = "login.html";
  }

  if (user && currentPage === "/login.html") {
    // sudah login, tapi malah buka login → redirect ke index
    window.location.href = "index.html";
  }
});
