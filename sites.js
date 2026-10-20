const sites = [
  { id: "mdn", name: "MDN Web Docs", category: "Dokumentasi", url: "https://developer.mozilla.org", description: "Dokumentasi HTML, CSS, dan JavaScript." },
  { id: "github", name: "GitHub", category: "Developer", url: "https://github.com", description: "Hosting source code dan kolaborasi." },
  { id: "vercel", name: "Vercel", category: "Hosting", url: "https://vercel.com", description: "Platform deployment website." },
  { id: "webdev", name: "web.dev", category: "Belajar", url: "https://web.dev", description: "Panduan pengembangan web." },
  { id: "json", name: "JSONLint", category: "Developer", url: "https://jsonlint.com", description: "Periksa validitas JSON." },
  { id: "canva", name: "Canva", category: "Desain", url: "https://www.canva.com", description: "Desain grafis dan konten visual." }
];
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
  res.status(200).json({ success: true, count: sites.length, data: sites });
};