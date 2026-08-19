/*// src/mocks/mockProducts.ts
import { Product } from '../types/schema';

export const mockProducts: Product[] = [
  // --- TEKNOLOJİ KATEGORİSİ ---
  {
    id: '1',
    product_name: 'MX Master 3S Kablosuz Mouse',
    product_description: 'Ergonomik tasarım, sessiz tıklama özelliği ve 8K DPI sensör ile çalışma verimliliğinizi en üst seviyeye çıkarın.',
    product_avr_price: 3450.00,
    product_total_quantity: 45,
    product_is_active: true,
    isFavorite: false,
    images: [
      { id: 'img-1-1', product_id: '1', images: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800' },
      { id: 'img-1-2', product_id: '1', images: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800' },
    ],
    categories: [
      { id: 'cat-elec', category_name: 'Elektronik', category_is_active: true },
      { id: 'cat-acc', category_name: 'Bilgisayar Aksesuarları', category_is_active: true },
    ],
    comments: [
      { id: 'c-1', product_id: '1', stars: 5, comment: 'Harika bir mouse, elim hiç yorulmuyor.' },
      { id: 'c-2', product_id: '1', stars: 4, comment: 'Şarjı çok uzun gidiyor tavsiye ederim.' },
    ],
    variations: [
      {
        id: 'var-1-1',
        product_id: '1',
        var_name: 'Renk',
        options: [
          { id: 'opt-1-1-1', var_id: 'var-1-1', var_option_value: 'Graphite' },
          { id: 'opt-1-1-2', var_id: 'var-1-1', var_option_value: 'Pale Grey' },
        ],
      },
    ],
    variants: [
      { id: 'pv-1-1', product_id: '1', var_opt_id: 'opt-1-1-1', var_stock: 25, var_price: 3450.00 }, // Graphite fiyatı
      { id: 'pv-1-2', product_id: '1', var_opt_id: 'opt-1-1-2', var_stock: 20, var_price: 3600.00 }, // Pale Grey daha pahalı
    ],
  },
  {
    id: '2',
    product_name: 'GaNPrime 65W Şarj Cihazı',
    product_description: 'Hızlı şarj özelliği ve uyumlu cihazlar için optimal güç yönetimi sunar.',
    product_avr_price: 1250.00,
    product_total_quantity: 100,
    product_is_active: true,
    isFavorite: true,
    images: [
      { id: 'img-2-1', product_id: '2', images: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800' },
    ],
    categories: [
      { id: 'cat-elec', category_name: 'Elektronik', category_is_active: true },
    ],
    comments: [
      { id: 'c-3', product_id: '2', stars: 5, comment: 'Isınma yapmıyor, telefonumu çok hızlı doldurdu.' },
    ],
    variations: [],
    variants: [],
  },

  // --- GİYİM / AYAKKABI KATEGORİSİ ---
  {
    id: '3',
    product_name: 'Klasik Beyaz Sneaker',
    product_description: 'Günlük kullanıma uygun, rahat tabanlı, hakiki deri beyaz erkek ayakkabı.',
    product_avr_price: 2199.99,
    product_total_quantity: 60,
    product_is_active: true,
    isFavorite: false,
    images: [
      { id: 'img-3-1', product_id: '3', images: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800' },
      { id: 'img-3-2', product_id: '3', images: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800' },
    ],
    categories: [
      { id: 'cat-giyim', category_name: 'Giyim & Ayakkabı', category_is_active: true },
      { id: 'cat-ayak', category_name: 'Erkek Ayakkabı', category_is_active: true },
    ],
    comments: [
      { id: 'c-4', product_id: '3', stars: 5, comment: 'Çok rahat ve şık duruyor.' },
      { id: 'c-5', product_id: '3', stars: 3, comment: 'Kalıbı biraz dar, bir numara büyük alınmalı.' },
    ],
    variations: [
      {
        id: 'var-3-1',
        product_id: '3',
        var_name: 'Numara',
        options: [
          { id: 'opt-3-1-1', var_id: 'var-3-1', var_option_value: '40' },
          { id: 'opt-3-1-2', var_id: 'var-3-1', var_option_value: '41' },
          { id: 'opt-3-1-3', var_id: 'var-3-1', var_option_value: '42' },
          { id: 'opt-3-1-4', var_id: 'var-3-1', var_option_value: '43' },
        ],
      },
    ],
    variants: [
      { id: 'pv-3-1', product_id: '3', var_opt_id: 'opt-3-1-1', var_stock: 15, var_price: 2199.99 },
      { id: 'pv-3-2', product_id: '3', var_opt_id: 'opt-3-1-2', var_stock: 20, var_price: 2199.99 },
      { id: 'pv-3-3', product_id: '3', var_opt_id: 'opt-3-1-3', var_stock: 0, var_price: 2199.99 }, // Tükendi
      { id: 'pv-3-4', product_id: '3', var_opt_id: 'opt-3-1-4', var_stock: 25, var_price: 2250.00 }, // Büyük numara farkı
    ],
  },

  // --- SÜPERMARKET / TEMİZLİK KATEGORİSİ ---
  {
    id: '4',
    product_name: 'Ultra Yoğun Çamaşır Suyu 810 ml',
    product_description: 'Maksimum hijyen sağlayan, dağ esintisi kokulu yoğun kıvamlı çamaşır suyu.',
    product_avr_price: 45.50,
    product_total_quantity: 500,
    product_is_active: true,
    isFavorite: false,
    images: [
      { id: 'img-4-1', product_id: '4', images: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.1rLtuX8Vis0KlB2NJcuKxgHaHa%3Fpid%3DApi&f=1&ipt=97f74d55a4e9a4b94c7eca210f8bf4c474af819d08ad52660639c1547f9c4b41&ipo=images' },
    ],
    categories: [
      { id: 'cat-sup', category_name: 'Süpermarket', category_is_active: true },
      { id: 'cat-temiz', category_name: 'Ev Temizlik Ürünleri', category_is_active: true },
    ],
    comments: [
      { id: 'c-6', product_id: '4', stars: 5, comment: 'Her zaman kullandığım ürün, kargolama hızlıydı.' },
    ],
    variations: [
       {
        id: 'var-4-1',
        product_id: '4',
        var_name: 'Paket Tipi',
        options: [
          { id: 'opt-4-1-1', var_id: 'var-4-1', var_option_value: 'Tekli Uygun Paket' },
          { id: 'opt-4-1-2', var_id: 'var-4-1', var_option_value: 'İkili Avantaj Paketi' },
        ],
      },
    ],
    variants: [
      { id: 'pv-4-1', product_id: '4', var_opt_id: 'opt-4-1-1', var_stock: 300, var_price: 45.50 },
      { id: 'pv-4-2', product_id: '4', var_opt_id: 'opt-4-1-2', var_stock: 200, var_price: 85.00 }, // İkili paket fiyatı
    ],
  },

  // --- EV & YAŞAM KATEGORİSİ ---
  {
    id: '5',
    product_name: 'Pamuklu Çift Kişilik Nevresim Takımı',
    product_description: '%100 pamuktan üretilmiş, yumuşak dokulu, modern desenli nevresim takımı. (Nevresim + 2 Yastık Kılıfı)',
    product_avr_price: 899.90,
    product_total_quantity: 30,
    product_is_active: true,
    isFavorite: true,
    images: [
      { id: 'img-5-1', product_id: '5', images: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.karaca.com%2Fimage%2Fcdndata%2F1%2F202212%2F200.22.05.0021%2F8680214323991-7.jpg&f=1&nofb=1&ipt=2963152766728e342f35cfe427e6152e54e0cf3e1de91b898e4934a10245be51' },
      { id: 'img-5-2', product_id: '5', images: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800' },
    ],
    categories: [
      { id: 'cat-ev', category_name: 'Ev & Yaşam', category_is_active: true },
      { id: 'cat-tekstil', category_name: 'Ev Tekstili', category_is_active: true },
    ],
    comments: [
      { id: 'c-7', product_id: '5', stars: 4, comment: 'Renkleri resimdeki gibi canlı, kumaşı güzel.' },
    ],
    variations: [
      {
        id: 'var-5-1',
        product_id: '5',
        var_name: 'Desen',
        options: [
          { id: 'opt-5-1-1', var_id: 'var-5-1', var_option_value: 'Geometrik Gri' },
          { id: 'opt-5-1-2', var_id: 'var-5-1', var_option_value: 'Çiçekli Mavi' },
          { id: 'opt-5-1-3', var_id: 'var-5-1', var_option_value: 'Düz Soft Pembe' },
        ],
      },
    ],
    variants: [
      { id: 'pv-5-1', product_id: '5', var_opt_id: 'opt-5-1-1', var_stock: 10, var_price: 899.90 },
      { id: 'pv-5-2', product_id: '5', var_opt_id: 'opt-5-1-2', var_stock: 12, var_price: 899.90 },
      { id: 'pv-5-3', product_id: '5', var_opt_id: 'opt-5-1-3', var_stock: 8, var_price: 920.00 }, // Farklı desen fiyatı
    ],
  },
];

export default mockProducts;*/