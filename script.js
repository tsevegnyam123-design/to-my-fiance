/*
  ТОХИРУУЛАХ ХЭСЭГ:
  1) SECRET_CODE: нууц кодоо энд өөрчил.
  2) RELATIONSHIP_START: хамт үерхэж эхэлсэн огноогоо YYYY-MM-DD форматаар бич.
  3) Хөгжмийн нэр, холбоос болон захианы үгийг index.html файлаас өөрчил.

  АНХААР: GitHub Pages статик сайт тул SECRET_CODE нь жинхэнэ хамгаалалт биш.
  Код JavaScript дотор харагдаж болох тул хувийн мэдээлэл бүү байрлуулаарай.
*/
const SECRET_CODE = "0017";
const RELATIONSHIP_START = "2026-08-29"; // ӨӨРСДИЙН ЭХЭЛСЭН ӨДРӨӨР СОЛИНО

const lockScreen = document.getElementById("lockScreen");
const siteContent = document.getElementById("siteContent");
const unlockForm = document.getElementById("unlockForm");
const secretInput = document.getElementById("secretCode");
const lockMessage = document.getElementById("lockMessage");

unlockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (secretInput.value.trim() === SECRET_CODE) {
    lockScreen.classList.add("hidden");
    siteContent.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateTimer();
    setInterval(updateTimer, 1000);
  } else {
    lockMessage.textContent = "Код таарахгүй байна аа. Дахиад нэг оролдоод үзээрэй ♡";
    secretInput.value = "";
    secretInput.focus();
  }
});

document.getElementById("letterBtn").addEventListener("click", () => {
  document.getElementById("letterSecret").classList.toggle("hidden");
});

const giftDialog = document.getElementById("giftDialog");
const dialogText = document.getElementById("dialogText");
document.querySelectorAll(".gift-card").forEach((gift) => {
  gift.addEventListener("click", () => {
    dialogText.textContent = gift.dataset.message;
    if (typeof giftDialog.showModal === "function") giftDialog.showModal();
    else {
      document.getElementById("giftMessage").textContent = gift.dataset.message;
      document.getElementById("giftMessage").classList.remove("hidden");
    }
  });
});
function closeGiftDialog() {
  if (giftDialog.open) giftDialog.close();
}
document.getElementById("closeDialog").addEventListener("click", closeGiftDialog);
document.getElementById("dialogOkay").addEventListener("click", closeGiftDialog);
giftDialog.addEventListener("click", (event) => {
  if (event.target === giftDialog) closeGiftDialog();
});

function updateTimer() {
  // Огноог local time-оор тооцно. Ирээдүйн/буруу огноо бол тайлбар харуулна.
  const parts = RELATIONSHIP_START.split("-").map(Number);
  const start = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
  const now = new Date();
  if (!parts.every(Number.isFinite) || Number.isNaN(start.getTime()) || start > now) {
    ["days", "hours", "minutes", "seconds"].forEach(id => document.getElementById(id).textContent = "—");
    document.getElementById("timerCaption").textContent = "♡";
    return;
  }
  let total = Math.floor((now - start) / 1000);
  const days = Math.floor(total / 86400); total %= 86400;
  const hours = Math.floor(total / 3600); total %= 3600;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  document.getElementById("days").textContent = days.toLocaleString("mn-MN");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  document.getElementById("timerCaption").textContent = `${days.toLocaleString("mn-MN")} өдөр дундаас бидний түүх үргэлжилсээр… ♡`;
}

document.getElementById("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Арын жижигхэн хөвөх зүрхнүүд
const heartLayer = document.querySelector(".floating-hearts");
function addFloatingHeart() {
  if (document.hidden || heartLayer.childElementCount > 14) return;
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent = Math.random() > 0.5 ? "♡" : "✿";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 18}px`;
  heart.style.animationDuration = `${8 + Math.random() * 8}s`;
  heartLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 17000);
}
setInterval(addFloatingHeart, 1600);

// ===== БОЛЗООНЫ УРИЛГА =====
// Статик сайт тул имэйлийг FormSubmit.co үйлчилгээгээр дамжуулан илгээнэ.
// Анх удаа илгээхэд INVITE_EMAIL руу баталгаажуулах имэйл очно — "Activate" дарна.
const INVITE_EMAIL = "tsevegnyam123@gmail.com";
const INVITE_CC = "munkhbayraminerdene998@gmail.com";
const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

const dateForm = document.getElementById("dateForm");
const dateStatus = document.getElementById("dateStatus");
const dateCard = document.getElementById("dateCard");
let pickedActivity = "";

// Өнгөрсөн өдөр сонгохоос сэргийлнэ
(function () {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  document.getElementById("dateDay").min = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
})();

function resetChips() {
  document.querySelectorAll(".chip-pick").forEach((c) => c.setAttribute("aria-pressed", "false"));
  pickedActivity = "";
}
document.querySelectorAll(".chip-pick").forEach((chip) => {
  chip.addEventListener("click", () => {
    const wasOn = chip.getAttribute("aria-pressed") === "true";
    resetChips();
    if (!wasOn) { chip.setAttribute("aria-pressed", "true"); pickedActivity = chip.dataset.value; }
  });
});

function prettyDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y} оны ${m}-р сарын ${d}, ${WEEKDAYS[new Date(y, m - 1, d).getDay()]} гараг`;
}

function setStatus(text, isError) {
  dateStatus.textContent = text;
  dateStatus.className = "date-status" + (isError ? " err" : "");
}

function showInviteCard(details) {
  dateCard.replaceChildren();
  const h = document.createElement("h3");
  h.textContent = "Урилга илгээгдлээ 💌";
  const dl = document.createElement("dl");
  Object.entries(details).forEach(([k, v]) => {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.textContent = v;
    dl.append(dt, dd);
  });
  dateCard.append(h, dl);
  dateCard.classList.remove("hidden");
  dateCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showMailtoFallback(details, subject) {
  const body = Object.entries(details).map(([k, v]) => `${k}: ${v}`).join("\n");
  const a = document.createElement("a");
  a.href = `mailto:${INVITE_EMAIL},${INVITE_CC}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  a.textContent = "имэйл апп-аараа илгээх";
  dateStatus.className = "date-status err";
  dateStatus.replaceChildren("Автоматаар илгээж чадсангүй. Энд дарж ", a, " ♡");
}

dateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const f = new FormData(dateForm);
  if (f.get("_honey")) return; // спам

  const inviter = f.get("inviter");
  const day = f.get("day");
  const time = f.get("time");
  const place = (f.get("place") || "").trim();
  const note = (f.get("note") || "").trim();

  if (!inviter || !day || !time || !place) {
    setStatus("Хэн урьж байгаа, өдөр, цаг, байршлаа бүгдийг нь сонгоорой ♡", true);
    return;
  }

  const details = {
    "Урьсан хүн": inviter,
    "Өдөр": prettyDate(day),
    "Цаг": time,
    "Байршил": place,
    "Юу хийх вэ": pickedActivity || "—",
    "Нэмэлт үг": note || "—"
  };
  const subject = `💌 Болзооны урилга — ${inviter}`;
  const btn = dateForm.querySelector("button[type=submit]");
  btn.disabled = true;
  setStatus("Илгээж байна… ♡", false);

  try {
    await sendInvite(details, subject);
    setStatus("Урилга хоёр имэйл рүү очлоо ♡", false);
    showInviteCard(details);
    dateForm.reset();
    resetChips();
  } catch (err) {
    showMailtoFallback(details, subject);
  } finally {
    btn.disabled = false;
  }
});

// ===== УРИЛГЫН ИМЭЙЛ ИЛГЭЭХ =====
// Загварлаг имэйл: emailjs.com дээр email-template.html-ийг ашиглаад доорх 3 утгыг бөглө.
// Хоосон бол FormSubmit-ийн "box" загвараар илгээнэ.
const EMAILJS = { publicKey: "EEID1NFS4C4LGqqhN", serviceId: "service_wx4ocfg", templateId: "template_546gw5f" };

async function sendInvite(details, subject) {
  if (EMAILJS.publicKey && EMAILJS.serviceId && EMAILJS.templateId) {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS.serviceId,
        template_id: EMAILJS.templateId,
        user_id: EMAILJS.publicKey,
        template_params: {
          to_email: INVITE_EMAIL, cc_email: INVITE_CC, subject,
          inviter: details["Урьсан хүн"], date: details["Өдөр"], time: details["Цаг"],
          place: details["Байршил"], activity: details["Юу хийх вэ"], note: details["Нэмэлт үг"]
        }
      })
    });
    if (!res.ok) throw new Error("emailjs failed");
    return;
  }
  const res = await fetch(`https://formsubmit.co/ajax/${INVITE_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ ...details, _subject: subject, _cc: INVITE_CC, _template: "box", _captcha: "false" })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false || data.success === "false") throw new Error("send failed");
}

// ===== ДУРСАМЖИЙН ГАЛЕРЕЙ (Supabase) =====
// setup-supabase.sql-ийг нэг удаа ажиллуулаад доорх хоёр утгыг бөглө.
const SUPABASE_URL = "https://zadffjbhqikogrulpywn.supabase.co";  // жишээ: https://abcd1234.supabase.co
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZGZmamJocWlrb2dydWxweXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMzQ5MDUsImV4cCI6MjEwODgxMDkwNX0.trCttvFZPwFHEPghWxMZip6Xa2ipFkTGYcLLeLytjsc";  // Project Settings → API → anon public key

const memForm = document.getElementById("memForm");
const memFile = document.getElementById("memFile");
const memPreview = document.getElementById("memPreview");
const memStatus = document.getElementById("memStatus");
const memGallery = document.getElementById("memGallery");
const sbReady = () => Boolean(SUPABASE_URL && SUPABASE_KEY);
const sb = (path, opts = {}) => fetch(SUPABASE_URL + path, {
  ...opts,
  headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, ...(opts.headers || {}) }
});

(function () {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  document.getElementById("memDay").max = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
})();

function setMem(text, isError) {
  memStatus.textContent = text;
  memStatus.className = "date-status" + (isError ? " err" : "");
}

function galleryNote(text) {
  const p = document.createElement("p");
  p.className = "small-note";
  p.textContent = text;
  memGallery.replaceChildren(p);
}

memFile.addEventListener("change", () => {
  const f = memFile.files[0];
  if (!f) { memPreview.hidden = true; return; }
  memPreview.src = URL.createObjectURL(f);
  memPreview.hidden = false;
});

// Утасны том зургийг жижигрүүлж (1600px) илгээнэ
async function resizeImage(file, max = 1600) {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((resolve) => c.toBlob(resolve, "image/jpeg", 0.82));
}

function memCard(m, i) {
  const art = document.createElement("article");
  art.className = `memory-card paper ${i % 2 ? "tilt-right" : "tilt-left"}`;
  const frame = document.createElement("div");
  frame.className = "photo-frame";
  const img = document.createElement("img");
  img.src = `${SUPABASE_URL}/storage/v1/object/public/memories/${m.image_path}`;
  img.alt = m.caption || "Дурсамж";
  img.loading = "lazy";
  frame.append(img);
  const cap = document.createElement("p");
  cap.className = "memory-caption";
  cap.textContent = `“${m.caption || ""}”`;
  const label = document.createElement("span");
  label.className = "date-label";
  label.textContent = [m.taken_on ? prettyDate(m.taken_on) : "", m.place].filter(Boolean).join(" · ");
  const meta = document.createElement("span");
  meta.className = "memory-meta";
  meta.textContent = m.author ? `${m.author} нэмсэн ♡` : "";
  art.append(frame, cap, label, meta);
  return art;
}

async function loadMemories() {
  if (!sbReady()) { galleryNote("Галерей тохируулагдаагүй байна (script.js дотор SUPABASE_URL, SUPABASE_KEY бөглөнө)."); return; }
  try {
    const res = await sb("/rest/v1/memories?select=*&order=taken_on.desc.nullslast,created_at.desc");
    if (!res.ok) throw new Error("load");
    const rows = await res.json();
    if (!rows.length) { galleryNote("Анхны дурсамжаа дээрх хэсгээс нэмээрэй ♡"); return; }
    memGallery.replaceChildren(...rows.map(memCard));
  } catch (err) {
    galleryNote("Дурсамжийг ачаалж чадсангүй.");
  }
}

memForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!sbReady()) { setMem("Эхлээд Supabase тохиргоогоо хийнэ үү (script.js).", true); return; }
  const f = new FormData(memForm), file = memFile.files[0];
  const who = f.get("who"), day = f.get("day");
  const place = (f.get("place") || "").trim(), text = (f.get("text") || "").trim();
  if (!file || !who || !day || !place || !text) {
    setMem("Зураг, өдөр, газар, юу болсон, хэн нэмж байгаагаа бөглөөрэй ♡", true);
    return;
  }
  const btn = memForm.querySelector("button[type=submit]");
  btn.disabled = true;
  setMem("Зургийг илгээж байна… ♡", false);
  try {
    const blob = await resizeImage(file);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    let r = await sb(`/storage/v1/object/memories/${path}`, { method: "POST", headers: { "Content-Type": "image/jpeg" }, body: blob });
    if (!r.ok) throw new Error("upload");
    r = await sb("/rest/v1/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ taken_on: day, place, caption: text, author: who, image_path: path })
    });
    if (!r.ok) throw new Error("insert");
    memForm.reset();
    memPreview.hidden = true;
    setMem("Дурсамж нэмэгдлээ ♡", false);
    await loadMemories();
  } catch (err) {
    setMem("Илгээж чадсангүй. Тохиргоо болон интернэтээ шалгаад дахин оролдоорой.", true);
  } finally {
    btn.disabled = false;
  }
});

loadMemories();

// ===== ШИНЭ ХЭСГҮҮД: түүх, тэмдэглэлт өдөр, шалтгаан, дугтуй, жагсаалт, сэтгэл =====
// Төрсөн өдрөө "MM-DD" хэлбэрээр бич (жишээ нь "03-14"). Хоосон бол харагдахгүй.
const BIRTHDAYS = [{ name: "jookhno", md: "" }, { name: "Amina", md: "" }];

// Эдгээр нь жишээ. Өөрийнхөөрөө солиод 100 хүртэл нэмээрэй.
const REASONS = [
  "Чи инээхэд миний өдөр гэрэлтдэг.",
  "Чи надад өөрөөрөө байхыг зөвшөөрдөг.",
  "Чамтай хамт байхад цаг хугацаа хурдан өнгөрдөг.",
  "Чи жижиг зүйлийг ч анзаардаг.",
  "Чиний дуу хоолой намайг тайвшруулдаг.",
  "Хэцүү өдөр чи надад хүч өгдөг.",
  "Чамтай хамт чимээгүй байх ч дулаахан.",
  "Чиний санал бодол надад чухал.",
  "Чи миний хошигнолыг ойлгодог.",
  "Чамтай хамт шинэ зүйл туршихаас айдаггүй.",
  "Чи намайг өөртөө итгэхэд тусалдаг.",
  "Чи байгаа учраас ирээдүй илүү гэрэлтэй санагддаг."
];

// unlock: "YYYY-MM-DD" бичвэл тэр өдөр хүртэл түгжигдэнэ. Хоосон бол шууд нээгдэнэ.
const LETTERS = [
  { emoji: "🌧️", title: "Уйтгартай байхад нээ", unlock: "", text: "Одоо хэцүү байгааг би мэдэж байна. Чи ганцаараа биш шүү. Гүнзгий амьсгаа аваад жаахан ус уугаарай. Би чиний талд байна. ♡" },
  { emoji: "💭", title: "Санасан үед нээ", unlock: "", text: "Би ч бас чамайг санаж байна. Удахгүй уулзаад чамайг чанга тэвэрнэ. 🌷" },
  { emoji: "🔥", title: "Уурласан үед нээ", unlock: "", text: "Нэг гүнзгий амьсгаа аваарай. Дараа нь юу болсныг тайван ярилцъя. Би чамайг хайрладаг. 💗" },
  { emoji: "🎂", title: "Төрсөн өдөр дээр нээ", unlock: "", text: "Төрсөн өдрийн мэнд! Чи төрсөнд би талархаж байна. 🎂" }
];

const byId = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const todayStr = () => {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const WHO = ["jookhno", "Amina"];
let me = localStorage.getItem("me") || "";
const pubUrl = (path) => `${SUPABASE_URL}/storage/v1/object/public/memories/${path}`;
const JSON_HDR = { "Content-Type": "application/json", Prefer: "return=minimal" };

// --- Тэмдэглэлт өдрүүд ---
function specialDays() {
  const box = byId("specialDays");
  const [sy, sm, sd] = RELATIONSHIP_START.split("-").map(Number);
  if (!sy) return;
  const t = new Date(), base = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  const lastDay = (y, m) => new Date(y, m + 1, 0).getDate();
  const next = (m, d) => {
    for (let y = base.getFullYear(); ; y++) {
      const c = new Date(y, m, Math.min(d, lastDay(y, m)));
      if (c >= base) return c;
    }
  };
  const items = [];
  let c = null;
  for (let k = 0; k < 13 && !c; k++) {
    const mo = base.getMonth() + k;
    const cand = new Date(base.getFullYear(), mo, Math.min(sd, lastDay(base.getFullYear(), mo)));
    if (cand >= base) c = cand;
  }
  const months = (c.getFullYear() - sy) * 12 + c.getMonth() - (sm - 1);
  if (months > 0) items.push([c, `${months} сарын ой`]);
  const a = next(sm - 1, sd);
  if (a.getFullYear() - sy > 0) items.push([a, `${a.getFullYear() - sy} жилийн ой`]);
  BIRTHDAYS.forEach((b) => {
    if (!/^\d\d-\d\d$/.test(b.md)) return;
    const [m, d] = b.md.split("-").map(Number);
    items.push([next(m - 1, d), `${b.name}-ийн төрсөн өдөр`]);
  });
  box.replaceChildren(...items.map(([dt, label]) => {
    const n = Math.round((dt - base) / 864e5);
    const card = el("div");
    card.append(el("strong", "", n === 0 ? "🎉" : String(n)), el("span", "", n === 0 ? `Өнөөдөр ${label}!` : `өдрийн дараа: ${label}`));
    return card;
  }));
}

// --- Шалтгаан ---
let lastReason = -1;
byId("reasonBtn").addEventListener("click", () => {
  let i;
  do { i = Math.floor(Math.random() * REASONS.length); } while (i === lastReason && REASONS.length > 1);
  lastReason = i;
  byId("reasonText").textContent = REASONS[i];
  byId("reasonNum").textContent = `#${i + 1} / ${REASONS.length}`;
});

// --- Нээх захиа ---
byId("lettersBox").replaceChildren(...LETTERS.map((l) => {
  const b = el("button", "gift-card paper");
  b.type = "button";
  b.append(el("span", "", l.emoji), el("b", "", l.title), el("small", "", l.unlock ? "🔒 түгжээтэй байж магадгүй" : "Нээх"));
  b.addEventListener("click", () => {
    const left = l.unlock ? Math.ceil((new Date(l.unlock + "T00:00:00") - new Date()) / 864e5) : 0;
    dialogText.textContent = left > 0 ? `🔒 Энэ захиа ${left} өдрийн дараа (${l.unlock}) нээгдэнэ. Жаахан хүлээгээрээч ♡` : l.text;
    if (typeof giftDialog.showModal === "function") giftDialog.showModal();
  });
  return b;
}));

// --- Supabase "items" (түүх, жагсаалт) ---
async function toggleDone(m, done) {
  await sb(`/rest/v1/items?id=eq.${m.id}`, { method: "PATCH", headers: JSON_HDR, body: JSON.stringify({ done }) });
  loadList(m.kind);
}

async function attachPhoto(m, file) {
  if (!file) return;
  try {
    const blob = await resizeImage(file);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    let r = await sb(`/storage/v1/object/memories/${path}`, { method: "POST", headers: { "Content-Type": "image/jpeg" }, body: blob });
    if (!r.ok) throw new Error("upload");
    r = await sb(`/rest/v1/items?id=eq.${m.id}`, { method: "PATCH", headers: JSON_HDR, body: JSON.stringify({ image_path: path }) });
    if (!r.ok) throw new Error("patch");
    loadList(m.kind);
  } catch (err) { alert("Зураг илгээж чадсангүй."); }
}

function todoRow(m, photo) {
  const row = el("div", "todo-item" + (m.done ? " done" : ""));
  const lab = el("label", "todo-main");
  const cb = document.createElement("input");
  cb.type = "checkbox"; cb.checked = m.done;
  cb.addEventListener("change", () => toggleDone(m, cb.checked));
  const txt = el("span", "todo-text");
  txt.append(el("b", "", m.title));
  if (m.detail) txt.append(el("small", "", m.detail));
  if (m.author) txt.append(el("small", "todo-by", `${m.author} нэмсэн`));
  lab.append(cb, txt);
  row.append(lab);
  if (photo && m.image_path) {
    const a = el("a"); a.href = pubUrl(m.image_path); a.target = "_blank"; a.rel = "noopener noreferrer";
    const img = el("img", "todo-thumb"); img.src = pubUrl(m.image_path); img.alt = m.title; img.loading = "lazy";
    a.append(img); row.append(a);
  } else if (photo && m.done) {
    const l = el("label", "todo-photo", "📷 Зураг холбох");
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*"; inp.hidden = true;
    inp.addEventListener("change", () => attachPhoto(m, inp.files[0]));
    l.append(inp); row.append(l);
  }
  return row;
}

function tlRow(m) {
  const n = el("div", "tl-item");
  n.append(el("div", "tl-date", m.day ? prettyDate(m.day) : ""), el("div", "tl-title", m.title));
  if (m.detail) n.append(el("div", "tl-detail", m.detail));
  if (m.author) n.append(el("div", "tl-meta", `${m.author} нэмсэн ♡`));
  return n;
}

const LISTS = {
  timeline: { box: "timelineBox", form: "timelineForm", order: "day.asc.nullslast,created_at.asc", req: ["day", "title"], render: tlRow,
    fields: [["day", "date", "Хэдний өдөр"], ["title", "text", "Юу болсон бэ?"], ["detail", "textarea", "Тайлбар (заавал биш)"]] },
  bucket: { box: "bucketBox", form: "bucketForm", order: "done.asc,created_at.desc", req: ["title"], render: (m) => todoRow(m, false),
    fields: [["title", "text", "Хамтдаа хийх зүйл"]] },
  place: { box: "placeBox", form: "placeForm", order: "done.asc,created_at.desc", req: ["title"], render: (m) => todoRow(m, true),
    fields: [["title", "text", "Очих газар"], ["detail", "text", "Тайлбар (заавал биш)"]] }
};

function buildForm(kind, cfg) {
  const f = byId(cfg.form);
  const who = WHO.map((w) => `<label class="who-opt"><input type="radio" name="author" value="${w}"><span>${w}</span></label>`).join("");
  const fields = cfg.fields.map(([n, t, l]) => t === "textarea"
    ? `<label class="field-label">${l}<textarea name="${n}" rows="2" maxlength="300"></textarea></label>`
    : `<label class="field-label">${l}<input name="${n}" type="${t}" maxlength="120"></label>`).join("");
  f.innerHTML = `<div class="who-row">${who}</div>${fields}<button class="primary-btn" type="submit">Нэмэх ♡</button><p class="date-status" aria-live="polite"></p>`;
  const pick = () => { const r = f.querySelector(`input[name="author"][value="${me}"]`); if (r) r.checked = true; };
  pick();
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const st = f.querySelector(".date-status");
    const d = Object.fromEntries(new FormData(f));
    if (!sbReady()) { st.textContent = "Supabase тохируулаагүй байна."; st.className = "date-status err"; return; }
    if (!d.author || cfg.req.some((k) => !(d[k] || "").trim())) {
      st.textContent = "Хэн нэмж байгаагаа болон гол талбарыг бөглөөрэй ♡"; st.className = "date-status err"; return;
    }
    me = d.author; localStorage.setItem("me", me);
    const row = { kind, author: d.author, title: (d.title || "").trim(), detail: (d.detail || "").trim() || null, day: d.day || null };
    try {
      const r = await sb("/rest/v1/items", { method: "POST", headers: JSON_HDR, body: JSON.stringify(row) });
      if (!r.ok) throw new Error("save");
      f.reset(); pick(); st.textContent = ""; loadList(kind);
    } catch (err) { st.textContent = "Хадгалж чадсангүй."; st.className = "date-status err"; }
  });
}

async function loadList(kind) {
  const cfg = LISTS[kind], box = byId(cfg.box);
  if (!sbReady()) { box.textContent = "Supabase тохируулаагүй байна."; return; }
  try {
    const r = await sb(`/rest/v1/items?kind=eq.${kind}&select=*&order=${cfg.order}`);
    if (!r.ok) throw new Error("load");
    const rows = await r.json();
    if (!rows.length) { box.textContent = "Одоохондоо хоосон байна. Эхнийхийг нэмээрэй ♡"; return; }
    box.replaceChildren(...rows.map(cfg.render));
  } catch (err) { box.textContent = "Ачаалж чадсангүй (setup-supabase-2.sql ажилласан эсэхийг шалгаарай)."; }
}

// --- Өдрийн сэтгэл ---
const MOODS = ["🥰", "😊", "😌", "🤩", "😴", "😢", "😡", "🤒"];
byId("moodPick").replaceChildren(...MOODS.map((e) => {
  const b = el("button", "mood-btn", e);
  b.type = "button";
  b.addEventListener("click", () => setMood(e));
  return b;
}));
if (me) { const r = document.querySelector(`input[name="moodWho"][value="${me}"]`); if (r) r.checked = true; }

async function setMood(emoji) {
  const st = byId("moodStatus");
  const who = (document.querySelector('input[name="moodWho"]:checked') || {}).value;
  if (!who) { st.textContent = "Эхлээд хэн гэдгээ сонгоорой ♡"; st.className = "date-status err"; return; }
  if (!sbReady()) return;
  me = who; localStorage.setItem("me", me);
  try {
    const r = await sb("/rest/v1/items", { method: "POST", headers: JSON_HDR, body: JSON.stringify({ kind: "mood", author: who, title: emoji, day: todayStr() }) });
    if (!r.ok) throw new Error("mood");
    st.textContent = "Хадгаллаа ♡"; st.className = "date-status";
    loadMood();
  } catch (err) { st.textContent = "Хадгалж чадсангүй."; st.className = "date-status err"; }
}

async function loadMood() {
  const today = byId("moodToday"), hist = byId("moodHistory");
  if (!sbReady()) return;
  try {
    const r = await sb("/rest/v1/items?kind=eq.mood&select=*&order=created_at.desc&limit=40");
    if (!r.ok) throw new Error("mood load");
    const rows = await r.json(), t = todayStr();
    today.replaceChildren(...WHO.map((w) => {
      const m = rows.find((x) => x.author === w && x.day === t);
      const c = el("div", "mood-card");
      c.append(el("span", "mood-face", m ? m.title : "—"), el("small", "", `${w} · өнөөдөр`));
      return c;
    }));
    hist.replaceChildren(...rows.slice(0, 12).map((m) => el("span", "mood-chip", `${m.title} ${m.author} · ${(m.day || "").slice(5)}`)));
  } catch (err) { today.textContent = "Ачаалж чадсангүй."; }
}

specialDays();
Object.keys(LISTS).forEach((k) => { buildForm(k, LISTS[k]); loadList(k); });
loadMood();
