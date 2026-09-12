# Areli Jewellery media guide

## Products and Client Cam

Manage products, categories, prices, descriptions, visibility, and Client Cam uploads from the private admin page:

`https://arelijewellery.netlify.app/areli-atelier-7k3p.html`

Changes made there are stored in Supabase and appear on the storefront without editing GitHub or redeploying the site. Product and Client Cam photos are resized and converted to WebP before upload. Client Cam also accepts MP4, WebM, and MOV videos.

Client Cam videos play silently in a loop while visible. Visitors are not shown playback, volume, fullscreen, or speed controls.

## Fixed site photography

Only the fixed design photography is managed in this repository:

| File | Use |
|------|-----|
| `hero/hero-main.jpg` | Homepage hero |
| `about/charis-founder.jpg` | About page founder portrait |
| `about/about-story.jpg` | About page, Jewelry for Real Life |

Keep replacements under 500 KB when practical and preserve the existing filenames.

## Legacy Client Cam videos

Files under `public/videos/client-cam/` are still referenced by imported Client Cam records. Do not delete them until those records have been replaced through the admin page.
