import type { Product } from '../lib/types'

// Каталог ZIKR, перенесённый со старого сайта на Tilda (zikrmanbishkek.tilda.ws).
// Используется, пока не подключён Supabase, и как начальные данные для базы (supabase/seed.sql).
// Фото лежат в public/images/products/<slug>/.

type Seed = Omit<Product, 'id' | 'created_at'>

const seeds: Seed[] = [
  {
    "slug": "futbolka-s-kalligrafiey-temnyy-purpurno-siniy",
    "name": "Футболка с каллиграфией Темный пурпурно-синий",
    "category": "tshirts",
    "price": 30,
    "old_price": null,
    "description": "Футболка ZIKR с арабской каллиграфией на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Тёмный пурпурно-синий",
        "hex": "#2E3561"
      }
    ],
    "images": [
      "/images/products/futbolka-s-kalligrafiey-temnyy-purpurno-siniy/01.webp",
      "/images/products/futbolka-s-kalligrafiey-temnyy-purpurno-siniy/02.webp",
      "/images/products/futbolka-s-kalligrafiey-temnyy-purpurno-siniy/03.webp"
    ],
    "is_new": false,
    "is_featured": true,
    "in_stock": true,
    "sort_order": 0
  },
  {
    "slug": "futbolka-s-kalligrafiey-akvamarinovyy",
    "name": "Футболка с каллиграфией аквамариновый",
    "category": "tshirts",
    "price": 30,
    "old_price": null,
    "description": "Футболка ZIKR с арабской каллиграфией на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Аквамариновый",
        "hex": "#A9C8E6"
      }
    ],
    "images": [
      "/images/products/futbolka-s-kalligrafiey-akvamarinovyy/01.webp",
      "/images/products/futbolka-s-kalligrafiey-akvamarinovyy/02.webp",
      "/images/products/futbolka-s-kalligrafiey-akvamarinovyy/03.webp",
      "/images/products/futbolka-s-kalligrafiey-akvamarinovyy/04.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 1
  },
  {
    "slug": "futbolka-s-kalligrafiey-seryy",
    "name": "Футболка с каллиграфией серый",
    "category": "tshirts",
    "price": 30,
    "old_price": null,
    "description": "Футболка ZIKR с арабской каллиграфией на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Серый",
        "hex": "#55575B"
      }
    ],
    "images": [
      "/images/products/futbolka-s-kalligrafiey-seryy/01.webp",
      "/images/products/futbolka-s-kalligrafiey-seryy/02.webp",
      "/images/products/futbolka-s-kalligrafiey-seryy/03.webp",
      "/images/products/futbolka-s-kalligrafiey-seryy/04.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 2
  },
  {
    "slug": "futbolka-s-kalligrafiey-chernyy",
    "name": "Футболка с каллиграфией черный",
    "category": "tshirts",
    "price": 30,
    "old_price": null,
    "description": "Футболка ZIKR с арабской каллиграфией на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/futbolka-s-kalligrafiey-chernyy/01.webp",
      "/images/products/futbolka-s-kalligrafiey-chernyy/02.webp",
      "/images/products/futbolka-s-kalligrafiey-chernyy/03.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 3
  },
  {
    "slug": "futbolka-s-kalligrafiey-belyy",
    "name": "Футболка с каллиграфией белый",
    "category": "tshirts",
    "price": 30,
    "old_price": null,
    "description": "Футболка ZIKR с арабской каллиграфией на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Белый",
        "hex": "#F4F3EF"
      }
    ],
    "images": [
      "/images/products/futbolka-s-kalligrafiey-belyy/01.webp",
      "/images/products/futbolka-s-kalligrafiey-belyy/02.webp",
      "/images/products/futbolka-s-kalligrafiey-belyy/03.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 4
  },
  {
    "slug": "futbolka-s-kalligrafiey-chernyy-s-belym-tekstom",
    "name": "Футболка с каллиграфией черный с белым текстом",
    "category": "tshirts",
    "price": 30,
    "old_price": null,
    "description": "Футболка ZIKR с арабской каллиграфией на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/futbolka-s-kalligrafiey-chernyy-s-belym-tekstom/01.webp",
      "/images/products/futbolka-s-kalligrafiey-chernyy-s-belym-tekstom/02.webp",
      "/images/products/futbolka-s-kalligrafiey-chernyy-s-belym-tekstom/03.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 5
  },
  {
    "slug": "futbolka-s-kalligrafiey-belyy-s-chernym-tekstom",
    "name": "Футболка с каллиграфией белый с черным текстом",
    "category": "tshirts",
    "price": 30,
    "old_price": null,
    "description": "Футболка ZIKR с арабской каллиграфией на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Белый",
        "hex": "#F4F3EF"
      }
    ],
    "images": [
      "/images/products/futbolka-s-kalligrafiey-belyy-s-chernym-tekstom/01.webp",
      "/images/products/futbolka-s-kalligrafiey-belyy-s-chernym-tekstom/02.webp",
      "/images/products/futbolka-s-kalligrafiey-belyy-s-chernym-tekstom/03.webp",
      "/images/products/futbolka-s-kalligrafiey-belyy-s-chernym-tekstom/04.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 6
  },
  {
    "slug": "futbolka-zikr-chernyy",
    "name": "Футболка ZIKR черный",
    "category": "tshirts",
    "price": 35,
    "old_price": null,
    "description": "Футболка с логотипом ZIKR на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/futbolka-zikr-chernyy/01.webp",
      "/images/products/futbolka-zikr-chernyy/02.webp",
      "/images/products/futbolka-zikr-chernyy/03.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 7
  },
  {
    "slug": "futbolka-zikr-belyy",
    "name": "Футболка ZIKR белый",
    "category": "tshirts",
    "price": 35,
    "old_price": null,
    "description": "Футболка с логотипом ZIKR на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Белый",
        "hex": "#F4F3EF"
      }
    ],
    "images": [
      "/images/products/futbolka-zikr-belyy/01.webp",
      "/images/products/futbolka-zikr-belyy/02.webp",
      "/images/products/futbolka-zikr-belyy/03.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 8
  },
  {
    "slug": "futbolka-zikr-temnyy-purpurno-siniy",
    "name": "Футболка ZIKR Темный пурпурно-синий",
    "category": "tshirts",
    "price": 35,
    "old_price": null,
    "description": "Футболка с логотипом ZIKR на груди.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Тёмный пурпурно-синий",
        "hex": "#2E3561"
      }
    ],
    "images": [
      "/images/products/futbolka-zikr-temnyy-purpurno-siniy/01.webp",
      "/images/products/futbolka-zikr-temnyy-purpurno-siniy/02.webp",
      "/images/products/futbolka-zikr-temnyy-purpurno-siniy/03.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 9
  },
  {
    "slug": "kostyum-new-chernyy",
    "name": "Костюм New черный",
    "category": "casual",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR: куртка на молнии с воротником и брюки.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/kostyum-new-chernyy/01.webp",
      "/images/products/kostyum-new-chernyy/02.webp",
      "/images/products/kostyum-new-chernyy/03.webp",
      "/images/products/kostyum-new-chernyy/04.webp",
      "/images/products/kostyum-new-chernyy/05.webp",
      "/images/products/kostyum-new-chernyy/06.webp"
    ],
    "is_new": true,
    "is_featured": true,
    "in_stock": true,
    "sort_order": 10
  },
  {
    "slug": "kostyum-new-belyy-verh-chernyy-niz",
    "name": "Костюм New белый верх, черный низ",
    "category": "casual",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR: куртка на молнии с воротником и брюки.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Белый / чёрный",
        "hex": "#F4F3EF"
      }
    ],
    "images": [
      "/images/products/kostyum-new-belyy-verh-chernyy-niz/01.webp",
      "/images/products/kostyum-new-belyy-verh-chernyy-niz/02.webp",
      "/images/products/kostyum-new-belyy-verh-chernyy-niz/03.webp",
      "/images/products/kostyum-new-belyy-verh-chernyy-niz/04.webp",
      "/images/products/kostyum-new-belyy-verh-chernyy-niz/05.webp"
    ],
    "is_new": true,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 11
  },
  {
    "slug": "kostyum-new-temno-siniy",
    "name": "Костюм New темно-синий",
    "category": "casual",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR: куртка на молнии с воротником и брюки.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Тёмно-синий",
        "hex": "#1F2A44"
      }
    ],
    "images": [
      "/images/products/kostyum-new-temno-siniy/01.webp",
      "/images/products/kostyum-new-temno-siniy/02.webp",
      "/images/products/kostyum-new-temno-siniy/03.webp",
      "/images/products/kostyum-new-temno-siniy/04.webp",
      "/images/products/kostyum-new-temno-siniy/05.webp"
    ],
    "is_new": true,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 12
  },
  {
    "slug": "kostyum-bez-vorotnika-new-korichnevyy",
    "name": "Костюм без воротника New коричневый",
    "category": "casual",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR: куртка на молнии без воротника и брюки.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Коричневый",
        "hex": "#5C4631"
      }
    ],
    "images": [
      "/images/products/kostyum-bez-vorotnika-new-korichnevyy/01.webp",
      "/images/products/kostyum-bez-vorotnika-new-korichnevyy/02.webp",
      "/images/products/kostyum-bez-vorotnika-new-korichnevyy/03.webp",
      "/images/products/kostyum-bez-vorotnika-new-korichnevyy/04.webp",
      "/images/products/kostyum-bez-vorotnika-new-korichnevyy/05.webp",
      "/images/products/kostyum-bez-vorotnika-new-korichnevyy/06.webp"
    ],
    "is_new": true,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 13
  },
  {
    "slug": "kostyum-bez-vorotnika-new-seryy",
    "name": "Костюм без воротника New серый",
    "category": "casual",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR: куртка на молнии без воротника и брюки.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Серый",
        "hex": "#55575B"
      }
    ],
    "images": [
      "/images/products/kostyum-bez-vorotnika-new-seryy/01.webp",
      "/images/products/kostyum-bez-vorotnika-new-seryy/02.webp",
      "/images/products/kostyum-bez-vorotnika-new-seryy/03.webp",
      "/images/products/kostyum-bez-vorotnika-new-seryy/04.webp",
      "/images/products/kostyum-bez-vorotnika-new-seryy/05.webp",
      "/images/products/kostyum-bez-vorotnika-new-seryy/06.webp"
    ],
    "is_new": true,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 14
  },
  {
    "slug": "kostyum-bez-vorotnika-new-chernyy",
    "name": "Костюм без воротника New черный",
    "category": "casual",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR: куртка на молнии без воротника и брюки.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/kostyum-bez-vorotnika-new-chernyy/01.webp",
      "/images/products/kostyum-bez-vorotnika-new-chernyy/02.webp",
      "/images/products/kostyum-bez-vorotnika-new-chernyy/03.webp",
      "/images/products/kostyum-bez-vorotnika-new-chernyy/04.webp",
      "/images/products/kostyum-bez-vorotnika-new-chernyy/05.webp",
      "/images/products/kostyum-bez-vorotnika-new-chernyy/06.webp"
    ],
    "is_new": true,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 15
  },
  {
    "slug": "shtany-holodok-chernyy",
    "name": "Штаны холодок черный",
    "category": "pants",
    "price": 35,
    "old_price": null,
    "description": "Лёгкие летние штаны ZIKR из ткани «холодок».",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/shtany-holodok-chernyy/01.webp",
      "/images/products/shtany-holodok-chernyy/02.webp",
      "/images/products/shtany-holodok-chernyy/03.webp",
      "/images/products/shtany-holodok-chernyy/04.webp",
      "/images/products/shtany-holodok-chernyy/05.webp"
    ],
    "is_new": false,
    "is_featured": true,
    "in_stock": true,
    "sort_order": 16
  },
  {
    "slug": "shtany-holodok-temno-siniy",
    "name": "Штаны холодок темно-синий",
    "category": "pants",
    "price": 35,
    "old_price": null,
    "description": "Лёгкие летние штаны ZIKR из ткани «холодок».",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Тёмно-синий",
        "hex": "#1F2A44"
      }
    ],
    "images": [
      "/images/products/shtany-holodok-temno-siniy/01.webp",
      "/images/products/shtany-holodok-temno-siniy/02.webp",
      "/images/products/shtany-holodok-temno-siniy/03.webp",
      "/images/products/shtany-holodok-temno-siniy/04.webp",
      "/images/products/shtany-holodok-temno-siniy/05.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 17
  },
  {
    "slug": "shtany-chernyy-holodok-s-karmanami",
    "name": "Штаны черный холодок с карманами",
    "category": "pants",
    "price": 35,
    "old_price": null,
    "description": "Лёгкие летние штаны ZIKR из ткани «холодок» с накладными карманами.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/shtany-chernyy-holodok-s-karmanami/01.webp",
      "/images/products/shtany-chernyy-holodok-s-karmanami/02.webp",
      "/images/products/shtany-chernyy-holodok-s-karmanami/03.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 18
  },
  {
    "slug": "shtany-korichnevyy-holodok-s-karmanami",
    "name": "Штаны коричневый холодок с карманами",
    "category": "pants",
    "price": 35,
    "old_price": null,
    "description": "Лёгкие летние штаны ZIKR из ткани «холодок» с накладными карманами.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Коричневый",
        "hex": "#5C4631"
      }
    ],
    "images": [
      "/images/products/shtany-korichnevyy-holodok-s-karmanami/01.webp",
      "/images/products/shtany-korichnevyy-holodok-s-karmanami/02.webp",
      "/images/products/shtany-korichnevyy-holodok-s-karmanami/03.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 19
  },
  {
    "slug": "premium-casual",
    "name": "Премиум Casual",
    "category": "casual",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR из коллекции Casual: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».",
    "details": [
      "Цвет: темно-синий и серый",
      "Сделано в Турции",
      "Размеры: М(48) - 4XL(58)",
      "Сезон: весна–осень"
    ],
    "size_chart": "М - 48 - Премиум Casual\nОбхват груди: 114 см\nОбхват талии: 114 см\nОбхват бедер - 100 см\nДлина куртки по спинке - 75 см\nДлина брюк от пояса - 95 см\n\nL - 50 - Премиум Casual\nОбхват груди: 118 см\nОбхват талии: 118 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 75 см\nДлина брюк от пояса - 95 см\n\nXL - 52 - Премиум Casual\nОбхват груди: 120 см\nОбхват талии: 120 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 78 см\nДлина брюк от пояса - 97 см\n\nXXL - 54 - Премиум Casual\nОбхват груди: 124 см\nОбхват талии: 124 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 78 см\nДлина брюк от пояса - 98 см\n\nXXXL - 56 - Премиум Casual\nОбхват груди: 128 см\nОбхват талии: 128 см\nОбхват бедер - 132 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 99 см\n\nXXXXL - 58 - Премиум Casual\nОбхват груди: 136 см\nОбхват талии: 136 см\nОбхват бедер - 132 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 101 см",
    "sizes": [
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Тёмно-синий",
        "hex": "#1F2A44"
      }
    ],
    "images": [
      "/images/products/premium-casual/01.webp",
      "/images/products/premium-casual/02.webp",
      "/images/products/premium-casual/03.webp",
      "/images/products/premium-casual/04.webp",
      "/images/products/premium-casual/05.webp",
      "/images/products/premium-casual/06.webp"
    ],
    "is_new": false,
    "is_featured": true,
    "in_stock": true,
    "sort_order": 20
  },
  {
    "slug": "casual-grey",
    "name": "Casual Grey",
    "category": "casual",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR из коллекции Casual: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».",
    "details": [
      "Цвет: темно-синий и серый",
      "Сделано в Турции",
      "Размеры: М(48) - 4XL(58)",
      "Сезон: весна–осень"
    ],
    "size_chart": "М - 48 - Премиум Casual\nОбхват груди: 114 см\nОбхват талии: 114 см\nОбхват бедер - 100 см\nДлина куртки по спинке - 75 см\nДлина брюк от пояса - 95 см\n\nL - 50 - Премиум Casual\nОбхват груди: 118 см\nОбхват талии: 118 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 75 см\nДлина брюк от пояса - 95 см\n\nXL - 52 - Премиум Casual\nОбхват груди: 120 см\nОбхват талии: 120 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 78 см\nДлина брюк от пояса - 97 см\n\nXXL - 54 - Премиум Casual\nОбхват груди: 124 см\nОбхват талии: 124 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 78 см\nДлина брюк от пояса - 98 см\n\nXXXL - 56 - Премиум Casual\nОбхват груди: 128 см\nОбхват талии: 128 см\nОбхват бедер - 132 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 99 см\n\nXXXXL - 58 - Премиум Casual\nОбхват груди: 136 см\nОбхват талии: 136 см\nОбхват бедер - 132 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 101 см",
    "sizes": [
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Тёмно-синий / серый",
        "hex": "#5B5F6B"
      }
    ],
    "images": [
      "/images/products/casual-grey/01.webp",
      "/images/products/casual-grey/02.webp",
      "/images/products/casual-grey/03.webp",
      "/images/products/casual-grey/04.webp",
      "/images/products/casual-grey/05.webp",
      "/images/products/casual-grey/06.webp",
      "/images/products/casual-grey/07.webp",
      "/images/products/casual-grey/08.webp",
      "/images/products/casual-grey/09.webp",
      "/images/products/casual-grey/10.webp",
      "/images/products/casual-grey/11.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 21
  },
  {
    "slug": "premium-sport",
    "name": "Премиум Sport",
    "category": "sport",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR из коллекции Sport: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».",
    "details": [
      "Сезон: весна–осень"
    ],
    "size_chart": "М - 48 - Премиум Sport\nОбхват груди: 108 см\nДлина руки: 68\nОбхват талии: 108 см\nОбхват бедер - 98 см\nДлина куртки по спинке - 77 см\nДлина брюк от пояса - 100 см\n\nL - 50 - Премиум Sport\nОбхват груди: 110 см\nДлина руки: 70\nОбхват талии: 110 см\nОбхват бедер - 118 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 102 см\n\nXL - 52 - Премиум Sport\nОбхват груди: 116 см\nДлина руки: 70\nОбхват талии: 116 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 77 см\nДлина брюк от пояса - 103 см\n\nXXL - 54 - Премиум Sport\nОбхват груди: 120 см\nДлина руки: 72\nОбхват талии: 120 см\nОбхват бедер - 124 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 108 см\n\nXXXL - 56 - Премиум Sport\nОбхват груди: 122 см\nДлина руки: 71\nОбхват талии: 122 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 78 см\nДлина брюк от пояса - 109 см\n\nXXXXL - 58 - Премиум Sport\nОбхват груди: 124 см\nДлина руки: 69\nОбхват талии: 124 см\nОбхват бедер - 126 см\nДлина куртки по спинке - 76 см\nДлина брюк от пояса - 106 см",
    "sizes": [
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/premium-sport/01.webp",
      "/images/products/premium-sport/02.webp",
      "/images/products/premium-sport/03.webp",
      "/images/products/premium-sport/04.webp",
      "/images/products/premium-sport/05.webp",
      "/images/products/premium-sport/06.webp",
      "/images/products/premium-sport/07.webp",
      "/images/products/premium-sport/08.webp",
      "/images/products/premium-sport/09.webp",
      "/images/products/premium-sport/10.webp",
      "/images/products/premium-sport/11.webp",
      "/images/products/premium-sport/12.webp"
    ],
    "is_new": false,
    "is_featured": true,
    "in_stock": true,
    "sort_order": 22
  },
  {
    "slug": "elite-sport",
    "name": "Elite Sport",
    "category": "sport",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR из коллекции Sport: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».",
    "details": [
      "Сезон: весна–осень"
    ],
    "size_chart": "М - 48 - Elite Sport\nОбхват груди: 108 см\nОбхват талии: 108 см\nОбхват бедер - 106 см\nДлина куртки по спинке - 76 см\nДлина брюк от пояса - 95 см\n\nL - 50 - Elite Sport\nОбхват груди: 114 см\nОбхват талии: 114 см\nОбхват бедер - 124 см\nДлина куртки по спинке - 77 см\nДлина брюк от пояса - 95 см\n\nXL - 52 - Elite Sport\nОбхват груди: 118 см\nОбхват талии: 118 см\nОбхват бедер - 118 см\nДлина куртки по спинке - 75 см\nДлина брюк от пояса - 95 см\n\nXXL - 54 - Elite Sport\nОбхват груди: 118 см\nОбхват талии: 118 см\nОбхват бедер - 124 см\nДлина куртки по спинке - 78 см\nДлина брюк от пояса - 99 см\n\nXXXL - 56 - Elite Sport\nОбхват груди: 126 см\nОбхват талии: 126 см\nОбхват бедер - 124 см\nДлина куртки по спинке - 77 см\nДлина брюк от пояса - 98 см\n\nXXXXL - 58 - Elite Sport\nОбхват груди: 132 см\nОбхват талии: 132 см\nОбхват бедер - 132 см\nДлина куртки по спинке - 77 см\nДлина брюк от пояса - 96 см",
    "sizes": [
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Тёмно-синий",
        "hex": "#1F2A44"
      }
    ],
    "images": [
      "/images/products/elite-sport/01.webp",
      "/images/products/elite-sport/02.webp",
      "/images/products/elite-sport/03.webp",
      "/images/products/elite-sport/04.webp",
      "/images/products/elite-sport/05.webp",
      "/images/products/elite-sport/06.webp",
      "/images/products/elite-sport/07.webp",
      "/images/products/elite-sport/08.webp",
      "/images/products/elite-sport/09.webp",
      "/images/products/elite-sport/10.webp",
      "/images/products/elite-sport/11.webp",
      "/images/products/elite-sport/12.webp"
    ],
    "is_new": false,
    "is_featured": true,
    "in_stock": true,
    "sort_order": 23
  },
  {
    "slug": "prime-sport",
    "name": "Prime Sport",
    "category": "sport",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR из коллекции Sport: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».",
    "details": [
      "Сезон: весна–осень"
    ],
    "size_chart": "М - 48 - Prime Sport\nОбхват груди: 115 см\nОбхват талии: 115 см\nОбхват бедер - 102 см\nДлина куртки по спинке - 77 см\nДлина брюк от пояса - 100 см\n\nL - 50 - Prime Sport\nОбхват груди: 116 см\nОбхват талии: 116 см\nОбхват бедер - 122 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 102 см\n\nXL - 52 - Prime Sport\nОбхват груди: 120 см\nОбхват талии: 120 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 103 см\n\nXXL - 54 - Prime Sport\nОбхват груди: 120 см\nОбхват талии: 120 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 81 см\nДлина брюк от пояса - 103 см\n\nXXXL - 56 - Prime Sport\nОбхват груди: 126 см\nОбхват талии: 126 см\nОбхват бедер - 124 см\nДлина куртки по спинке - 81 см\nДлина брюк от пояса - 108 см\n\nXXXXL - 58 - Prime Sport\nОбхват груди: 132 см\nОбхват талии: 132 см\nОбхват бедер - 132 см\nДлина куртки по спинке - 82 см\nДлина брюк от пояса - 105 см",
    "sizes": [
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Бежево-серый",
        "hex": "#9C948A"
      }
    ],
    "images": [
      "/images/products/prime-sport/01.webp",
      "/images/products/prime-sport/02.webp",
      "/images/products/prime-sport/03.webp",
      "/images/products/prime-sport/04.webp",
      "/images/products/prime-sport/05.webp",
      "/images/products/prime-sport/06.webp",
      "/images/products/prime-sport/07.webp",
      "/images/products/prime-sport/08.webp",
      "/images/products/prime-sport/09.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 24
  },
  {
    "slug": "prime-sport-grey",
    "name": "Prime Sport Grey",
    "category": "sport",
    "price": 70,
    "old_price": null,
    "description": "Костюм ZIKR из коллекции Sport: куртка и брюки. Таблица размеров — во вкладке «Размер и посадка».",
    "details": [
      "Сезон: весна–осень"
    ],
    "size_chart": "М - 48 - Prime Sport\nОбхват груди: 115 см\nОбхват талии: 115 см\nОбхват бедер - 102 см\nДлина куртки по спинке - 77 см\nДлина брюк от пояса - 100 см\n\nL - 50 - Prime Sport\nОбхват груди: 116 см\nОбхват талии: 116 см\nОбхват бедер - 122 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 102 см\n\nXL - 52 - Prime Sport\nОбхват груди: 120 см\nОбхват талии: 120 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 79 см\nДлина брюк от пояса - 103 см\n\nXXL - 54 - Prime Sport\nОбхват груди: 120 см\nОбхват талии: 120 см\nОбхват бедер - 120 см\nДлина куртки по спинке - 81 см\nДлина брюк от пояса - 103 см\n\nXXXL - 56 - Prime Sport\nОбхват груди: 126 см\nОбхват талии: 126 см\nОбхват бедер - 124 см\nДлина куртки по спинке - 81 см\nДлина брюк от пояса - 108 см\n\nXXXXL - 58 - Prime Sport\nОбхват груди: 132 см\nОбхват талии: 132 см\nОбхват бедер - 132 см\nДлина куртки по спинке - 82 см\nДлина брюк от пояса - 105 см",
    "sizes": [
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Серый",
        "hex": "#8C8C8C"
      }
    ],
    "images": [
      "/images/products/prime-sport-grey/01.webp",
      "/images/products/prime-sport-grey/02.webp",
      "/images/products/prime-sport-grey/03.webp",
      "/images/products/prime-sport-grey/04.webp",
      "/images/products/prime-sport-grey/05.webp",
      "/images/products/prime-sport-grey/06.webp",
      "/images/products/prime-sport-grey/07.webp",
      "/images/products/prime-sport-grey/08.webp",
      "/images/products/prime-sport-grey/09.webp",
      "/images/products/prime-sport-grey/10.webp",
      "/images/products/prime-sport-grey/11.webp",
      "/images/products/prime-sport-grey/12.webp",
      "/images/products/prime-sport-grey/13.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 25
  },
  {
    "slug": "futbolka-zikr-belaya",
    "name": "Футболка zikr белая",
    "category": "tshirts",
    "price": 25,
    "old_price": null,
    "description": "Базовая футболка ZIKR свободного кроя.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Белый",
        "hex": "#F4F3EF"
      }
    ],
    "images": [
      "/images/products/futbolka-zikr-belaya/01.webp",
      "/images/products/futbolka-zikr-belaya/02.webp",
      "/images/products/futbolka-zikr-belaya/03.webp",
      "/images/products/futbolka-zikr-belaya/04.webp",
      "/images/products/futbolka-zikr-belaya/05.webp",
      "/images/products/futbolka-zikr-belaya/06.webp",
      "/images/products/futbolka-zikr-belaya/07.webp",
      "/images/products/futbolka-zikr-belaya/08.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 26
  },
  {
    "slug": "futbolka-zikr-chernaya",
    "name": "Футболка zikr черная",
    "category": "tshirts",
    "price": 25,
    "old_price": null,
    "description": "Базовая футболка ZIKR свободного кроя.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/futbolka-zikr-chernaya/01.webp",
      "/images/products/futbolka-zikr-chernaya/02.webp",
      "/images/products/futbolka-zikr-chernaya/03.webp",
      "/images/products/futbolka-zikr-chernaya/04.webp",
      "/images/products/futbolka-zikr-chernaya/05.webp",
      "/images/products/futbolka-zikr-chernaya/06.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 27
  },
  {
    "slug": "futbolka-zikr-bezhevaya",
    "name": "Футболка zikr бежевая",
    "category": "tshirts",
    "price": 25,
    "old_price": null,
    "description": "Базовая футболка ZIKR свободного кроя.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Бежевый",
        "hex": "#D3C6B1"
      }
    ],
    "images": [
      "/images/products/futbolka-zikr-bezhevaya/01.webp",
      "/images/products/futbolka-zikr-bezhevaya/02.webp",
      "/images/products/futbolka-zikr-bezhevaya/03.webp",
      "/images/products/futbolka-zikr-bezhevaya/04.webp",
      "/images/products/futbolka-zikr-bezhevaya/05.webp",
      "/images/products/futbolka-zikr-bezhevaya/06.webp",
      "/images/products/futbolka-zikr-bezhevaya/07.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 28
  },
  {
    "slug": "futbolka-zikr-korichnevaya",
    "name": "Футболка zikr коричневая",
    "category": "tshirts",
    "price": 25,
    "old_price": null,
    "description": "Базовая футболка ZIKR свободного кроя.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Коричневый",
        "hex": "#5C4631"
      }
    ],
    "images": [
      "/images/products/futbolka-zikr-korichnevaya/01.webp",
      "/images/products/futbolka-zikr-korichnevaya/02.webp",
      "/images/products/futbolka-zikr-korichnevaya/03.webp",
      "/images/products/futbolka-zikr-korichnevaya/04.webp",
      "/images/products/futbolka-zikr-korichnevaya/05.webp",
      "/images/products/futbolka-zikr-korichnevaya/06.webp",
      "/images/products/futbolka-zikr-korichnevaya/07.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 29
  },
  {
    "slug": "futbolka-zikr-zelenaya",
    "name": "Футболка zikr зеленая",
    "category": "tshirts",
    "price": 25,
    "old_price": null,
    "description": "Базовая футболка ZIKR свободного кроя.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Зелёный",
        "hex": "#1F3836"
      }
    ],
    "images": [
      "/images/products/futbolka-zikr-zelenaya/01.webp",
      "/images/products/futbolka-zikr-zelenaya/02.webp",
      "/images/products/futbolka-zikr-zelenaya/03.webp",
      "/images/products/futbolka-zikr-zelenaya/04.webp",
      "/images/products/futbolka-zikr-zelenaya/05.webp",
      "/images/products/futbolka-zikr-zelenaya/06.webp",
      "/images/products/futbolka-zikr-zelenaya/07.webp"
    ],
    "is_new": false,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 30
  },
  {
    "slug": "kamis",
    "name": "Камис",
    "category": "umrah",
    "price": 50,
    "old_price": null,
    "description": "Камис ZIKR — для лета, Умры и Хаджа.",
    "details": [
      "Сезон: лето"
    ],
    "size_chart": "",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL",
      "5XL"
    ],
    "colors": [
      {
        "name": "Бежевый",
        "hex": "#D3C6B1"
      }
    ],
    "images": [
      "/images/products/kamis/01.webp",
      "/images/products/kamis/02.webp",
      "/images/products/kamis/03.webp",
      "/images/products/kamis/04.webp",
      "/images/products/kamis/05.webp",
      "/images/products/kamis/06.webp",
      "/images/products/kamis/07.webp",
      "/images/products/kamis/08.webp",
      "/images/products/kamis/09.webp",
      "/images/products/kamis/10.webp",
      "/images/products/kamis/11.webp",
      "/images/products/kamis/12.webp",
      "/images/products/kamis/13.webp"
    ],
    "is_new": true,
    "is_featured": true,
    "in_stock": true,
    "sort_order": 31
  },
  {
    "slug": "dvoyka-len-white",
    "name": "Двойка лен White",
    "category": "casual",
    "price": 60,
    "old_price": null,
    "description": "Льняная двойка ZIKR: рубашка и брюки.",
    "details": [],
    "size_chart": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "2XL",
      "3XL"
    ],
    "colors": [
      {
        "name": "Белый",
        "hex": "#F4F3EF"
      }
    ],
    "images": [
      "/images/products/dvoyka-len-white/01.webp",
      "/images/products/dvoyka-len-white/02.webp",
      "/images/products/dvoyka-len-white/03.webp",
      "/images/products/dvoyka-len-white/04.webp",
      "/images/products/dvoyka-len-white/05.webp"
    ],
    "is_new": true,
    "is_featured": true,
    "in_stock": true,
    "sort_order": 32
  },
  {
    "slug": "muslinovyy-ihram-zikr",
    "name": "Муслиновый Ихрам ZIKR",
    "category": "umrah",
    "price": 55,
    "old_price": null,
    "description": "Муслиновый ихрам ZIKR — лёгкий и комфортный комплект для совершения Умры и Хаджа. Изготовлен из муслиновой ткани, которая отличается мягкостью и лёгкостью, обеспечивая комфорт во время длительного использования. Благодаря стандартному размеру ткань удобно располагается на теле и позволяет комфортно совершать необходимые движения во время поклонения. ZIKR — подготовлен с заботой о вашем комфорте во время поклонения.",
    "details": [
      "Материал: муслин",
      "Размер: стандартный — 110 × 220 см",
      "Производство: Турция",
      "Назначение: для Умры и Хаджа",
      "Комплектация: ихрам",
      "Ткань: лёгкая, мягкая и приятная к телу"
    ],
    "size_chart": "",
    "sizes": [],
    "colors": [
      {
        "name": "Белый",
        "hex": "#F4F3EF"
      }
    ],
    "images": [
      "/images/products/muslinovyy-ihram-zikr/01.webp",
      "/images/products/muslinovyy-ihram-zikr/02.webp",
      "/images/products/muslinovyy-ihram-zikr/03.webp"
    ],
    "is_new": true,
    "is_featured": false,
    "in_stock": true,
    "sort_order": 33
  }
]

export const catalogProducts: Product[] = seeds.map((s, i) => ({
  ...s,
  id: `p-${i + 1}`,
  // Чем выше товар был в списке Tilda, тем «новее» — для сортировки «Сначала новые»
  created_at: new Date(Date.UTC(2026, 8, 30) - (seeds.length - i) * 86_400_000).toISOString(),
}))
