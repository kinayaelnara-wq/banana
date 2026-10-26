// Data Menu Lengkap Bu Nana
const makanan = [
    { nama: "Lotek", harga: 13000, icon: "🥗", gambar: "gambar/lotek.jpg" },
    { nama: "Kupat Tahu", harga: 13000, icon: "🍲", gambar: "gambar/kupat-tahu.jpg" },
    { nama: "Nasi Ayam Geprek", harga: 13000, icon: "🍗", gambar: "gambar/nasi-ayam-geprek.jpg" },
    { nama: "Nasi Goreng", harga: 13000, icon: "🍛", gambar: "gambar/nasi-goreng.jpg" },
    { nama: "Nasi Telor", harga: 13000, icon: "🍳", gambar: "gambar/nasi-telor.jpg" },
    { nama: "IndTel Goreng", harga: 13000, icon: "🍜", gambar: "gambar/indtel-goreng.jpg" },
    { nama: "IndTel Rebus", harga: 13000, icon: "🍜", gambar: "gambar/indtel-rebus.jpg" },
    { nama: "Soto", harga: 10000, icon: "🍲", gambar: "gambar/soto.jpg" }
];

const minuman = [
    { nama: "Es Teh", harga: 3000, icon: "🧋", gambar: "gambar/es-teh.jpg" },
    { nama: "LemonTea", harga: 4000, icon: "🍋", gambar: "gambar/lemontea.jpg" },
    { nama: "Es Jeruk", harga: 4000, icon: "🍊", gambar: "gambar/es-jeruk.jpg" },
    { nama: "Nutrisari", harga: 4000, icon: "🧃", gambar: "gambar/nutrisari.jpg" },
    { nama: "Kopi Hitam", harga: 5000, icon: "☕", gambar: "gambar/kopi-hitam.jpg" },
    { nama: "Gooday", harga: 5000, icon: "🥤", gambar: "gambar/gooday.jpg" },
    { nama: "Cocolatos", harga: 5000, icon: "🧋", gambar: "gambar/cocolatos.jpg" },
    { nama: "Milo", harga: 5000, icon: "🥛", gambar: "gambar/milo.jpg" },
    { nama: "Bengbeng", harga: 5000, icon: "🍫", gambar: "gambar/bengbeng.jpg" },
    { nama: "Teh Tarik", harga: 5000, icon: "🧋", gambar: "gambar/teh-tarik.jpg" },
    { nama: "JosSua", harga: 7000, icon: "⚡", gambar: "gambar/jossua.jpg" },
    { nama: "Dancow", harga: 7000, icon: "🍼", gambar: "gambar/dancow.jpg", isDancow: true }
];

// Ambil nomor meja dari URL parameter
const urlParams = new URLSearchParams(window.location.search);
const nomorMeja = urlParams.get('meja') || 'Tanpa Meja';

// --- FITUR: Pelacakan Penjualan (LocalStorage) ---
function getSalesData() {
    const saved = localStorage.getItem('salesBuNana');
    let data = saved ? JSON.parse(saved) : {};
    [...makanan, ...minuman].forEach(item => {
        if (data[item.nama] === undefined) data[item.nama] = 0;
    });
    return data;
}
let salesData = getSalesData();

// --- FITUR BARU: Simpan Keranjang di LocalStorage ---
// Agar pesanan tidak hilang saat refresh / tutup modal / admin info menu habis
let keranjang = JSON.parse(localStorage.getItem('keranjangBuNana')) || [];

function simpanKeranjang() {
    localStorage.setItem('keranjangBuNana', JSON.stringify(keranjang));
}

document.addEventListener("DOMContentLoaded", function() {
    const elMeja = document.getElementById("infoMeja");
    if (elMeja) elMeja.innerText = "Nomor Meja: " + nomorMeja;

    tampilkanMenu(makanan, "menuMakanan");
    tampilkanMenu(minuman, "menuMinuman");

    // Tampilkan keranjang yang tersimpan saat halaman dibuka
    perbaruiKeranjang();
});

function tampilkanMenu(daftar, idElemen) {
    const kontainer = document.getElementById(idElemen);
    if (!kontainer) return;

    kontainer.innerHTML = "";
    daftar.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "menu-card";
        
        let extraHTML = "";
        if (item.isDancow) {
            extraHTML = '<select id="select-dancow" style="margin: 5px 0; padding: 3px; font-size: 12px; width:100%;"><option value="Putih">Dancow Putih</option><option value="Coklat">Dancow Coklat</option></select>';
        }

        const terjual = salesData[item.nama] || 0;
        const badgeTerjual = `<div class="terjual-badge">🔥 Terjual: ${terjual}</div>`;

        let visual;
        if (item.gambar) {
            visual = '<img src="' + item.gambar + '" alt="' + item.nama + '" loading="lazy" onerror="this.outerHTML=\'<span class=&quot;emoji&quot;>' + item.icon + '</span>\'">';
        } else {
            visual = '<span class="emoji">' + item.icon + '</span>';
        }

        card.innerHTML = '<div class="card-img-box">' + visual + '</div>' +
            '<h4>' + item.nama + '</h4>' +
            '<p>Rp' + item.harga.toLocaleString('id-ID') + '</p>' +
            badgeTerjual + extraHTML +
            '<button onclick="tambahItem(\'' + item.nama + '\', ' + item.harga + ', ' + (item.isDancow ? 'true' : 'false') + ')">+ Tambah</button>';
        
        kontainer.appendChild(card);
    });
}

// Fitur Keranjang Pesanan
function tambahItem(namaDasar, harga, isDancow) {
    let namaFinal = namaDasar;
    if (isDancow) {
        const selectRasa = document.getElementById("select-dancow");
        const rasa = selectRasa ? selectRasa.value : "Putih";
        namaFinal = "Dancow (" + rasa + ")";
    }

    let existing = keranjang.find(i => i.nama === namaFinal);
    if (existing) {
        existing.jumlah += 1;
    } else {
        keranjang.push({ nama: namaFinal, harga: harga, jumlah: 1 });
    }
    simpanKeranjang();
    perbaruiKeranjang();
}

function ubahJumlah(index, delta) {
    keranjang[index].jumlah += delta;
    if (keranjang[index].jumlah <= 0) {
        keranjang.splice(index, 1);
    }
    simpanKeranjang();
    perbaruiKeranjang();
}

// --- FITUR BARU: Hapus 1 item spesifik (untuk kasus menu habis) ---
function hapusItem(index) {
    const namaItem = keranjang[index].nama;
    if (confirm(`Hapus "${namaItem}" dari pesanan?\n(Gunakan ini jika admin menginfokan menu sedang habis)`)) {
        keranjang.splice(index, 1);
        simpanKeranjang();
        perbaruiKeranjang();
    }
}

function perbaruiKeranjang() {
    const daftarPesanan = document.getElementById("daftarPesanan");
    const totalEl = document.getElementById("total");
    const infoEdit = document.getElementById("infoEditPesanan");
    if (!daftarPesanan || !totalEl) return;

    if (keranjang.length === 0) {
        daftarPesanan.innerHTML = "Belum ada pesanan.";
        totalEl.innerText = "Rp0";
        if (infoEdit) infoEdit.style.display = "none";
        return;
    }

    // Tampilkan info box jika ada pesanan
    if (infoEdit) infoEdit.style.display = "block";

    daftarPesanan.innerHTML = "";
    let total = 0;

    keranjang.forEach(function(item, index) {
        let subtotal = item.harga * item.jumlah;
        total += subtotal;
        const div = document.createElement("div");
        div.className = "item-keranjang";

        div.innerHTML = 
            '<div style="flex: 1; padding-right: 10px;">' +
                '<div style="font-weight: 600; font-size: 14px;">' + item.nama + ' <span style="color:#2e7d32;">(x' + item.jumlah + ')</span></div>' +
                '<small style="color: #607d8b;">Rp' + subtotal.toLocaleString('id-ID') + '</small>' +
            '</div>' +
            '<div style="display: flex; align-items: center; gap: 6px;">' +
                '<button onclick="ubahJumlah(' + index + ', -1)" class="btn-qty" title="Kurangi">-</button>' +
                '<button onclick="ubahJumlah(' + index + ', 1)" class="btn-qty" title="Tambah">+</button>' +
                '<button onclick="hapusItem(' + index + ')" class="btn-hapus" title="Hapus menu ini (jika habis)">🗑️</button>' +
            '</div>';
        daftarPesanan.appendChild(div);
    });

    totalEl.innerText = 'Rp' + total.toLocaleString('id-ID');
}

function kosongkanKeranjang() {
    if (keranjang.length === 0) return;
    if (confirm("Yakin ingin mengosongkan SEMUA pesanan dan mulai dari awal?")) {
        keranjang = [];
        localStorage.removeItem('keranjangBuNana');
        perbaruiKeranjang();
    }
}

// --- Proses Pesanan & Nota Digital ---
function prosesPesanan() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong! Silakan pilih menu terlebih dahulu.");
        return;
    }

    const metodePembayaran = document.querySelector('input[name="metodePembayaran"]:checked').value;
    const catatan = document.getElementById("catatanPesanan")?.value || "";

    // Update data penjualan di localStorage
    keranjang.forEach(item => {
        if (!salesData[item.nama]) salesData[item.nama] = 0;
        salesData[item.nama] += item.jumlah;
    });
    localStorage.setItem('salesBuNana', JSON.stringify(salesData));
    
    tampilkanMenu(makanan, "menuMakanan");
    tampilkanMenu(minuman, "menuMinuman");

    generateNota(metodePembayaran, catatan);
    document.getElementById("modalNota").style.display = "flex";
}

function generateNota(metode, catatan) {
    const now = new Date();
    const tanggal = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const waktu = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const noNota = "NOTA-" + now.getTime().toString().slice(-6);
    
    let total = 0;
    let itemRows = "";
    keranjang.forEach((item, i) => {
        const subtotal = item.harga * item.jumlah;
        total += subtotal;
        itemRows += `
            <tr>
                <td style="padding: 4px 0;">${i+1}. ${item.nama} <br><small style="color:#666;">x${item.jumlah} @ Rp${item.harga.toLocaleString('id-ID')}</small></td>
                <td style="text-align:right; padding: 4px 0;">Rp${subtotal.toLocaleString('id-ID')}</td>
            </tr>
        `;
    });

    const notaHTML = `
        <div class="nota-header">
            <h3 style="margin:0;">Lotek & Kupat Tahu Bu Nana</h3>
            <p style="margin:5px 0; font-size:12px;">Jl. Contoh Alamat No. 123<br>Telp: 0812-3013-9560</p>
            <hr>
            <p style="text-align:left; font-size:13px; margin:5px 0;">
                No: <b>${noNota}</b><br>
                Tanggal: ${tanggal} ${waktu}<br>
                Meja: ${nomorMeja}
            </p>
            <hr>
        </div>
        <table style="width:100%; font-size:13px; border-collapse: collapse;">
            ${itemRows}
        </table>
        <hr>
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:16px; margin-top:5px;">
            <span>TOTAL</span>
            <span>Rp${total.toLocaleString('id-ID')}</span>
        </div>
        <p style="margin-top:10px; font-size:13px;">Metode: <b>${metode}</b></p>
        ${catatan ? `<p style="font-size:13px; color:#d32f2f;">Catatan: ${catatan}</p>` : ''}
        <div class="nota-footer">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p style="font-size:11px;">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
        </div>
    `;
    document.getElementById("notaDigital").innerHTML = notaHTML;
    
    window.currentNotaData = { total, metode, catatan, noNota, tanggal, waktu };
}

function tutupModal() {
    document.getElementById("modalNota").style.display = "none";
    // PENTING: JANGAN kosongkan keranjang di sini!
    // Pelanggan perlu melihat pesanan jika admin info ada menu habis.
}

function cetakNota() {
    const printContent = document.getElementById("notaDigital").innerHTML;
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Nota Digital</title>');
    printWindow.document.write('<style>body{font-family: monospace; padding:15px; max-width:300px; margin:0 auto; color:#000;} hr{border:1px dashed #000; margin:8px 0;} table{border-collapse:collapse;} .nota-header{text-align:center;} .nota-footer{text-align:center; margin-top:15px; font-size:11px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

function kirimWANota() {
    const { total, metode, catatan, noNota } = window.currentNotaData;
    let pesan = `*🧾 NOTA PESANAN - ${noNota}*\n`;
    pesan += `*Lotek & Kupat Tahu Bu Nana*\n`;
    pesan += `Nomor Meja: ${nomorMeja}\n\n`;
    
    keranjang.forEach((item, i) => {
        pesan += `${i+1}. ${item.nama} x${item.jumlah} = Rp${(item.harga * item.jumlah).toLocaleString('id-ID')}\n`;
    });
    
    pesan += `\n*💰 TOTAL: Rp${total.toLocaleString('id-ID')}*`;
    pesan += `\nMetode Pembayaran: ${metode}`;
    if (catatan) pesan += `\nCatatan: ${catatan}`;
    pesan += `\n\nTerima kasih, mohon segera diproses! 🙏`;

    const nomorAdmin = "6281230139560"; 
    const urlWA = "https://api.whatsapp.com/send?phone=" + nomorAdmin + "&text=" + encodeURIComponent(pesan);
    
    window.open(urlWA, '_blank');
    
    // Tutup modal saja, JANGAN kosongkan keranjang
    tutupModal();
    
    alert("✅ Pesanan dikirim ke WhatsApp!\n\nJika admin menginfokan ada menu yang habis, Anda bisa langsung klik tombol 🗑️ pada menu tersebut, lalu klik 'Proses Pesanan' lagi untuk mengirim revisi.");
}
