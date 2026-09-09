import {
  ADMIN_EMAIL,
  PRODUCT_IMAGE_BUCKET,
  isAdminUser,
  supabase,
} from './supabase.js';

const authView = document.getElementById('auth-view');
const dashboardView = document.getElementById('dashboard-view');
const signOutButton = document.getElementById('sign-out');
const notice = document.getElementById('admin-notice');
const categoryList = document.getElementById('category-list');
const productList = document.getElementById('product-list');
const productEmpty = document.getElementById('product-empty');
const productDialog = document.getElementById('product-dialog');
const categoryDialog = document.getElementById('category-dialog');

let categories = [];
let products = [];
let activeCategory = 'all';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function showNotice(message, isError = false) {
  notice.textContent = message;
  notice.classList.toggle('error', isError);
  notice.hidden = false;
  window.clearTimeout(showNotice.timeout);
  showNotice.timeout = window.setTimeout(() => {
    notice.hidden = true;
  }, 6000);
}

function setBusy(button, busy, busyText) {
  if (!button) return;
  if (busy) {
    button.dataset.originalText = button.textContent;
    button.textContent = busyText;
  } else if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
  }
  button.disabled = busy;
}

async function requireAdmin(session) {
  const user = session?.user;
  if (!user) return false;
  if (!isAdminUser(user)) {
    await supabase.auth.signOut();
    throw new Error(`Access is limited to ${ADMIN_EMAIL}.`);
  }
  return true;
}

async function loadCatalog() {
  const [categoryResult, productResult] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .order('display_order')
      .order('name'),
    supabase
      .from('products')
      .select('*')
      .order('display_order')
      .order('created_at', { ascending: false }),
  ]);

  if (categoryResult.error) throw categoryResult.error;
  if (productResult.error) throw productResult.error;
  categories = categoryResult.data || [];
  products = productResult.data || [];

  if (activeCategory !== 'all' && !categories.some((item) => item.slug === activeCategory)) {
    activeCategory = 'all';
  }

  renderDashboard();
}

function renderDashboard() {
  renderCategories();
  renderProducts();
  fillCategorySelect();
}

function renderCategories() {
  const allCount = products.length;
  const rows = [
    `<div class="category-row">
      <button class="category-filter${activeCategory === 'all' ? ' active' : ''}" type="button" data-category="all">
        All products (${allCount})
      </button>
    </div>`,
    ...categories.map((category) => {
      const count = products.filter((product) => product.category_slug === category.slug).length;
      return `<div class="category-row">
        <button class="category-filter${activeCategory === category.slug ? ' active' : ''}" type="button" data-category="${escapeHtml(category.slug)}">
          ${escapeHtml(category.name)} (${count})
        </button>
        <span class="category-actions">
          <button type="button" data-edit-category="${escapeHtml(category.slug)}">Edit</button>
          <button type="button" data-delete-category="${escapeHtml(category.slug)}">Remove</button>
        </span>
      </div>`;
    }),
  ];
  categoryList.innerHTML = rows.join('');
}

function renderProducts() {
  const visibleProducts = activeCategory === 'all'
    ? products
    : products.filter((product) => product.category_slug === activeCategory);
  const activeName = activeCategory === 'all'
    ? 'All products'
    : categories.find((item) => item.slug === activeCategory)?.name || 'Products';

  document.getElementById('active-category-name').textContent = activeName;
  document.getElementById('product-count').textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'}`;
  productEmpty.hidden = visibleProducts.length > 0;
  productList.hidden = visibleProducts.length === 0;
  productList.innerHTML = visibleProducts.map((product) => `
    <article class="admin-product-card">
      <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" loading="lazy" />
      <div class="admin-product-info">
        <h3>${escapeHtml(product.name)}</h3>
        <p>GHS ${Number(product.price).toFixed(2)}${product.active ? '' : ' · Hidden'}</p>
        <div class="admin-product-actions">
          <button type="button" data-edit-product="${escapeHtml(product.id)}">Edit</button>
          <button class="delete-action" type="button" data-delete-product="${escapeHtml(product.id)}">Remove</button>
        </div>
      </div>
    </article>
  `).join('');
}

function fillCategorySelect() {
  const select = document.getElementById('product-category');
  const selected = select.value;
  select.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category.slug)}">${escapeHtml(category.name)}${category.active ? '' : ' (hidden)'}</option>`)
    .join('');
  if (categories.some((category) => category.slug === selected)) select.value = selected;
}

function openNewProduct() {
  const form = document.getElementById('product-form');
  form.reset();
  document.getElementById('product-id').value = '';
  document.getElementById('product-image-path').value = '';
  document.getElementById('product-current-image').value = '';
  document.getElementById('product-dialog-title').textContent = 'Add product';
  document.getElementById('save-product').textContent = 'Publish product';
  document.getElementById('product-active').checked = true;
  fillCategorySelect();
  if (activeCategory !== 'all') document.getElementById('product-category').value = activeCategory;
  productDialog.showModal();
}

function openEditProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-image-path').value = product.image_path || '';
  document.getElementById('product-current-image').value = product.image_url;
  document.getElementById('product-category').value = product.category_slug;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = Number(product.price);
  document.getElementById('product-order').value = product.display_order;
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-image').value = '';
  document.getElementById('product-active').checked = product.active;
  document.getElementById('product-dialog-title').textContent = 'Edit product';
  document.getElementById('save-product').textContent = 'Save changes';
  productDialog.showModal();
}

function openNewCategory() {
  document.getElementById('category-form').reset();
  document.getElementById('category-original-slug').value = '';
  document.getElementById('category-dialog-title').textContent = 'Add category';
  document.getElementById('category-order').value = categories.length;
  document.getElementById('category-active').checked = true;
  categoryDialog.showModal();
}

function openEditCategory(slug) {
  const category = categories.find((item) => item.slug === slug);
  if (!category) return;
  document.getElementById('category-original-slug').value = category.slug;
  document.getElementById('category-name').value = category.name;
  document.getElementById('category-order').value = category.display_order;
  document.getElementById('category-active').checked = category.active;
  document.getElementById('category-dialog-title').textContent = 'Edit category';
  categoryDialog.showModal();
}

async function prepareImage(file) {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false });
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('The image could not be prepared.')),
      'image/webp',
      0.86,
    );
  });
}

async function uploadProductImage(file, categorySlug) {
  if (!file.type.startsWith('image/')) throw new Error('Choose a valid product image.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Choose an image smaller than 20 MB.');
  const prepared = await prepareImage(file);
  const path = `${categorySlug}/${crypto.randomUUID()}.webp`;
  const result = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, prepared, { contentType: 'image/webp', upsert: false });
  if (result.error) throw result.error;
  const publicUrl = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  return { path, publicUrl };
}

document.getElementById('auth-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.submitter;
  const password = document.getElementById('auth-password').value;
  setBusy(button, true, 'Signing in');
  try {
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    if (error) showNotice(error.message, true);
  } catch (error) {
    showNotice(error.message || 'Sign in could not be completed.', true);
  } finally {
    setBusy(button, false);
  }
});

document.getElementById('create-account').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const password = document.getElementById('auth-password').value;
  if (password.length < 8) {
    showNotice('Enter a password with at least eight characters first.', true);
    return;
  }
  setBusy(button, true, 'Creating account');
  const { data, error } = await supabase.auth.signUp({
    email: ADMIN_EMAIL,
    password,
    options: { emailRedirectTo: `${window.location.origin}/admin.html` },
  });
  setBusy(button, false);
  if (error) {
    showNotice(error.message, true);
  } else if (!data.session) {
    showNotice('Check the administrator email and confirm the new account.');
  }
});

signOutButton.addEventListener('click', () => supabase.auth.signOut());

document.getElementById('new-product').addEventListener('click', openNewProduct);
document.getElementById('new-category').addEventListener('click', openNewCategory);

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => document.getElementById(button.dataset.closeDialog).close());
});

categoryList.addEventListener('click', async (event) => {
  const filter = event.target.closest('[data-category]');
  const edit = event.target.closest('[data-edit-category]');
  const remove = event.target.closest('[data-delete-category]');
  if (filter) {
    activeCategory = filter.dataset.category;
    renderDashboard();
  } else if (edit) {
    openEditCategory(edit.dataset.editCategory);
  } else if (remove) {
    const slug = remove.dataset.deleteCategory;
    const category = categories.find((item) => item.slug === slug);
    if (!category || !window.confirm(`Remove ${category.name}? Categories containing products cannot be removed.`)) return;
    const { error } = await supabase.from('categories').delete().eq('slug', slug);
    if (error) showNotice(error.message, true);
    else {
      showNotice(`${category.name} was removed.`);
      await loadCatalog();
    }
  }
});

productList.addEventListener('click', async (event) => {
  const edit = event.target.closest('[data-edit-product]');
  const remove = event.target.closest('[data-delete-product]');
  if (edit) {
    openEditProduct(edit.dataset.editProduct);
  } else if (remove) {
    const product = products.find((item) => item.id === remove.dataset.deleteProduct);
    if (!product || !window.confirm(`Remove ${product.name} from the shop?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) {
      showNotice(error.message, true);
      return;
    }
    if (product.image_path) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([product.image_path]);
    }
    showNotice(`${product.name} was removed.`);
    await loadCatalog();
  }
});

document.getElementById('category-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.submitter;
  const originalSlug = document.getElementById('category-original-slug').value;
  const name = document.getElementById('category-name').value.trim();
  const slug = slugify(name);
  if (!slug) {
    showNotice('Enter a category name.', true);
    return;
  }

  const payload = {
    slug,
    name,
    display_order: Number(document.getElementById('category-order').value) || 0,
    active: document.getElementById('category-active').checked,
  };
  setBusy(button, true, 'Saving');
  const result = originalSlug
    ? await supabase.from('categories').update(payload).eq('slug', originalSlug)
    : await supabase.from('categories').insert(payload);
  setBusy(button, false);
  if (result.error) {
    showNotice(result.error.message, true);
  } else {
    categoryDialog.close();
    activeCategory = slug;
    showNotice(`${name} is ready.`);
    await loadCatalog();
  }
});

document.getElementById('product-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.submitter;
  const id = document.getElementById('product-id').value;
  const categorySlug = document.getElementById('product-category').value;
  const imageFile = document.getElementById('product-image').files[0];
  const currentImage = document.getElementById('product-current-image').value;
  const currentPath = document.getElementById('product-image-path').value;
  if (!id && !imageFile) {
    showNotice('Choose a product image.', true);
    return;
  }

  setBusy(button, true, imageFile ? 'Preparing image' : 'Saving');
  let uploaded = null;
  try {
    if (imageFile) uploaded = await uploadProductImage(imageFile, categorySlug);
    const payload = {
      category_slug: categorySlug,
      name: document.getElementById('product-name').value.trim(),
      price: Number(document.getElementById('product-price').value),
      description: document.getElementById('product-description').value.trim(),
      display_order: Number(document.getElementById('product-order').value) || 0,
      active: document.getElementById('product-active').checked,
      image_url: uploaded?.publicUrl || currentImage,
      image_path: uploaded?.path || currentPath || null,
      updated_at: new Date().toISOString(),
    };

    const result = id
      ? await supabase.from('products').update(payload).eq('id', id)
      : await supabase.from('products').insert({ id: crypto.randomUUID(), ...payload });
    if (result.error) throw result.error;
    if (uploaded && currentPath) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([currentPath]);
    }
    productDialog.close();
    activeCategory = categorySlug;
    showNotice(id ? 'Product changes are live.' : 'The product is now live.');
    await loadCatalog();
  } catch (error) {
    if (uploaded?.path) await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([uploaded.path]);
    showNotice(error.message || 'The product could not be saved.', true);
  } finally {
    setBusy(button, false);
  }
});

async function handleAuthState(session) {
  try {
    const isAdmin = await requireAdmin(session);
    authView.hidden = isAdmin;
    dashboardView.hidden = !isAdmin;
    signOutButton.hidden = !isAdmin;
    if (isAdmin) await loadCatalog();
  } catch (error) {
    authView.hidden = false;
    dashboardView.hidden = true;
    signOutButton.hidden = true;
    showNotice(error.message, true);
  }
}

supabase.auth.onAuthStateChange((_event, session) => {
  window.setTimeout(() => handleAuthState(session), 0);
});
