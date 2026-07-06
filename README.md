# Areli Jewellery

A modern, luxurious jewelry brand website for **Areli Jewellery** — based in Ghana.

> *Low-maintenance luxury where style meets practicality.*

## Features

- **Home** — Hero, new arrivals carousel, why Areli, lifestyle grid, categories, bestsellers, testimonials
- **About** — Brand story with highlighted keywords
- **Contact** — Contact form, payment details (MTN Mobile Money), delivery charge table
- Fully responsive with mobile bottom navigation
- Shopping cart slide-out panel
- Scroll animations, hover effects, sticky shrinking nav
- Lazy-loaded images with local asset fallback

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Adding Your Images

Place your images in `public/images/`:

| Folder | Files |
|--------|-------|
| `hero/` | `hero-main.jpg` |
| `products/` | `product-1.jpg` … `product-8.jpg` |
| `lifestyle/` | `work.jpg`, `gym.jpg`, `night-out.jpg` |
| `about/` | `about-story.jpg` |

See `public/images/README.md` for full details.

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Netlify

### Option 1: Connect GitHub (recommended)

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** and select the `AreliWebsite` repository
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**

Your site will be live at a `*.netlify.app` URL within a few minutes. Each push to the connected branch triggers a new deploy.

### Option 2: Manual drag-and-drop

```bash
npm install
npm run build
```

Then drag the `dist` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).


