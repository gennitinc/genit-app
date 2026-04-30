# PWA Setup Guide

Your Gennit AI app has been configured as a Progressive Web App (PWA). This allows users to install it on their devices and use it offline.

## What's Been Configured

### 1. Manifest File (`/public/manifest.json`)

- App name, description, and theme colors
- Display mode (standalone)
- App icons configuration
- Shortcuts for quick access to Image and Video creation

### 2. Service Worker (`/public/sw.js`)

- Caches essential assets for offline use
- Implements cache-first strategy for static assets
- Network-first strategy for API calls
- Automatic cache cleanup on updates

### 3. PWA Components

- **ServiceWorkerRegister**: Automatically registers the service worker in production
- **PWAInstaller**: Shows install prompt when available

### 4. Layout Updates

- Added manifest link and PWA meta tags
- Integrated service worker registration
- Added PWA installer component

## Required Icons

To complete the PWA setup, you need to add these icon files to `/public`:

1. **icon-192x192.png** (192x192 pixels)
2. **icon-512x512.png** (512x512 pixels)
3. **apple-touch-icon.png** (180x180 pixels)

### Generating Icons

You can use any of these tools:

- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon Generator](https://www.favicon-generator.org/)

Or use ImageMagick:

```bash
# Convert your logo to required sizes
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 512x512 icon-512x512.png
convert logo.png -resize 180x180 apple-touch-icon.png
```

## Testing the PWA

### Development

1. Build the app: `npm run build`
2. Start production server: `npm start`
3. Open in browser and check:
   - Service worker registration in DevTools > Application > Service Workers
   - Manifest in DevTools > Application > Manifest
   - Install prompt (may appear automatically)

### Production

1. Deploy to production
2. Test on mobile devices:
   - iOS Safari: Share > Add to Home Screen
   - Android Chrome: Install prompt or Menu > Install App
   - Desktop Chrome: Install icon in address bar

## Features

### Offline Support

- Static assets are cached
- App shell works offline
- API calls require network connection

### Install Prompt

- Automatically shows when browser supports it
- Can be dismissed (won't show again for 7 days)
- Only appears in production builds

### App Shortcuts

Users can quickly access:

- Create Image (`/inspire/create?mode=ai-image-gen`)
- Create Video (`/inspire/create?mode=ai-video-gen`)

## Customization

### Update Manifest

Edit `/public/manifest.json` to customize:

- App name and description
- Theme colors
- Icons
- Shortcuts

### Update Service Worker

Edit `/public/sw.js` to customize:

- Cache strategy
- Assets to precache
- Offline fallback pages

## Troubleshooting

### Service Worker Not Registering

- Ensure you're running a production build (`npm run build && npm start`)
- Check browser console for errors
- Verify `/sw.js` is accessible

### Install Prompt Not Showing

- Only works in production builds
- Requires HTTPS (or localhost)
- Browser must support PWA installation
- User must meet engagement criteria

### Icons Not Showing

- Verify icon files exist in `/public`
- Check file names match manifest.json
- Ensure icons are valid PNG files

## Next Steps

1. **Add Icons**: Create and add the required icon files
2. **Test**: Build and test the PWA functionality
3. **Customize**: Update manifest and service worker as needed
4. **Deploy**: Deploy to production and test on real devices

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev: PWA](https://web.dev/progressive-web-apps/)
- [Next.js PWA Guide](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
