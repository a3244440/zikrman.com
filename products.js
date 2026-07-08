/* ============================================================
   ZIKRMAN — каталог товаров
   Чтобы добавить товар: скопируйте блок { ... } и измените поля.
   image — прямая ссылка на фото (например, с CDN Tilda).
   Если фото пока нет, оставьте image: null — карточка покажет
   фирменную заглушку.
   ============================================================ */

const PRODUCTS = [
  {
    id: 1,
    name: "Изделие №1", // замените на реальное название
    category: "new",    // ключ категории из CATEGORIES ниже
    price: 24900,       // цена в тенге, только число
    sizes: ["S", "M", "L", "XL"],
    image: "https://optim.tildacdn.one/stor3035-3131-4433-b566-666336333664/-/format/webp/99193216.jpg.webp",
    description: "Краткое описание изделия: ткань, посадка, детали."
  },
  {
    id: 2,
    name: "Изделие №2 (демо)",
    category: "new",
    price: 19900,
    sizes: ["M", "L", "XL"],
    image: null,
    description: "Демо-карточка. Пришлите ссылку на фото — заменим."
  },
  {
    id: 3,
    name: "Изделие №3 (демо)",
    category: "classic",
    price: 32900,
    sizes: ["S", "M", "L"],
    image: null,
    description: "Демо-карточка. Пришлите ссылку на фото — заменим."
  },
  {
    id: 4,
    name: "Изделие №4 (демо)",
    category: "classic",
    price: 27900,
    sizes: ["M", "L", "XL", "XXL"],
    image: null,
    description: "Демо-карточка. Пришлите ссылку на фото — заменим."
  },
  {
    id: 5,
    name: "Изделие №5 (демо)",
    category: "accessories",
    price: 8900,
    sizes: [],
    image: null,
    description: "Демо-карточка. Пришлите ссылку на фото — заменим."
  },
  {
    id: 6,
    name: "Изделие №6 (демо)",
    category: "accessories",
    price: 12900,
    sizes: [],
    image: null,
    description: "Демо-карточка. Пришлите ссылку на фото — заменим."
  }
];

/* Категории каталога: key должен совпадать с полем category у товара */
const CATEGORIES = [
  { key: "all",         label: "Все" },
  { key: "new",         label: "Новинки" },
  { key: "classic",     label: "Классика" },
  { key: "accessories", label: "Аксессуары" }
];

/* Контакты — замените на реальные */
const CONTACTS = {
  whatsapp: "77000000000",              // номер без «+», только цифры
  instagram: "https://instagram.com/",  // ссылка на профиль
  city: "Астана, Казахстан"
};
