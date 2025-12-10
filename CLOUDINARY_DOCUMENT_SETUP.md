# 📄 Cloudinary Document Upload Setup Guide

## ✅ Why Cloudinary Instead of Firebase Storage?

**Benefits:**
- ✅ **No CORS Issues** - Cloudinary handles CORS automatically
- ✅ **Better Browser Support** - Works seamlessly in client-side code
- ✅ **CDN Delivery** - Fast global content delivery
- ✅ **Already Set Up** - You're already using Cloudinary for images
- ✅ **Free Tier** - 25GB storage, 25GB bandwidth/month

---

## 🔧 Setup Steps

### Step 1: Update Upload Preset in Cloudinary

1. **Go to Cloudinary Dashboard:**
   - Visit [cloudinary.com](https://cloudinary.com)
   - Sign in to your account

2. **Navigate to Settings:**
   - Click **"Settings"** (gear icon) in the top menu
   - Click **"Upload"** in the left sidebar

3. **Edit Upload Preset:**
   - Find your upload preset: `blog_images`
   - Click **"Edit"** or create a new one

4. **Configure for Raw Files:**
   - **Signing mode:** Set to **"Unsigned"** (for client-side uploads)
   - **Resource type:** Set to **"Auto"** or **"Raw"** (to allow PDFs/Word docs)
   - **Folder:** Set to `blog-documents` (or leave empty)
   - **Allowed formats:** Add `pdf, doc, docx` if there's a format restriction

5. **Save the Preset:**
   - Click **"Save"** or **"Update"**

---

## 📋 Alternative: Create Separate Preset for Documents

If you want to keep images and documents separate:

1. **Create New Preset:**
   - Go to **Settings** → **Upload** → **Upload presets**
   - Click **"Add upload preset"**

2. **Configure:**
   - **Preset name:** `blog_documents`
   - **Signing mode:** **Unsigned**
   - **Resource type:** **Raw**
   - **Folder:** `blog-documents`
   - **Allowed formats:** `pdf, doc, docx`

3. **Update Code:**
   - If you create a separate preset, update `cloudinary.ts`:
   ```typescript
   upload_preset: 'blog_documents', // For documents
   ```

---

## ✅ Verification

After setup, test the upload:

1. Go to your blog page
2. Click **"Upload Document"**
3. Select a PDF or Word file
4. Check browser console for success message
5. Verify file appears in Cloudinary Media Library under `blog-documents/` folder

---

## 🎯 Current Configuration

**Your Cloudinary Account:**
- Cloud Name: `drwvwxmod`
- Upload Preset: `blog_images` (needs to support raw files)

**File Storage:**
- Documents saved to: `blog-documents/` folder in Cloudinary
- Accessible via: Cloudinary CDN URLs

---

## 🔍 Troubleshooting

### Error: "Resource type not allowed"
- **Fix:** Update upload preset to allow "Raw" resource type

### Error: "Format not allowed"
- **Fix:** Add `pdf, doc, docx` to allowed formats in preset

### Error: "Upload preset not found"
- **Fix:** Verify preset name is correct: `blog_images`
- Or create a new preset specifically for documents

---

## 📊 Cloudinary Free Tier Limits

- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** Unlimited
- **File Size:** Up to 10 MB per file (free tier)
- **Formats:** PDF, DOC, DOCX all supported

---

**Quick Fix:** Just update your existing `blog_images` preset to allow "Raw" resource type, and you're good to go! 🚀

