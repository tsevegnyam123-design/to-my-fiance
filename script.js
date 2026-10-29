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
const EMAILJS = { publicKey: "", serviceId: "", templateId: "" };

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
const SUPABASE_URL = "";  // жишээ: https://abcd1234.supabase.co
const SUPABASE_KEY = "";  // Project Settings → API → anon public key

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
