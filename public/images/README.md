# Areli Jewellery — Image Assets

Upload your images to GitHub in the folders below. The site uses them automatically when filenames match.

## Site Images

| Folder | Purpose | Filenames |
|--------|---------|-----------|
| `hero/` | Home page hero banner | `hero-main.jpg` |
| `lifestyle/` | Style inspiration grid | `work.jpg`, `gym.jpg`, `night-out.jpg` |
| `about/` | About page image | `about-story.jpg` |

## Collection Product Images

Upload product photos into the matching collection folder:

### Jewelry
| Folder | Filenames |
|--------|-----------|
| `collections/jewelry/` | `jewelry-1.jpg`, `jewelry-2.jpg`, `jewelry-3.jpg` |
| `collections/bracelets/` | `bracelet-1.jpg`, `bracelet-2.jpg`, `bracelet-3.jpg` |
| `collections/necklaces/` | `necklace-1.jpg`, `necklace-2.jpg`, `necklace-3.jpg` |

### Extras
| Folder | Filenames |
|--------|-----------|
| `collections/perfume/` | `perfume-1.jpg`, `perfume-2.jpg`, `perfume-3.jpg` |
| `collections/crochet/` | `crochet-1.jpg`, `crochet-2.jpg`, `crochet-3.jpg` |

## How to upload on GitHub

1. Go to **https://github.com/Charles-AM/AreliWebsite**
2. Navigate to **`public/images/collections/`** → pick a folder (e.g. `jewelry`)
3. Click **Add file** → **Upload files**
4. Drag your images in with the **exact filenames** from the table above
5. Click **Commit changes**
6. Wait 1–2 minutes for Netlify to rebuild

## Full path example

```
public/images/collections/jewelry/jewelry-1.jpg   ✅
public/images/jewelry-1.jpg                       ❌ wrong folder
```

## Tips

- Recommended size: **1200×1500px** for products
- Use `.jpg`, `.png`, or `.webp`
- Keep filenames **lowercase**
- To add more products, upload `jewelry-4.jpg` etc. and update `js/products.js`
