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
    const res = await fetch(`https://formsubmit.co/ajax/${INVITE_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ ...details, _subject: subject, _cc: INVITE_CC, _template: "table", _captcha: "false" })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false || data.success === "false") throw new Error("send failed");
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
