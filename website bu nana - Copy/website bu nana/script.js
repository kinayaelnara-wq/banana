// Data Menu Lengkap Bu Nana dengan Icon/Visual
const makanan = [
    { nama: "Lotek", harga: 13000, icon: "🥗" },
    { nama: "Kupat Tahu", harga: 13000, icon: "🍲" },
    { nama: "Nasi Ayam Geprek", harga: 13000, icon: "🍗" },
    { nama: "Nasi Goreng", harga: 13000, icon: "🍛" },
    { nama: "Nasi Telor", harga: 13000, icon: "🍳" },
    { nama: "IndTel Goreng", harga: 13000, icon: "🍜" },
    { nama: "IndTel Rebus", harga: 13000, icon: "🍜" },
    { nama: "Soto", harga: 10000, icon: "🍲" }
];

const minuman = [
    { nama: "Es Teh", harga: 3000, icon: "🧋" },
    { nama: "LemonTea", harga: 4000, icon: "🍋" },
    { nama: "Es Jeruk", harga: 4000, icon: "🍊" },
    { nama: "Nutrisari", harga: 4000, icon: "🧃" },
    { nama: "Kopi Hitam", harga: 5000, icon: "☕" },
    { nama: "Gooday", harga: 5000, icon: "🥤" },
    { nama: "Cocolatos", harga: 5000, icon: "🧋" },
    { nama: "Milo", harga: 5000, icon: "🥛" },
    { nama: "Bengbeng", harga: 5000, icon: "🍫" },
    { nama: "Teh Tarik", harga: 5000, icon: "🧋" },
    { nama: "JosSua", harga: 7000, icon: "⚡" },
    { nama: "Dancow", harga: 7000, icon: "🍼", isDancow: true }
];

// Ambil nomor meja dari URL parameter
const urlParams = new URLSearchParams(window.location.search);
const nomorMeja = urlParams.get('meja') || 'Tanpa Meja';

document.addEventListener("DOMContentLoaded", function() {
    const elMeja = document.getElementById("infoMeja");
    if (elMeja) {
        elMeja.innerText = "Nomor Meja: " + nomorMeja;
    }

    tampilkanMenu(makanan, "menuMakanan");
    tampilkanMenu(minuman, "menuMinuman");
});

// Fungsi Tampilkan Menu
function tampilkanMenu(daftar, idElemen) {
    const kontainer = document.getElementById(idElemen);
    if (!kontainer) return;

    kontainer.innerHTML = "";
    daftar.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "menu-card";
        
        let extraHTML = "";
        if (item.isDancow) {
            extraHTML = '<select id="select-dancow" style="margin: 5px 0; padding: 3px; font-size: 12px;"><option value="Putih">Putih</option><option value="Coklat">Coklat</option></select>';
        }

        card.innerHTML = '<div class="card-img-box"><span style="font-size: 42px;">' + item.icon + '</span></div>' +
            '<h4>' + item.nama + '</h4>' +
            '<p>Rp' + item.harga.toLocaleString('id-ID') + '</p>' +
            extraHTML +
            '<button onclick="tambahItem(\'' + item.nama + '\', ' + item.harga + ', ' + (item.isDancow ? 'true' : 'false') + ')">+ Tambah</button>';
        
        kontainer.appendChild(card);
    });
}

// Fitur Keranjang Pesanan
let keranjang = [];

function tambahItem(namaDasar, harga, isDancow) {
    let namaFinal = namaDasar;
    if (isDancow) {
        const selectRasa = document.getElementById("select-dancow");
        const rasa = selectRasa ? selectRasa.value : "Putih";
        namaFinal = "Dancow (" + rasa + ")";
    }

    let existing = null;
    for (let i = 0; i < keranjang.length; i++) {
        if (keranjang[i].nama === namaFinal) {
            existing = keranjang[i];
            break;
        }
    }

    if (existing) {
        existing.jumlah += 1;
    } else {
        keranjang.push({ nama: namaFinal, harga: harga, jumlah: 1 });
    }
    perbaruiKeranjang();
}

function ubahJumlah(index, delta) {
    keranjang[index].jumlah += delta;
    if (keranjang[index].jumlah <= 0) {
        keranjang.splice(index, 1);
    }
    perbaruiKeranjang();
}

function perbaruiKeranjang() {
    const daftarPesanan = document.getElementById("daftarPesanan");
    const totalEl = document.getElementById("total");
    
    if (!daftarPesanan || !totalEl) return;

    if (keranjang.length === 0) {
        daftarPesanan.innerHTML = "Belum ada pesanan.";
        totalEl.innerText = "0";
        return;
    }

    daftarPesanan.innerHTML = "";
    let total = 0;

    keranjang.forEach(function(item, index) {
        let subtotal = item.harga * item.jumlah;
        total += subtotal;

        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.style.margin = "5px 0";
        div.style.fontSize = "14px";

        div.innerHTML = '<span>' + (index + 1) + '. ' + item.nama + ' (x' + item.jumlah + ') - Rp' + subtotal.toLocaleString('id-ID') + '</span>' +
            '<div>' +
            '<button onclick="ubahJumlah(' + index + ', -1)" style="padding: 2px 6px; margin-right: 3px;">-</button>' +
            '<button onclick="ubahJumlah(' + index + ', 1)" style="padding: 2px 6px;">+</button>' +
            '</div>';
        
        daftarPesanan.appendChild(div);
    });

    totalEl.innerText = total.toLocaleString('id-ID');
}

function kosongkanKeranjang() {
    keranjang = [];
    perbaruiKeranjang();
}

// Fitur Kirim Pesanan ke WhatsApp Admin (Bu Nana)
function kirimKeWhatsApp() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong! Silakan pilih menu terlebih dahulu.");
        return;
    }

    let nomorMeja = document.getElementById("nomorMeja") ? document.getElementById("nomorMeja").value : "Tanpa Meja";
    let inputCatatan = document.getElementById("catatan");
    let catatan = inputCatatan ? inputCatatan.value : "";
    let nomorAdmin = "6281230139560"; // Nomor WhatsApp Bu Nana / Admin

    // 1. Menyusun Format Pesan
    let pesan = "Halo Bu Nana, saya ingin memesan:\n";
    pesan += "Nomor Meja: " + nomorMeja + "\n\n";

    let total = 0;
    keranjang.forEach(function(item, index) {
        let subtotal = item.harga * item.jumlah;
        total += subtotal;
        pesan += (index + 1) + ". " + item.nama + " x" + item.jumlah + " = Rp" + subtotal.toLocaleString('id-ID') + "\n";
    });

    if (catatan) {
        pesan += "\nCatatan: " + catatan + "\n";
    }

    pesan += "\nTotal Keseluruhan: Rp" + total.toLocaleString('id-ID') + "\n";
    pesan += "Mohon segera diproses ya, terima kasih!";

    // 2. Format Link WhatsApp
    let urlWA = "https://api.whatsapp.com/send?phone=" + nomorAdmin + "&text=" + encodeURIComponent(pesan);

    // 3. Buka WhatsApp
    window.open(urlWA, '_blank');
}