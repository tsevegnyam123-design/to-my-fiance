/*
  ТОХИРУУЛАХ ХЭСЭГ:
  1) SECRET_CODE: нууц кодоо энд өөрчил.
  2) RELATIONSHIP_START: хамт үерхэж эхэлсэн огноогоо YYYY-MM-DD форматаар бич.
  3) Хөгжмийн нэр, холбоос болон захианы үгийг index.html файлаас өөрчил.

  АНХААР: GitHub Pages статик сайт тул SECRET_CODE нь жинхэнэ хамгаалалт биш.
  Код JavaScript дотор харагдаж болох тул хувийн мэдээлэл бүү байрлуулаарай.
*/
const SECRET_CODE = "huurhnuu2026";
const RELATIONSHIP_START = "2026-01-01"; // ӨӨРСДИЙН ЭХЭЛСЭН ӨДРӨӨР СОЛИНО

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
    document.getElementById("timerCaption").textContent = "script.js дотор эхэлсэн өдрөө зөв оруулаарай ♡";
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
