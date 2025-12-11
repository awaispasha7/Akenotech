# 📸 How to Find/Create Cloudinary Upload Preset

## 🎯 Where to Find Upload Preset

### Step 1: Go to Cloudinary Dashboard

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign in to your account
3. Go to your **Dashboard**

### Step 2: Navigate to Upload Settings

1. In the left sidebar, click **"Settings"** (gear icon)
2. Click **"Upload"** tab
3. Scroll down to **"Upload presets"** section

### Step 3: Check Existing Presets

- You'll see a list of upload presets
- Look for one named `blog_images` or similar
- If none exist, you need to create one

---

## 🔧 How to Create Upload Preset

### Step 1: Create New Preset

1. In **Settings** → **Upload** → **Upload presets**
2. Click **"Add upload preset"** button
3. Or click **"+"** icon

### Step 2: Configure Preset

**Basic Settings:**
- **Preset name:** `blog_images` (or any name you want)
- **Signing mode:** Choose **"Unsigned"** (for client-side uploads)
- **Folder:** `blog-images` (optional, for organization)

**Advanced Settings (Optional):**
- **Format:** `auto` (auto-optimize format)
- **Quality:** `auto` (auto-optimize quality)
- **Width:** `1200` (max width, optional)
- **Transformation:** `w_1200,q_auto,f_auto` (optimization)

### Step 3: Save Preset

1. Click **"Save"** button
2. Your preset name is now available
3. Copy the preset name

---

## 📝 Add to Environment Variables

### Update `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drwvwxmod
NEXT_PUBLIC_CLOUDINARY_API_KEY=953152569761969
CLOUDINARY_API_SECRET=VhOLttbzQuTV2LA77m1TlWQy3So
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=blog_images
```

**Replace `blog_images` with your actual preset name!**

---

## 🔍 Quick Check: Do You Have a Preset?

### Check in Cloudinary Dashboard:

1. Go to **Settings** → **Upload**
2. Look for **"Upload presets"** section
3. If you see presets listed → Use that name
4. If empty → Create one (steps above)

---

## ⚠️ Important Notes

### For Client-Side Uploads (Your Case):

- **Must use "Unsigned" preset**
- This allows uploads from browser without server
- More secure for public uploads

### For Server-Side Uploads:

- Can use signed presets
- More secure but requires backend

---

## ✅ Quick Setup Checklist

- [ ] Go to Cloudinary Dashboard
- [ ] Settings → Upload → Upload presets
- [ ] Check if preset exists
- [ ] If not, create new preset:
  - Name: `blog_images`
  - Signing: **Unsigned**
  - Folder: `blog-images` (optional)
- [ ] Save preset
- [ ] Copy preset name
- [ ] Add to `.env.local`:
  ```
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=blog_images
  ```

---

## 🎯 Default Preset Name

If you don't create a preset, Cloudinary has a default:
- **Default unsigned preset:** Usually named after your account
- **Check:** Settings → Upload → Upload presets

**But it's better to create your own!**

---

## 📸 Visual Guide

```
Cloudinary Dashboard
  └── Settings (gear icon)
      └── Upload tab
          └── Upload presets section
              ├── Existing presets (if any)
              └── "Add upload preset" button
                  └── Configure:
                      - Name: blog_images
                      - Signing: Unsigned
                      - Folder: blog-images
                      └── Save
```

---

## 🚀 After Setup

1. **Preset created** ✅
2. **Added to `.env.local`** ✅
3. **Restart dev server:** `npm run dev`
4. **Test image upload** in your blog

---

**Quick Answer:** Go to Cloudinary Dashboard → Settings → Upload → Upload presets → Create new preset named `blog_images` with "Unsigned" signing mode.


