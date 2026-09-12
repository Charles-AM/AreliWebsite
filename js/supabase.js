import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://zxddsciwktxfdpydarzc.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_sZljF2UQDOYHxR2siiUuwg_SzwYG8-Y';
export const ADMIN_EMAIL = 'cjmedicare15@gmail.com';
export const PRODUCT_IMAGE_BUCKET = 'product-images';
export const CLIENT_CAM_MEDIA_BUCKET = 'client-cam-media';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function isAdminUser(user) {
  return user?.email?.toLowerCase() === ADMIN_EMAIL;
}

export function mapCatalogProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price),
    image: row.image_url,
    fallback: '',
    categoryId: row.category_slug,
  };
}

export async function fetchPublishedCatalog() {
  const [categoryResult, productResult] = await Promise.all([
    supabase
      .from('categories')
      .select('slug, name, display_order')
      .eq('active', true)
      .order('display_order')
      .order('name'),
    supabase
      .from('products')
      .select('id, category_slug, name, description, price, image_url, display_order')
      .eq('active', true)
      .order('display_order')
      .order('created_at', { ascending: false }),
  ]);

  if (categoryResult.error) throw categoryResult.error;
  if (productResult.error) throw productResult.error;

  return {
    categories: categoryResult.data || [],
    products: (productResult.data || []).map(mapCatalogProduct),
  };
}

export async function fetchPublishedClientCam() {
  const { data, error } = await supabase
    .from('client_cam_media')
    .select('id, media_type, media_url, display_order')
    .eq('active', true)
    .order('display_order')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => item.media_type === 'video'
    ? { id: item.id, type: 'video', src: item.media_url }
    : { id: item.id, type: 'image', image: item.media_url });
}
