# CRITICAL: Railway Build Fix - You MUST Set These Variables

## ⚠️ The Problem

Railway's Railpack build system **scans your code** and detects `NEXT_PUBLIC_*` environment variables that are referenced. It then **validates these exist as secrets BEFORE the build runs**.

Even though our code has defaults (`|| 'http://localhost:8000'`), Railway checks for the **secret** before any code runs.

**Error:** `failed to solve: secret NEXT_PUBLIC_FOOTBALL_API_URL not found`

## ✅ THE ONLY SOLUTION

You **MUST** set these environment variables in Railway **before** the build can succeed.

### Step-by-Step Fix:

1. **Go to Railway Dashboard**
   - Navigate to: https://railway.app

2. **Select YOUR PROJECT** (not the service)
   - Project name: "surprising-celebration"
   - **DO NOT** click on "Akenotech" service yet

3. **Click "Variables" tab at PROJECT level**
   - You should see project-level variables
   - Not service-level variables

4. **Click "Shared Variable"** or **"+ New Variable"**

5. **Add these EXACT variables:**

   ```
   Variable Name: NEXT_PUBLIC_API_BASE_URL
   Value: https://web-production-ae7a.up.railway.app
   
   Variable Name: NEXT_PUBLIC_FOOTBALL_API_URL
   Value: https://web-production-ae7a.up.railway.app
   ```

   **⚠️ Important:** Replace `https://web-production-ae7a.up.railway.app` with your actual backend Railway URL if different.

6. **Apply to Services:**
   - Select "Apply to all services" OR
   - Specifically select "Akenotech" service

7. **SAVE**

8. **Redeploy:**
   - Go to your "Akenotech" service
   - Click "Deployments" tab
   - Click the "..." menu on the latest deployment
   - Click "Redeploy"

## 🔍 How to Verify Variables Are Set Correctly

1. **Project Level:**
   - Go to Project → Variables
   - You should see `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_FOOTBALL_API_URL`
   - They should be marked as "Shared" or show which services use them

2. **Service Level:**
   - Go to Akenotech service → Variables
   - These variables should appear here too (inherited from project or explicitly set)

3. **Build Logs:**
   - After redeploy, check Build Logs
   - You should NOT see "secret NEXT_PUBLIC_FOOTBALL_API_URL not found"
   - The build should proceed

## ❌ Common Mistakes

1. **Setting only at Service Level** - These might not be available during build
2. **Wrong Variable Name** - Must be exactly `NEXT_PUBLIC_FOOTBALL_API_URL` (case-sensitive)
3. **Setting After Build Starts** - Variables must be set BEFORE triggering build
4. **Using Wrong URL** - Make sure you're using your actual backend Railway URL

## 🔄 If It Still Fails

1. **Delete the variables completely**
   - Both at project and service level

2. **Wait 30 seconds**

3. **Add them again at PROJECT level as Shared Variables**

4. **Save and Redeploy**

5. **Check Build Logs** - The error should be gone

## 📝 Why This Happens

- Next.js embeds `NEXT_PUBLIC_*` variables at **build time**
- Railway scans your code (`src/config/api.ts`) and finds `NEXT_PUBLIC_FOOTBALL_API_URL`
- Railway checks: "Does this secret exist?" BEFORE running any commands
- If not found → Build fails immediately
- Even if code has defaults → Railway never gets to run the code

## ✅ After Setting Variables

Once variables are set correctly:
- Build will succeed ✅
- Variables will be embedded in the build ✅
- App will use Railway backend URL ✅
- Football analysis will work ✅

## 📞 Still Having Issues?

If you've tried everything above and it still fails:

1. **Check Railway Status:** https://status.railway.app
2. **Contact Railway Support:** https://railway.app/help
3. **Verify Backend URL:** Make sure your backend Railway URL is correct

---

**TL;DR:** Set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_FOOTBALL_API_URL` as **Shared Variables at PROJECT level** in Railway, then redeploy. There's no code workaround - Railway requires these to exist before build.
