# PWA Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Service Worker Not Registering in Production

**Symptoms:**

- Service worker doesn't appear in DevTools > Application > Service Workers
- No console logs about service worker registration
- Install prompt doesn't appear

**Solutions:**

1. **Check if service worker file is accessible:**
   - Visit: `https://yourdomain.com/sw.js`
   - Should return JavaScript code, not 404
   - Check Network tab in DevTools

2. **Verify HTTPS:**
   - Service workers require HTTPS (except localhost)
   - Ensure your production site uses HTTPS

3. **Check browser console:**
   - Look for service worker registration errors
   - Check for CORS or network errors

4. **Verify production environment:**
   - The service worker only registers in production
   - Check `process.env.NODE_ENV === "production"`
   - Or verify hostname is not localhost

### Issue 2: Manifest Not Loading

**Symptoms:**

- Manifest doesn't appear in DevTools > Application > Manifest
- Icons not showing in install prompt
- App not installable

**Solutions:**

1. **Check manifest accessibility:**
   - Visit: `https://yourdomain.com/manifest.json`
   - Should return valid JSON
   - Validate JSON syntax

2. **Verify icon paths:**
   - Icons must be accessible at the paths specified
   - Check that icon files exist in `/public` folder
   - Ensure paths start with `/` (absolute paths)

3. **Check manifest structure:**
   - Must include: name, short_name, start_url, display, icons
   - Icons must include at least 192x192 and 512x512 sizes

### Issue 3: Icons Not Showing

**Symptoms:**

- Install prompt shows default icon
- Icons missing in manifest validation

**Solutions:**

1. **Verify icon files exist:**
   - Check `/public/icon-192x192.png` exists
   - Check `/public/icon-512x512.png` exists
   - Ensure files are valid PNG images

2. **Check icon paths in manifest:**
   - Paths should be absolute: `/icon-192x192.png`
   - Not relative: `icon-192x192.png` or `icons/icon-192x192.png`

3. **Verify icon sizes:**
   - Icons must match declared sizes
   - Use image editor to verify dimensions

### Issue 4: Install Prompt Not Appearing

**Symptoms:**

- No install button in browser
- beforeinstallprompt event not firing

**Solutions:**

1. **Check PWA criteria:**
   - ✅ HTTPS (or localhost)
   - ✅ Valid manifest.json
   - ✅ Service worker registered
   - ✅ Icons provided (192x192 and 512x512)
   - ✅ start_url is accessible

2. **User engagement:**
   - Some browsers require user interaction
   - User must visit site multiple times
   - Wait a few seconds after page load

3. **Browser support:**
   - Chrome/Edge: Full support
   - Safari iOS: Limited support (Add to Home Screen)
   - Firefox: Limited support

### Issue 5: Service Worker Caching Issues

**Symptoms:**

- Old content showing after updates
- Changes not reflecting

**Solutions:**

1. **Clear service worker:**
   - DevTools > Application > Service Workers > Unregister
   - Clear cache: DevTools > Application > Storage > Clear site data

2. **Update cache version:**
   - Change `CACHE_NAME` in `sw.js`
   - This forces cache refresh

3. **Hard reload:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

## Debugging Steps

### Step 1: Check Service Worker Registration

Open browser console and look for:

```
[Service Worker] Registration successful: https://yourdomain.com/
```

If you see errors, check:

- Network tab for failed requests to `/sw.js`
- Console for JavaScript errors
- Application tab > Service Workers for registration status

### Step 2: Verify Manifest

1. Open DevTools > Application > Manifest
2. Check for errors (red text)
3. Verify all required fields present
4. Check icon paths are correct

### Step 3: Test Installability

1. Open DevTools > Application > Manifest
2. Look for "Add to homescreen" section
3. Check installability criteria
4. Use Chrome's "Add to homescreen" button

### Step 4: Check Network Requests

1. Open DevTools > Network tab
2. Filter by "sw.js" and "manifest.json"
3. Verify both return 200 status
4. Check Content-Type headers:
   - `sw.js`: `application/javascript`
   - `manifest.json`: `application/manifest+json`

## Production Checklist

Before deploying, verify:

- [ ] Service worker file exists at `/public/sw.js`
- [ ] Manifest file exists at `/public/manifest.json`
- [ ] Icon files exist (192x192 and 512x512 minimum)
- [ ] All icon paths in manifest are absolute (`/icon-192x192.png`)
- [ ] Site is served over HTTPS
- [ ] `next.config.ts` has proper headers for sw.js and manifest.json
- [ ] Service worker registration code is in layout.tsx
- [ ] Build completes without errors: `npm run build`
- [ ] Test locally with production build: `npm start`

## Testing Commands

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Check service worker
curl http://localhost:3000/sw.js

# Check manifest
curl http://localhost:3000/manifest.json
```

## Browser DevTools Checks

### Chrome/Edge

1. F12 > Application tab
2. Service Workers: Check registration
3. Manifest: Verify structure
4. Storage > Cache Storage: Check cached files

### Firefox

1. F12 > Application tab
2. Service Workers: Check registration
3. Manifest: Verify structure

### Safari

1. Develop > Show Web Inspector
2. Storage tab > Service Workers
3. Note: Limited PWA support on iOS

## Common Error Messages

### "Failed to register a ServiceWorker"

- **Cause**: Service worker file not accessible or invalid
- **Fix**: Check file exists, verify HTTPS, check file syntax

### "Manifest: property 'start_url' ignored"

- **Cause**: start_url not accessible or invalid
- **Fix**: Ensure start_url is a valid path on your site

### "No matching service worker detected"

- **Cause**: Service worker not registered or scope mismatch
- **Fix**: Check registration code, verify scope matches

### "Site cannot be installed: no matching service worker detected"

- **Cause**: Service worker not active
- **Fix**: Check service worker registration, verify it's not blocked

## Still Not Working?

1. **Check Next.js build output:**
   - Ensure `sw.js` is copied to `.next/static/` or served from `/public`
   - Verify no build errors

2. **Check server configuration:**
   - Ensure static files from `/public` are served
   - Check for server-side routing blocking `/sw.js`

3. **Test in incognito mode:**
   - Rules out extension interference
   - Clears any cached service workers

4. **Check browser compatibility:**
   - Test in Chrome/Edge (best support)
   - Verify mobile browser support

5. **Review console logs:**
   - Look for any JavaScript errors
   - Check service worker registration logs
   - Verify manifest loading

## Getting Help

If issues persist:

1. Check browser console for specific errors
2. Verify all files are accessible via direct URLs
3. Test with Chrome DevTools > Application > Manifest > "Add to homescreen"
4. Check Next.js documentation for static file serving
5. Verify deployment platform (Vercel, Netlify, etc.) supports service workers
