# Railway Build Error Fix: "secret NEXT_PUBLIC_FOOTBALL_API_URL not found"

## The Problem

Railway's Railpack build system is checking for `NEXT_PUBLIC_FOOTBALL_API_URL` as a **secret** before the build runs, even though:
- The variable is set in Railway dashboard
- The code has default values
- Next.js can build without them

## Root Cause

Railway's Railpack validates secrets during the build phase. If a secret is referenced anywhere (even with defaults), Railway requires it to exist before building.

## Solutions (Try in Order)

### Solution 1: Set as Shared Variables at PROJECT Level ⭐ RECOMMENDED

1. **Go to Railway Dashboard**
2. **Click on your PROJECT name** (e.g., "surprising-celebration") - NOT the service
3. **Click "Variables" tab** at the project level
4. **Click "Shared Variable"** or "+ New Variable"
5. **Add these variables:**
   - `NEXT_PUBLIC_API_BASE_URL` = `https://web-production-ae7a.up.railway.app`
   - `NEXT_PUBLIC_FOOTBALL_API_URL` = `https://web-production-ae7a.up.railway.app`
6. **Select "Apply to all services"** or specifically select "Akenotech"
7. **Save and redeploy**

**Why this works:** Shared variables at project level are available during the build phase, not just runtime.

### Solution 2: Remove and Re-add Variables

Sometimes Railway caches variable references. Try:

1. **Delete** `NEXT_PUBLIC_FOOTBALL_API_URL` from service variables
2. **Redeploy** (will fail, but clears cache)
3. **Add it back** with the correct value
4. **Redeploy again**

### Solution 3: Use Railway CLI to Set Variables

If the dashboard isn't working:

```bash
railway variables set NEXT_PUBLIC_API_BASE_URL=https://web-production-ae7a.up.railway.app
railway variables set NEXT_PUBLIC_FOOTBALL_API_URL=https://web-production-ae7a.up.railway.app
```

### Solution 4: Contact Railway Support

If none of the above work, Railway might need to:
- Mark these as optional secrets
- Or fix a bug in Railpack's secret validation

Contact Railway support with:
- Error message: `failed to solve: secret NEXT_PUBLIC_FOOTBALL_API_URL not found`
- Service name: "Akenotech"
- Explain that these are public variables (NEXT_PUBLIC_*) with defaults and shouldn't be required during build

## Verification

After setting variables, check:

1. **Variables appear in PROJECT level Variables tab**
2. **Variables are marked as "Shared" or applied to your service**
3. **Build logs show variables are available** (check Railway build logs)
4. **Build succeeds** without the secret error

## Why This Happens

- Next.js embeds `NEXT_PUBLIC_*` variables at **build time**
- Railway's Railpack checks for secrets **before** the build runs
- Even with defaults in code, Railway validates secrets exist
- Service-level variables might not be available during build phase
- Project-level shared variables ARE available during build

## Code Changes Made

The code already handles missing variables gracefully:
- `src/config/api.ts` has defaults
- `next.config.mjs` sets defaults
- `railpack-plan.json` tries to set defaults during build

But Railway's secret validation happens **before** any of this code runs.

## Next Steps

1. ✅ Try Solution 1 (Shared Variables at Project Level) - **Most likely to work**
2. If that doesn't work, try Solution 2 (Remove/Re-add)
3. If still failing, try Solution 3 (CLI)
4. If all fail, use Solution 4 (Contact Support)

The build should work once Railway recognizes these variables are available during the build phase.
