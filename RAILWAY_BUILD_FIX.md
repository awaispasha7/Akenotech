# Railway Build Fix - Environment Variables

## Issue
Railway build fails with: `secret NEXT_PUBLIC_FOOTBALL_API_URL not found`

## Solution

You need to **set the environment variables in Railway BEFORE the build runs**.

### Steps to Fix:

1. **Go to Railway Dashboard**
   - Select your frontend service ("web")
   - Click on "Variables" tab

2. **Add these environment variables:**

   ```
   NEXT_PUBLIC_API_BASE_URL = https://web-production-ae7a.up.railway.app
   NEXT_PUBLIC_FOOTBALL_API_URL = https://web-production-ae7a.up.railway.app
   ```

   **Important:** Replace `https://web-production-ae7a.up.railway.app` with your actual backend Railway URL.

3. **Save and Redeploy**
   - Click "Deploy" or wait for auto-deployment
   - The build should now succeed

## Alternative: Set During Build

If you want to set them during the build process, you can add them to the `railpack-plan.json`:

```json
{
  "providers": {
    "node": {
      "version": "22.21.1"
    }
  },
  "phases": {
    "install": {
      "commands": [
        "corepack enable",
        "corepack prepare pnpm@latest --activate",
        "pnpm install --frozen-lockfile --prefer-offline"
      ]
    },
    "build": {
      "commands": [
        "pnpm run build"
      ],
      "env": {
        "NEXT_PUBLIC_API_BASE_URL": "${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000}",
        "NEXT_PUBLIC_FOOTBALL_API_URL": "${NEXT_PUBLIC_FOOTBALL_API_URL:-${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000}}"
      }
    }
  },
  "start": {
    "command": "pnpm run start"
  }
}
```

However, **the recommended approach is to set them in Railway Variables tab** as shown above.

## Why This Happens

Next.js embeds `NEXT_PUBLIC_*` environment variables into the build at build time. Railway's Railpack build system checks for these secrets before building. Even though our code has defaults, Railway validates that secrets exist if they're referenced.

Setting them in Railway Variables ensures:
- The build has access to them
- They're available at runtime
- Production uses the correct backend URL instead of localhost
