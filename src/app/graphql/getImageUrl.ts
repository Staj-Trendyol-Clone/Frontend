// src/graphql/getImageUrl.ts

// 1. AWS S3 Kovasının (Bucket) Tam Adresi
const AWS_S3_BASE_URL = 'https://images-for-trendyol.s3.eu-central-1.amazonaws.com/';

// 2. Kırık / Boş görsel durumunda gösterilecek varsayılan resim
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800';

export const getImageUrl = (imagePath?: string): string => {
  // 1. Görsel yolu boş veya tanımsızsa varsayılan resmi döndür
  if (!imagePath || !imagePath.trim()) {
    return FALLBACK_IMAGE;
  }

  let cleanPath = imagePath.trim();

  // 2. Eğer Django veritabanından zaten tam URL (http/https) geliyorsa
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    const secureUrl = cleanPath.replace('http://', 'https://');
    return encodeURI(secureUrl);
  }

  // 3. Baştaki fazla '/' işaretini temizle (çift // oluşmaması için)
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }

  // 4. AWS S3 Adresi ile bağıl yolu birleştir
  const fullUrl = `${AWS_S3_BASE_URL}${cleanPath}`;

  // 5. 'İ' gibi Türkçe/özel karakterleri %C4%B0 formatına dönüştür
  return encodeURI(fullUrl);
};