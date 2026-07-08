/* ============================================================
   ZIKRMAN — логика каталога
   ============================================================ */

const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const modal = document.getElementById("modal");
const modalMedia = document.getElementById("modal-media");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");
const modalSizesWrap = document.getElementById("modal-sizes-wrap");
const modalSizes = document.getElementById("modal-sizes");
const orderBtn = document.getElementById("order-btn");

let activeCategory = "all";
let activeProduct = null;
let activeSize = null;
let lastFocused = null;

const fmtPrice = (n) =>
  new Intl.NumberFormat("ru-RU").format(n) + " \u20B8";

/* ---------- Фильтры ---------- */

function renderFilters() {
  filtersEl.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat.key === activeCategory ? " active" : "");
    btn.textContent = cat.label;
    btn.addEventListener("click", () => {
      activeCategory = cat.key;
      renderFilters();
      renderGrid();
    });
    filtersEl.appendChild(btn);
  });
}

/* ---------- Сетка товаров ---------- */

function mediaHTML(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy">`;
  }
  return `<div class="card-placeholder" aria-hidden="true"><span>Z</span></div>`;
}

function renderGrid() {
  grid.innerHTML = "";
  const items = PRODUCTS.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  if (!items.length) {
    grid.innerHTML = `<div class="grid-empty">В этой категории пока пусто</div>`;
    return;
  }

  items.forEach((product, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${product.name}, ${fmtPrice(product.price)}`);
    card.innerHTML = `
      <div class="card-media">
        ${mediaHTML(product)}
        <span class="card-view">Смотреть</span>
      </div>
      <div class="card-info">
        <h3 class="card-name">${product.name}</h3>
        <span class="card-price">${fmtPrice(product.price)}</span>
      </div>`;
    const open = () => openModal(product, card);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
    grid.appendChild(card);
    observer.observe(card);
  });
}

/* Появление карточек при прокрутке */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), idx * 60);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

/* ---------- Модальное окно ---------- */

function openModal(product, sourceEl) {
  activeProduct = product;
  activeSize = null;
  lastFocused = sourceEl;

  modalMedia.innerHTML = mediaHTML(product);
  modalName.textContent = product.name;
  modalPrice.textContent = fmtPrice(product.price);
  modalDesc.textContent = product.description || "";

  if (product.sizes && product.sizes.length) {
    modalSizesWrap.hidden = false;
    modalSizes.innerHTML = "";
    product.sizes.forEach((size) => {
      const btn = document.createElement("button");
      btn.className = "size-btn";
      btn.textContent = size;
      btn.addEventListener("click", () => {
        activeSize = size;
        modalSizes.querySelectorAll(".size-btn").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
        updateOrderLink();
      });
      modalSizes.appendChild(btn);
    });
  } else {
    modalSizesWrap.hidden = true;
  }

  updateOrderLink();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").focus();
}

function updateOrderLink() {
  const sizePart = activeSize ? `, размер ${activeSize}` : "";
  const text = encodeURIComponent(
    `Здравствуйте! Хочу заказать: ${activeProduct.name}${sizePart} — ${fmtPrice(activeProduct.price)}`
  );
  orderBtn.href = `https://wa.me/${CONTACTS.whatsapp}?text=${text}`;
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);
modal.querySelector(".modal-close").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

/* ---------- Хедер при прокрутке ---------- */

const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
}, { passive: true });

/* ---------- Контакты в футере ---------- */

document.getElementById("footer-city").textContent = CONTACTS.city;
document.getElementById("footer-wa").href = `https://wa.me/${CONTACTS.whatsapp}`;
document.getElementById("footer-ig").href = CONTACTS.instagram;
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Старт ---------- */

renderFilters();
renderGrid();
