# Troubleshooting Guide - CSS Not Loading

## Problem: Tailwind CSS Not Applied

**Symptoms:**
- Plain unstyled HTML
- No colors (everything black/blue links)
- No spacing or layout
- Buttons appear as plain text links
- No background colors

## Root Cause

**Missing `postcss.config.js` file** - This file is essential for Tailwind CSS to work with Vite.

---

## ✅ SOLUTION - Follow These Steps

### Step 1: Pull Latest Changes

```bash
git pull origin main
```

This will download the `postcss.config.js` file that was just added.

### Step 2: Clean Install

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clean npm cache
npm cache clean --force

# Fresh install
npm install
```

### Step 3: Verify Files Exist

Make sure these files are present in your project root:

- ✅ `postcss.config.js` (just added)
- ✅ `tailwind.config.js`
- ✅ `vite.config.js`
- ✅ `package.json`
- ✅ `src/index.css`

### Step 4: Check File Contents

**postcss.config.js** should contain:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**tailwind.config.js** should have:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

**src/index.css** should start with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**src/main.jsx** should import CSS:
```javascript
import './index.css'
```

### Step 5: Restart Dev Server

```bash
# Stop current server (Ctrl + C)
# Start fresh
npm run dev
```

### Step 6: Hard Refresh Browser

- Chrome/Edge: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Firefox: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- Safari: `Cmd + Option + R`

### Step 7: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

---

## ✅ Verification Checklist

After following the steps above, verify:

- [ ] `postcss.config.js` exists in root directory
- [ ] All dependencies installed (`node_modules` folder exists)
- [ ] Dev server running without errors
- [ ] Browser shows styled page with colors
- [ ] Header has teal/primary color scheme
- [ ] Buttons are styled with rounded corners
- [ ] Background is cream color (#FCFCF9)
- [ ] Search bar is visible and styled

---

## Expected Appearance

### Header
- Background: White
- Border: Light gray
- Logo/Text: Black and teal
- Search bar: White with gray border, rounded
- Admin Panel button: Gray background, rounded

### Footer
- Background: Dark slate (#13343B)
- Text: White/light gray
- Links: Teal on hover

### Buttons
- Primary: Teal background (#21808D)
- Secondary: Light gray background
- Rounded corners (8px)
- Smooth hover effects

### General
- Background: Cream (#FCFCF9)
- Text: Dark slate (#13343B)
- Cards: White with subtle shadows
- Proper spacing and padding

---

## Still Not Working? Additional Checks

### 1. Check Console for Errors

Open browser DevTools (F12) → Console tab

Look for errors like:
- ❌ "Failed to resolve import"
- ❌ "Module not found"
- ❌ CSS loading errors

### 2. Verify Vite is Running

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h to show help
```

### 3. Check Network Tab

In DevTools → Network tab:
- CSS files should load (200 status)
- No 404 errors
- `index.css` should be present

### 4. Inspect Element

Right-click any element → Inspect

In Styles panel, you should see:
- Tailwind utility classes applied
- Custom CSS variables (--primary-500, etc.)
- Proper color values

### 5. Rebuild Project

```bash
# Clean build
rm -rf dist
npm run build

# Preview production build
npm run preview
```

---

## Common Mistakes

### ❌ Wrong: Missing postcss.config.js
**This was your issue!** Without this file, Tailwind CSS is never processed.

### ❌ Wrong: Not importing index.css
Make sure `main.jsx` has:
```javascript
import './index.css'
```

### ❌ Wrong: Wrong Tailwind content paths
`tailwind.config.js` must include:
```javascript
content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"]
```

### ❌ Wrong: Old browser cache
Always hard refresh after changes!

### ❌ Wrong: Missing dependencies
Make sure these are in `package.json` devDependencies:
- tailwindcss
- postcss
- autoprefixer

---

## Environment Setup

### Required Files in Root

```
mitc-business/
├── postcss.config.js       ← CRITICAL (was missing!)
├── tailwind.config.js      ← Required
├── vite.config.js          ← Required
├── package.json            ← Required
├── index.html              ← Required
└── src/
    ├── main.jsx            ← Must import index.css
    └── index.css           ← Must have @tailwind directives
```

### Required Dependencies

```json
"devDependencies": {
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.32",
  "autoprefixer": "^10.4.16",
  "vite": "^5.0.8"
}
```

---

## Manual File Creation (If Needed)

If `postcss.config.js` is still missing after git pull:

1. Create file in root: `postcss.config.js`
2. Add this content:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. Save and restart dev server

---

## Testing Steps

### Quick Test

1. Open http://localhost:3000
2. Check header - should have white background with teal accents
3. Check buttons - should be rounded with colors
4. Check footer - should be dark with white text

### Detailed Test

1. **Header Test**
   - Logo visible
   - Search bar styled with border
   - Admin Panel button has gray background
   - Mobile menu icon visible on small screens

2. **Homepage Test**
   - Hero section with proper spacing
   - Product cards have shadows
   - Buttons are teal/primary color
   - Images load properly

3. **Footer Test**
   - Dark background (#13343B)
   - White/light text
   - Social icons visible
   - Links change color on hover

4. **Responsive Test**
   - Resize browser window
   - Layout adjusts properly
   - Mobile menu works
   - No horizontal scroll

---

## Success Indicators

✅ **Working Correctly When You See:**

1. Colored elements (teal, gray, cream)
2. Rounded corners on buttons and inputs
3. Proper spacing between elements
4. Shadows on cards
5. Smooth hover effects
6. Responsive layout changes
7. Professional, polished appearance

❌ **Still Broken If You See:**

1. Plain black text on white background
2. Blue underlined links (default HTML)
3. No spacing or padding
4. Square corners everywhere
5. No hover effects
6. Ugly default browser styles

---

## Prevention

### Always Keep These Files

**Never delete:**
- `postcss.config.js`
- `tailwind.config.js`
- `vite.config.js`
- `src/index.css`

**Never remove from package.json:**
- tailwindcss
- postcss
- autoprefixer

### Before Committing

Always check:
```bash
git status
```

Make sure config files are tracked:
- postcss.config.js
- tailwind.config.js
- vite.config.js

### When Cloning Fresh

```bash
git clone <repo>
cd mitc-business
npm install          # Install dependencies
npm run dev          # Start server
```

---

## Need More Help?

### 1. Check Vite Logs

Look for warnings in terminal where `npm run dev` is running.

### 2. Check Browser Console

Look for JavaScript errors or CSS loading issues.

### 3. Verify File Structure

```bash
# List all config files
ls -la *.config.js

# Should show:
# postcss.config.js
# tailwind.config.js
# vite.config.js
```

### 4. Test Build

```bash
npm run build
```

Should complete without errors.

### 5. Clean Restart

```bash
# Full clean restart
rm -rf node_modules package-lock.json dist .vite
npm install
npm run dev
```

---

## Summary

**The Issue:** Missing `postcss.config.js` file

**The Fix:** 
1. Pull latest code (postcss.config.js now included)
2. Clean install dependencies
3. Restart dev server
4. Hard refresh browser

**Expected Result:** Fully styled application with colors, spacing, and professional design

---

**Last Updated:** December 1, 2025
**Status:** ✅ RESOLVED - postcss.config.js added to repository