# 📸 How to Check Images in Cloudinary Dashboard

## ✅ Step-by-Step Guide

### Step 1: Go to Cloudinary Dashboard

1. **Open your browser**
2. **Go to:** [cloudinary.com](https://cloudinary.com)
3. **Sign in** to your account
4. You'll see your **Dashboard**

### Step 2: Navigate to Media Library

1. In the **left sidebar**, look for:
   - **"Media Library"** (folder/photo icon)
   - Or **"Assets"** (some versions)
2. **Click on "Media Library"**

### Step 3: View Your Images

1. You'll see all uploaded images
2. **Look for folder:** `blog-images/`
3. **Click on the folder** to see images organized by post ID
4. Each post will have its own subfolder: `blog-images/{postId}/`

### Step 4: Verify Images

**What you should see:**
- ✅ Images organized in folders
- ✅ Image thumbnails
- ✅ Image names with timestamps
- ✅ Image details (size, format, etc.)

---

## 🔍 Quick Visual Guide

```
Cloudinary Dashboard
│
├── Left Sidebar
│   └── Media Library ← Click here!
│       └── blog-images/ ← Your images folder
│           └── {postId}/ ← Each post has a folder
│               └── {timestamp}_image.jpg ← Your images!
```

---

## 📊 What to Look For

### In Media Library:

1. **Folder Structure:**
   ```
   blog-images/
     └── {postId}/
         ├── 1234567890_image1.jpg
         ├── 1234567891_image2.png
         └── ...
   ```

2. **Image Details:**
   - Thumbnail preview
   - File name
   - Upload date
   - File size
   - Format (JPG, PNG, etc.)

3. **Image Count:**
   - Check how many images you have
   - Should match what you uploaded

---

## 🎯 Quick Check Methods

### Method 1: Media Library (Easiest)

1. **Dashboard** → **Media Library**
2. **Click** `blog-images` folder
3. **See all images** organized by post

### Method 2: Search

1. **Media Library** → **Search bar** (top)
2. **Type:** `blog-images`
3. **See all images** in that folder

### Method 3: Recent Uploads

1. **Media Library** → **Sort by:** "Recently uploaded"
2. **See latest images** at the top

---

## ✅ Confirmation Checklist

After uploading images from your blog:

- [ ] Go to Cloudinary Dashboard
- [ ] Click "Media Library"
- [ ] See `blog-images/` folder
- [ ] Open folder to see post subfolders
- [ ] See your uploaded images with thumbnails
- [ ] Image count matches what you uploaded

---

## 🔍 Troubleshooting

### If you don't see images:

1. **Check folder name:**
   - Should be `blog-images/`
   - Check in Media Library

2. **Check upload preset:**
   - Go to **Settings** → **Upload** → **Upload presets**
   - Make sure `blog_images` preset exists
   - Check if folder is set in preset

3. **Check browser console:**
   - Press **F12** → **Console**
   - Look for upload success messages
   - Check for any errors

4. **Verify credentials:**
   - Check `cloudinary.ts` file
   - Make sure cloud_name is correct: `drwvwxmod`

---

## 📸 What You'll See

### In Cloudinary Dashboard:

**Media Library View:**
- Grid of image thumbnails
- Folder structure on left
- Image details on hover
- Search and filter options

**Image Details:**
- Full-size preview
- URL (for use in your blog)
- Transformation options
- Metadata

---

## 🎯 Quick Access

**Direct Link to Media Library:**
- After signing in, URL will be:
  `https://console.cloudinary.com/console/media_library`

**Or navigate:**
- Dashboard → Media Library (left sidebar)

---

## ✅ Success Indicators

**If images are uploaded correctly, you'll see:**

1. ✅ **Images in Media Library**
2. ✅ **Organized in `blog-images/` folder**
3. ✅ **Thumbnails visible**
4. ✅ **Image URLs work** (click image to see URL)
5. ✅ **Images display in your blog**

---

## 🔗 Your Cloudinary Account

**Cloud Name:** `drwvwxmod`
**Dashboard:** [console.cloudinary.com](https://console.cloudinary.com)

**Steps:**
1. Sign in
2. Go to Media Library
3. Look for `blog-images/` folder
4. See your uploaded images!

---

**Quick Answer:** Go to [cloudinary.com](https://cloudinary.com) → Sign in → Click "Media Library" → Look for `blog-images/` folder → See your images! 📸

