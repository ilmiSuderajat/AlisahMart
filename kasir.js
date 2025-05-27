import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  update
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7bRbulHJ3D1VWpooXWka42MhOuIKgrVU",
  authDomain: "alisahmart-f8a62.firebaseapp.com",
  databaseURL: "https://alisahmart-f8a62-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alisahmart-f8a62",
  storageBucket: "alisahmart-f8a62.appspot.com",
  messagingSenderId: "852965892731",
  appId: "1:852965892731:web:89a310bc1794aaf904b8de"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let barangTerpilih = null; // simpan data barang yang ditemukan

// Fungsi mencari barang berdasarkan barcode
async function cariBarang(barcode) {
  try {
    const trimmedBarcode = barcode.toString().trim();
    const q = query(ref(db, "stok"), orderByChild("barcode"), equalTo(trimmedBarcode));
    const snapshot = await get(q);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const key = Object.keys(data)[0];
      return { ...data[key], key };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error saat mencari barang:", error);
    return null;
  }
}

// Fungsi menampilkan hasil pencarian & input jumlah
function tampilkanHasilPencarian(barang, barcode) {
  const hasilScanEl = document.getElementById("hasilScan");
  if (!hasilScanEl) return;

  if (barang) {
    barangTerpilih = barang;

    hasilScanEl.innerHTML = `
      <div class="barang-info">
        <h3>✅ Barcode Ditemukan</h3>
        <p>🛒 <strong>${barang.nama}</strong></p>
        <p>💰 Harga: Rp ${Number(barang.harga_jual).toLocaleString()}</p>
        <p>📦 Stok: ${barang.jumlah}</p>
        <label>Jumlah beli:</label>
        <input id="jumlahInput" type="number" min="1" max="${barang.jumlah}" value="1" />
        <p id="totalBayar">Total: Rp ${Number(barang.harga_jual).toLocaleString()}</p>
        <button id="btnBayar">💸 Bayar Sekarang</button>
      </div>`;

    const jumlahInput = document.getElementById("jumlahInput");
    const totalBayarEl = document.getElementById("totalBayar");

            jumlahInput.addEventListener("input", () => {
        let jumlah = parseInt(jumlahInput.value);

        // Validasi angka
        if (isNaN(jumlah)) return;

        // Batasi antara 1 sampai stok yang tersedia
        if (jumlah < 1) jumlah = 1;
        if (jumlah > barang.jumlah) jumlah = barang.jumlah;

        // Update nilai input & total bayar
        jumlahInput.value = jumlah;
        const total = jumlah * Number(barang.harga_jual);
        totalBayarEl.innerText = `Total: Rp ${total.toLocaleString()}`;
        });


    document.getElementById("btnBayar").addEventListener("click", () => {
      const jumlahBeli = parseInt(jumlahInput.value);
      prosesPembayaran(barang.key, jumlahBeli);
    });
  } else {
    hasilScanEl.innerHTML = `
      <div class="barang-info error">
        <h3>❌ Barcode Tidak Ditemukan</h3>
        <p>Barcode: <strong>${barcode}</strong></p>
        <p>Silakan cek kembali atau tambahkan barang baru</p>
      </div>`;
  }
}

// Fungsi proses pembayaran & update Firebase
async function prosesPembayaran(key, jumlahBeli) {
  if (!barangTerpilih) return;

  const stokSekarang = parseInt(barangTerpilih.jumlah);
  const stokBaru = stokSekarang - jumlahBeli;
  const totalKeuntungan = jumlahBeli * Number(barangTerpilih.harga_jual);

  const updates = {
    [`stok/${key}/jumlah`]: stokBaru,
    [`penjualan_hari_ini/${key}/terjual`]: (barangTerpilih.terjual || 0) + jumlahBeli,
    [`penjualan_hari_ini/${key}/keuntungan`]: (barangTerpilih.keuntungan || 0) + totalKeuntungan
  };

  try {
    await update(ref(db), updates);
    alert("✅ Pembayaran berhasil. Stok dikurangi.");
    document.getElementById("hasilScan").innerHTML = "";
  } catch (err) {
    console.error("Gagal update pembayaran:", err);
    alert("❌ Gagal menyimpan ke Firebase.");
  }
}

// Fungsi scanner barcode
async function mulaiScanner() {
  try {
    const html5QrCode = new Html5Qrcode("reader");
    const hasilScanEl = document.getElementById("hasilScan");

    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] },
      async (barcode) => {
        try {
          hasilScanEl.innerHTML = `<div class="scanning">Memproses barcode...</div>`;
          await html5QrCode.stop();

          const barang = await cariBarang(barcode.trim());
          tampilkanHasilPencarian(barang, barcode);
        } catch (error) {
          console.error("Error saat memproses barcode:", error);
          hasilScanEl.innerHTML = `<div class="barang-info error"><h3>⚠️ Terjadi Error</h3><p>${error.message}</p></div>`;
        } finally {
          setTimeout(() => mulaiScanner(), 3000);
        }
      },
      (error) => {
        console.warn("Error scanning:", error);
        hasilScanEl.innerHTML = `<div class="error">Gagal memulai scanner: ${error.message}</div>`;
      }
    );
  } catch (err) {
    console.error("Gagal memulai scanner:", err);
    document.getElementById("hasilScan").innerHTML = `<div class="error">Scanner tidak dapat diakses: ${err.message}</div>`;
  }
}

// Pencarian manual via input
function setupPencarianManual() {
  const formCari = document.getElementById("formCariManual");
  const inputBarcode = document.getElementById("inputBarcode");

  if (!formCari || !inputBarcode) return;

  formCari.addEventListener("submit", async function (e) {
    e.preventDefault();
    const barcode = inputBarcode.value.trim();

    if (!barcode) {
      alert("Masukkan kode barcode terlebih dahulu.");
      return;
    }

    const barang = await cariBarang(barcode);
    tampilkanHasilPencarian(barang, barcode);
    inputBarcode.value = "";
  });
}

// Mulai saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    document.getElementById("hasilScan").innerHTML = `<div class="error">Browser tidak mendukung akses kamera.</div>`;
  } else {
    mulaiScanner();
  }

  setupPencarianManual();
});
