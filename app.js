const DEFAULT_TOOLS = [
 {id:"json",name:"JSON Formatter",category:"Developer",description:"Rapikan dan validasi struktur JSON.",icon:"{}",type:"json"},
 {id:"base64",name:"Base64 Encoder",category:"Developer",description:"Encode atau decode teks Base64 langsung di browser.",icon:"⇄",type:"base64"},
 {id:"uuid",name:"UUID Generator",category:"Generator",description:"Buat identifier UUID v4 secara instan.",icon:"⌘",type:"uuid"},
 {id:"password",name:"Password Generator",category:"Security",description:"Buat password acak dengan opsi panjang karakter.",icon:"✳",type:"password"},
 {id:"counter",name:"Text Counter",category:"Text",description:"Hitung karakter, kata, dan baris teks.",icon:"¶",type:"counter"},
 {id:"url",name:"URL Encoder",category:"Developer",description:"Encode dan decode komponen URL.",icon:"↗",type:"url"},
 {id:"timestamp",name:"Unix Timestamp",category:"Developer",description:"Konversi timestamp Unix ke tanggal lokal.",icon:"◷",type:"timestamp"},
 {id:"qr",name:"QR Code Generator",category:"Generator",description:"Buat QR code dari teks atau tautan.",icon:"▦",type:"qr"}
];
const DEFAULT_SITES = [
 {id:"mdn",name:"MDN Web Docs",category:"Dokumentasi",url:"https://developer.mozilla.org",description:"Dokumentasi web untuk HTML, CSS, dan JavaScript."},
 {id:"github",name:"GitHub",category:"Developer",url:"https://github.com",description:"Hosting source code dan kolaborasi proyek."},
 {id:"vercel",name:"Vercel",category:"Hosting",url:"https://vercel.com",description:"Platform deployment untuk website dan aplikasi."},
 {id:"webdev",name:"web.dev",category:"Belajar",url:"https://web.dev",description:"Panduan membangun pengalaman web yang lebih baik."},
 {id:"json",name:"JSONLint",category:"Developer",url:"https://jsonlint.com",description:"Periksa validitas struktur JSON."},
 {id:"canva",name:"Canva",category:"Desain",url:"https://www.canva.com",description:"Buat desain grafis dan konten visual."}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let tools = readStore("renzx_tools", DEFAULT_TOOLS);
let sites = readStore("renzx_sites", DEFAULT_SITES);
let activeCategory = "Semua";
let toastTimer;
function readStore(key, fallback){try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v:fallback.map(x=>({...x}));}catch{return fallback.map(x=>({...x}));}}
function saveStore(){localStorage.setItem("renzx_tools",JSON.stringify(tools));localStorage.setItem("renzx_sites",JSON.stringify(sites));}
function escapeHTML(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2400);}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"tool";}
function renderFilters(){const cats=["Semua",...new Set(tools.map(t=>t.category))];$("#category-filters").innerHTML=cats.map(c=>`<button class="filter ${c===activeCategory?"active":""}" data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("");}
function renderTools(){
 const q=$("#global-search").value.trim().toLowerCase();
 const visible=tools.filter(t=>(activeCategory==="Semua"||t.category===activeCategory)&&[t.name,t.description,t.category].some(v=>String(v).toLowerCase().includes(q)));
 $("#tool-grid").innerHTML=visible.length?visible.map(t=>`<article class="tool-card"><div class="card-top"><span class="category-label">${escapeHTML(t.category)}</span></div><div class="tool-icon">${escapeHTML(t.icon||"✦")}</div><h3>${escapeHTML(t.name)}</h3><p>${escapeHTML(t.description)}</p><div class="card-bottom"><span>Browser utility</span><button class="launch-btn" data-launch="${escapeHTML(t.id)}">Buka tool ↗</button></div></article>`).join(""):`<div class="empty-state">Tidak ada tools yang cocok. Coba kata kunci lain.</div>`;
 $("#tool-count").textContent=tools.length;$("#results-label").textContent=`${visible.length} tools`;renderFilters();
}
function renderSites(){const q=$("#global-search").value.trim().toLowerCase();const list=sites.filter(s=>[s.name,s.category,s.description].some(v=>String(v).toLowerCase().includes(q)));$("#directory-grid").innerHTML=list.length?list.map(s=>`<article class="directory-card"><div class="site-icon">${escapeHTML((s.name||"W").slice(0,1).toUpperCase())}</div><div><h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.description||s.category)}</p><a class="site-open" href="${safeURL(s.url)}" target="_blank" rel="noopener noreferrer">Kunjungi website ↗</a></div></article>`).join(""):`<div class="empty-state">Tidak ada website yang cocok.</div>`;$("#site-count").textContent=sites.length;}
function safeURL(url){try{const u=new URL(url);return ["http:","https:"].includes(u.protocol)?escapeHTML(u.href):"#";}catch{return "#";}}
function toolUI(t){
 const title=escapeHTML(t.name);
 const inputs={
 json:`<label>JSON input<textarea id="tool-input" placeholder='{"hello":"world"}'></textarea></label><div class="tool-actions"><button class="button" data-action="format">Format JSON</button><button class="ghost" data-action="minify">Minify</button><button class="ghost" data-action="validate">Validasi</button></div>`,
 base64:`<label>Teks input<textarea id="tool-input" placeholder="Masukkan teks di sini..."></textarea></label><div class="tool-actions"><button class="button" data-action="encode">Encode</button><button class="ghost" data-action="decode">Decode</button></div><p class="hint">Base64 bukan enkripsi dan tidak cocok untuk menyimpan rahasia.</p>`,
 uuid:`<p class="hint">Tekan tombol untuk membuat UUID v4 baru.</p><div class="tool-actions"><button class="button" data-action="generate">Buat UUID</button></div>`,
 password:`<label>Panjang password (8–64)<input id="pass-length" type="number" min="8" max="64" value="20"></label><label><span><input id="pass-symbols" type="checkbox" checked style="width:auto"> Sertakan simbol</span></label><div class="tool-actions"><button class="button" data-action="generate">Buat password</button></div><p class="hint">Password dibuat lokal di browser. Simpan dengan aman.</p>`,
 counter:`<label>Teks input<textarea id="tool-input" placeholder="Mulai mengetik..."></textarea></label><div class="tool-actions"><button class="button" data-action="count">Hitung teks</button></div>`,
 url:`<label>Teks atau URL<input id="tool-input" placeholder="https://contoh.com/?q=hello world"></label><div class="tool-actions"><button class="button" data-action="encode">Encode URL</button><button class="ghost" data-action="decode">Decode URL</button></div>`,
 timestamp:`<label>Unix timestamp (detik atau milidetik)<input id="tool-input" placeholder="Contoh: 1790000000"></label><div class="tool-actions"><button class="button" data-action="convert">Konversi</button><button class="ghost" data-action="now">Timestamp sekarang</button></div>`,
 qr:`<label>Teks atau URL<input id="tool-input" placeholder="https://example.com"></label><div class="tool-actions"><button class="button" data-action="generate">Buat QR Code</button></div><p class="hint">QR dibuat melalui layanan eksternal api.qrserver.com; teks input dikirim ke layanan tersebut.</p>`
 };
 return `<div class="eyebrow">${escapeHTML(t.category||"TOOL")}</div><h2 id="tool-modal-title">${title}</h2><p class="modal-intro">${escapeHTML(t.description||"Tool online")}</p><div class="tool-ui">${inputs[t.type]||`<p class="hint">Tool kustom ini baru terdaftar. Implementasikan logikanya di app.js.</p>`}<div id="tool-output" class="output-box" aria-live="polite">Hasil akan muncul di sini.</div></div>`;
}
function openTool(id){const t=tools.find(x=>x.id===id);if(!t){toast("Tool tidak ditemukan.");return;}$("#tool-modal-body").innerHTML=toolUI(t);$("#tool-modal").hidden=false;$("#tool-modal").dataset.toolId=id;}
function closeModal(id){$("#"+id).hidden=true;}
function runTool(action){
 const id=$("#tool-modal").dataset.toolId,t=tools.find(x=>x.id===id),input=$("#tool-input")?.value??"",out=$("#tool-output");
 try{
  let result="";
  if(action==="format"||action==="minify"||action==="validate"){const obj=JSON.parse(input);result=action==="format"?JSON.stringify(obj,null,2):action==="minify"?JSON.stringify(obj):"JSON valid ✓";}
  else if(action==="encode"&&t.type==="base64")result=btoa(unescape(encodeURIComponent(input)));
  else if(action==="decode"&&t.type==="base64")result=decodeURIComponent(escape(atob(input.trim())));
  else if(action==="encode"&&t.type==="url")result=encodeURIComponent(input);
  else if(action==="decode"&&t.type==="url")result=decodeURIComponent(input);
  else if(action==="generate"&&t.type==="uuid")result=crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==="x"?r:(r&3|8)).toString(16)});
  else if(action==="generate"&&t.type==="password"){const len=Math.min(64,Math.max(8,Number($("#pass-length").value)||20)),chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"+($("#pass-symbols").checked?"!@#$%^&*()-_=+[]{}?":"");const bytes=new Uint32Array(len);crypto.getRandomValues(bytes);result=Array.from(bytes,n=>chars[n%chars.length]).join("");}
  else if(action==="count"&&t.type==="counter"){const words=input.trim()?input.trim().split(/\s+/u).length:0;result=`Karakter: ${input.length}\nKarakter tanpa spasi: ${input.replace(/\s/g,"").length}\nKata: ${words}\nBaris: ${input?input.split(/\r\n|\r|\n/).length:0}`;}
  else if(action==="convert"&&t.type==="timestamp"){const n=Number(input);if(!Number.isFinite(n))throw Error("Masukkan angka timestamp yang valid.");const d=new Date(Math.abs(n)<1e12?n*1000:n);if(Number.isNaN(d.getTime()))throw Error("Timestamp di luar rentang.");result=`ISO: ${d.toISOString()}\nLokal: ${d.toLocaleString("id-ID")}`;}
  else if(action==="now"&&t.type==="timestamp")result=String(Math.floor(Date.now()/1000));
  else if(action==="generate"&&t.type==="qr"){if(!input.trim())throw Error("Masukkan teks atau URL.");const img=document.createElement("img");img.className="qr-result";img.alt="QR Code hasil";img.src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data="+encodeURIComponent(input);out.replaceChildren(img,document.createTextNode("QR dibuat oleh layanan eksternal."));return;}
  else throw Error("Aksi tidak tersedia untuk tool ini.");
  out.textContent=result; if(action==="validate")toast("JSON valid.");
 }catch(e){out.textContent="Error: "+(e.message||"Input tidak valid.");}
}
function renderAdmin(){
 $("#admin-tool-list").innerHTML=tools.map(t=>`<div class="admin-row"><div><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(t.category)} · ${escapeHTML(t.type||"custom")}</small></div><button data-edit-tool="${escapeHTML(t.id)}">Edit</button><button data-delete-tool="${escapeHTML(t.id)}">Hapus</button></div>`).join("");
 $("#admin-site-list").innerHTML=sites.map(s=>`<div class="admin-row"><div><strong>${escapeHTML(s.name)}</strong><small>${escapeHTML(s.url)}</small></div><button data-delete-site="${escapeHTML(s.id)}">Hapus</button></div>`).join("");
}
function resetToolForm(){$("#edit-id").value="";$("#tool-name").value="";$("#tool-category").value="Developer";$("#tool-description").value="";}
function openAdmin(){$("#admin-modal").hidden=false;renderAdmin();}
function copyText(text){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(()=>toast("Tersalin ke clipboard.")).catch(()=>fallbackCopy(text));}else fallbackCopy(text);}
function fallbackCopy(text){const el=document.createElement("textarea");el.value=text;document.body.append(el);el.select();try{document.execCommand("copy");toast("Tersalin ke clipboard.");}catch{toast("Gagal menyalin.");}el.remove();}
document.addEventListener("click",e=>{
 const cat=e.target.closest("[data-category]");if(cat){activeCategory=cat.dataset.category;renderTools();return;}
 const launch=e.target.closest("[data-launch]");if(launch){openTool(launch.dataset.launch);return;}
 const action=e.target.closest("[data-action]");if(action){runTool(action.dataset.action);return;}
 const close=e.target.closest("[data-close]");if(close){closeModal(close.dataset.close);return;}
 const copy=e.target.closest("[data-copy]");if(copy){copyText(location.origin+copy.dataset.copy);return;}
 const tab=e.target.closest("[data-tab]");if(tab){$$(".tab").forEach(x=>x.classList.toggle("active",x===tab));$$(".admin-pane").forEach(x=>x.hidden=x.id!==tab.dataset.tab);return;}
 const edit=e.target.closest("[data-edit-tool]");if(edit){const t=tools.find(x=>x.id===edit.dataset.editTool);if(t){$("#edit-id").value=t.id;$("#tool-name").value=t.name;$("#tool-category").value=t.category;$("#tool-description").value=t.description;$("#tools-admin").scrollIntoView({behavior:"smooth",block:"start"});}return;}
 const del=e.target.closest("[data-delete-tool]");if(del){tools=tools.filter(x=>x.id!==del.dataset.deleteTool);saveStore();renderTools();renderAdmin();toast("Tool dihapus dari browser ini.");return;}
 const ds=e.target.closest("[data-delete-site]");if(ds){sites=sites.filter(x=>x.id!==ds.dataset.deleteSite);saveStore();renderSites();renderAdmin();toast("Website dihapus dari browser ini.");return;}
});
$("#global-search").addEventListener("input",()=>{activeCategory="Semua";renderTools();renderSites();});
$("#global-search").addEventListener("keydown",e=>{if(e.key==="Enter")$("#tools").scrollIntoView({behavior:"smooth"});});
$("#admin-open").addEventListener("click",openAdmin);$("#cta-admin").addEventListener("click",openAdmin);
$("#tool-modal").addEventListener("click",e=>{if(e.target.id==="tool-modal")closeModal("tool-modal");});
$("#admin-modal").addEventListener("click",e=>{if(e.target.id==="admin-modal")closeModal("admin-modal");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){$$(".modal-backdrop").forEach(m=>m.hidden=true);}});
$("#tool-form").addEventListener("submit",e=>{e.preventDefault();const name=$("#tool-name").value.trim(),category=$("#tool-category").value,description=$("#tool-description").value.trim(),id=$("#edit-id").value||slug(name)+"-"+Date.now();const old=tools.find(t=>t.id===id);const item={id,name,category,description,icon:old?.icon||"✦",type:old?.type||"custom"};tools=old?tools.map(t=>t.id===id?item:t):[item,...tools];saveStore();renderTools();renderAdmin();resetToolForm();toast("Tool disimpan di browser ini.");});
$("#site-form").addEventListener("submit",e=>{e.preventDefault();const name=$("#site-name").value.trim(),category=$("#site-category").value.trim(),url=$("#site-url").value.trim();try{const u=new URL(url);if(!["http:","https:"].includes(u.protocol))throw Error();sites.unshift({id:slug(name)+"-"+Date.now(),name,category,url:u.href,description:category+" website pilihan"});saveStore();renderSites();renderAdmin();e.target.reset();toast("Website ditambahkan di browser ini.");}catch{toast("Masukkan URL HTTP/HTTPS yang valid.");}});
$("#reset-tool-form").addEventListener("click",resetToolForm);
$("#reset-all").addEventListener("click",()=>{if(!confirm("Pulihkan tools dan website bawaan? Perubahan lokal akan hilang."))return;tools=DEFAULT_TOOLS.map(x=>({...x}));sites=DEFAULT_SITES.map(x=>({...x}));saveStore();renderTools();renderSites();renderAdmin();toast("Data bawaan dipulihkan.");});
$("#copy-example").addEventListener("click",()=>copyText(JSON.stringify({success:true,name:"RenzX Tools API",version:"1.0.0",status:"operational"},null,2)));
$("#year").textContent=new Date().getFullYear();
renderTools();renderSites();
