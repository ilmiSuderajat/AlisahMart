import app from "./firebase-init.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth(app);

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("userUID");
    window.location.href = "login.html";
  } catch (error) {
    alert("Gagal logout: " + error.message);
  }
});
