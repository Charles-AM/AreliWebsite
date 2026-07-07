# Areli Jewellery — Image Upload Guide

Upload images to GitHub under `public/images/`. The site picks them up automatically when filenames match.

---

## Logo (top left)

| Folder | Filename |
|--------|----------|
| `logo/` | `logo.png` |

**Path:** `public/images/logo/logo.png`  
Recommended: PNG with transparent background, about **200×60px**.

---

## Collections (scrollable product rows)

Each product needs **two things**:
1. **Photo** — upload to the folder on GitHub
2. **Details** — edit `js/products.js` with name, description, and price

Rows scroll horizontally — add as many products as you have in stock (no limit).

### Example — add a new necklace

**Step 1:** Upload `pearl-layer-necklace.jpg` to `public/images/collections/necklaces/`

**Step 2:** Open `js/products.js` and add inside the Necklaces `products` list:

```js
product('pearl-layer', 'necklaces', 'pearl-layer-necklace.jpg', FALLBACKS.necklace,
  'Pearl Layer Necklace', 120, 'Waterproof layered chain with pearl detail'),
```

**Step 3:** Commit both changes on GitHub. Wait 1–2 min, refresh the site.

### Image folders

| Folder on GitHub | Category |
|------------------|----------|
| `collections/necklaces/` | Necklaces |
| `collections/earrings-rings/` | Earrings & Rings |
| `collections/bracelets-bangles/` | Bracelets & Bangles |
| `collections/perfume/` | Perfume |
| `collections/crochet/` | Crochet Items |

You can use **any filename** — just make sure it matches the filename in `js/products.js`.

To remove sold-out items, delete their `product()` line from `js/products.js` (and optionally delete the image).

---

## About page — 2 model photos

Upload to `public/images/about/`:

| Filename | Section |
|----------|---------|
| `about-story.jpg` | **Jewelry for Real Life** — large image on the left |
| `model-2.jpg` | **Confidence, Every Day** — image on the right |

Recommended: portrait photos, about **800×1000px**.

## Other site images

| Folder | Filenames |
|--------|-----------|
| `hero/` | `hero-main.jpg` |
| `lifestyle/` | `work.jpg`, `gym.jpg`, `night-out.jpg`, `brunch.jpg`, `casual.jpg`, `travel.jpg` |

---

## How to upload on GitHub

1. Go to **https://github.com/Charles-AM/AreliWebsite**
2. Open the folder (e.g. `public/images/collections/necklaces`)
3. **Add file** → **Upload files**
4. Use **exact filenames** from the tables above
5. **Commit changes**
6. Wait 1–2 minutes, then refresh your Netlify site

## Tips

- All collection images show at the **same compact size** in scrollable rows
- Use square or portrait photos (~800×800px or 800×1000px)
- Keep files under 500KB when possible
- Use lowercase filenames
