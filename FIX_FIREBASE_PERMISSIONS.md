# 🔥 Fix Firebase Permissions - Quick Guide

## ⚠️ Current Issue
Your blog is getting "Missing or insufficient permissions" errors because Firebase Firestore security rules are blocking access.

## ✅ Solution: Update Firestore Security Rules

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **akeno-tech-blog**

### Step 2: Navigate to Firestore Rules
1. In the left sidebar, click **"Firestore Database"**
2. Click on the **"Rules"** tab (at the top)

### Step 3: Update Security Rules
Replace the existing rules with this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to blogPosts collection
    match /blogPosts/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to caseStudySubmissions collection
    match /caseStudySubmissions/{document} {
      allow read, write: if true;
    }
  }
}
```

### Step 4: Publish Rules
1. Click the **"Publish"** button
2. Wait for confirmation that rules are published

### Step 5: Test Your Blog
1. Refresh your blog page
2. Try creating a new blog post
3. The permission errors should be gone!

## 🔒 Security Note

**For Development:** The rules above allow anyone to read/write (okay for testing)

**For Production:** You should add authentication and restrict access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogPosts/{document} {
      // Allow read for everyone, write only for authenticated users
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📝 Your Firebase Project Details
- **Project ID:** akeno-tech-blog
- **Collection Name:** blogPosts
- **Firebase Console:** https://console.firebase.google.com/project/akeno-tech-blog

## ✅ After Fixing
Once you update the rules:
- ✅ Blog posts will load from Firebase
- ✅ You can add new blog posts
- ✅ You can edit and delete posts
- ✅ No more permission errors!




