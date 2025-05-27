const scannerModal = document.getElementById("scannerModal");
const closeScanner = document.querySelector(".close-scanner");
const tambahStokBtn = document.querySelector(".card:nth-child(1)");
const resultEl = document.getElementById("scan-result");
let scanner;

// Buka scanner saat tombol tambah stok diklik
tambahStokBtn.addEventListener("click", () => {
  try {
    scannerModal.style.display = "block";
    resultEl.innerText = "";
    console.log("Modal scanner ditampilkan.");

    if (scanner) {
      scanner.stop().then(() => {
        document.getElementById("reader").innerHTML = "";
        console.log("Scanner dihentikan sebelum memulai ulang.");
        mulaiScanner();
      });
    } else {
      mulaiScanner();
    }
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
  }
});

function mulaiScanner() {
  scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    qrCodeMessage => {
      resultEl.innerText = `QR Code Terdeteksi: ${qrCodeMessage}`;
      onScanSuccess(qrCodeMessage);
    },
    error => console.warn("QR Code error:", error)
  ).catch(err => {
    console.error("Gagal membuka kamera:", err);
    resultEl.innerText = "Gagal membuka kamera.";
  });
}

// Tombol close scanner
closeScanner.addEventListener("click", () => {
  try {
    scannerModal.style.display = "none";
    if (scanner) {
      scanner.stop().then(() => {
        console.log("Scanner ditutup.");
        document.getElementById("reader").innerHTML = "";
      });
    }
  } catch (err) {
    console.error("Kesalahan saat menutup scanner:", err);
  }
});

// Klik di luar modal
window.addEventListener("click", e => {
  try {
    if (e.target === scannerModal) {
      scannerModal.style.display = "none";
      if (scanner) {
        scanner.stop().then(() => {
          document.getElementById("reader").innerHTML = "";
        });
      }
    }
  } catch (err) {
    console.error("Kesalahan event click:", err);
  }
});

// Jika scan sukses
function onScanSuccess(qrCodeMessage) {
  try {
    const readerEl = document.getElementById("reader");
    const formStokEl = document.getElementById("formStok");
    const tanggalInputEl = document.getElementById("tanggalInput");

    if (!readerEl || !formStokEl || !tanggalInputEl) {
      console.error("Elemen tidak ditemukan.");
      return;
    }

    readerEl.style.display = "none";
    formStokEl.style.display = "flex";

    // Tanggal otomatis
    const now = new Date();
    tanggalInputEl.value = now.toLocaleString("id-ID", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });

    window.kodeBarangQR = qrCodeMessage;

    if (scanner) {
      scanner.stop().then(() => {
        console.log("Scanner berhenti, tapi modal tetap tampil.");
        document.getElementById("reader").innerHTML = "";
      });
    }
  } catch (err) {
    console.error("Kesalahan pada fungsi onScanSuccess:", err);
  }
}
