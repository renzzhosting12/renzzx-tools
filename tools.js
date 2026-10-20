const tools = [
  { id: "json", name: "JSON Formatter", category: "Developer", description: "Rapikan dan validasi struktur JSON.", type: "json" },
  { id: "base64", name: "Base64 Encoder", category: "Developer", description: "Encode atau decode teks Base64.", type: "base64" },
  { id: "uuid", name: "UUID Generator", category: "Generator", description: "Buat UUID v4.", type: "uuid" },
  { id: "password", name: "Password Generator", category: "Security", description: "Buat password acak.", type: "password" },
  { id: "counter", name: "Text Counter", category: "Text", description: "Hitung karakter, kata, dan baris.", type: "counter" },
  { id: "url", name: "URL Encoder", category: "Developer", description: "Encode dan decode komponen URL.", type: "url" },
  { id: "timestamp", name: "Unix Timestamp", category: "Developer", description: "Konversi timestamp Unix.", type: "timestamp" },
  { id: "qr", name: "QR Code Generator", category: "Generator", description: "Buat QR code dari teks atau tautan.", type: "qr" }
];
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
  res.status(200).json({ success: true, count: tools.length, data: tools });
};