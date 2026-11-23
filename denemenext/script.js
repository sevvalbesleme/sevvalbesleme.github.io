const observations = [
  {
    tag: "GÖZLEM 01", title: "Biriken su", icon: "≈",
    description: "Kaldırım kenarında biriken yağmur suyu, yayaların yolunu değiştirmesine neden oluyor.",
    meta: "Yaya erişimi · Yağış sonrası"
  },
  {
    tag: "GÖZLEM 02", title: "Değişen rota", icon: "↗",
    description: "Geçişi zorlaşan bir sokak, insanların daha uzun ve farklı bir güzergâh seçmesine yol açabiliyor.",
    meta: "Günlük hareketlilik · Alternatif rota"
  },
  {
    tag: "GÖZLEM 03", title: "Esnaf deneyimi", icon: "⌂",
    description: "Yağmurun dükkân girişine ulaştığı noktalar, iş gününü ve hazırlık rutinlerini etkileyebiliyor.",
    meta: "Yerel yaşam · İş yeri çevresi"
  }
];

const markers = [...document.querySelectorAll(".map-marker")];
let currentPlace = 0;

function showPlace(index) {
  currentPlace = (index + observations.length) % observations.length;
  const place = observations[currentPlace];
  document.getElementById("placeTag").textContent = place.tag;
  document.getElementById("cardNumber").textContent = String(currentPlace + 1).padStart(2, "0");
  document.getElementById("placeIcon").textContent = place.icon;
  document.getElementById("placeTitle").textContent = place.title;
  document.getElementById("placeDescription").textContent = place.description;
  document.getElementById("placeMeta").textContent = place.meta;
  document.getElementById("placeProgress").textContent = `${currentPlace + 1} / ${observations.length}`;
  markers.forEach((marker, i) => {
    const active = i === currentPlace;
    marker.classList.toggle("active", active);
    marker.setAttribute("aria-pressed", String(active));
  });
}

markers.forEach(marker => marker.addEventListener("click", () => showPlace(Number(marker.dataset.place))));
document.getElementById("prevPlace").addEventListener("click", () => showPlace(currentPlace - 1));
document.getElementById("nextPlace").addEventListener("click", () => showPlace(currentPlace + 1));
document.getElementById("resetMap").addEventListener("click", () => {
  showPlace(0);
  document.getElementById("mapCanvas").scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("Harita başlangıç görünümüne döndü.");
});

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Menüyü aç");
}));

// Story search and category filtering
const storySearch = document.getElementById("storySearch");
const storyFilter = document.getElementById("storyFilter");
const storyCards = [...document.querySelectorAll(".story-card")];
const emptyState = document.getElementById("emptyState");
function filterStories() {
  const query = storySearch.value.trim().toLocaleLowerCase("tr-TR");
  const category = storyFilter.value;
  let visible = 0;
  storyCards.forEach(card => {
    const matchesText = `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase("tr-TR").includes(query);
    const matchesCategory = category === "all" || card.dataset.category === category;
    const show = matchesText && matchesCategory;
    card.hidden = !show;
    if (show) visible++;
  });
  emptyState.hidden = visible !== 0;
}
storySearch.addEventListener("input", filterStories);
storyFilter.addEventListener("change", filterStories);

// Demo contribution form: no network or persistent storage.
const descriptionInput = document.querySelector('textarea[name="description"]');
const charCount = document.getElementById("charCount");
descriptionInput.addEventListener("input", () => {
  charCount.textContent = descriptionInput.value.length;
});
const form = document.getElementById("observationForm");
const feedback = document.getElementById("formFeedback");
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const title = form.elements.title.value.trim();
  feedback.textContent = `Demo gözlemin hazır: “${title}”. Bu örnek form veriyi göndermiyor.`;
  showToast("Gözlemin demo arayüzüne eklendi ✳");
  form.reset();
  charCount.textContent = "0";
});

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

// Keyboard-friendly marker navigation
document.getElementById("mapCanvas").addEventListener("keydown", event => {
  if (event.key === "ArrowRight") showPlace(currentPlace + 1);
  if (event.key === "ArrowLeft") showPlace(currentPlace - 1);
});
