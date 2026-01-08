#!/bin/bash
set -e

# Set default values for environment variables if not set
# This ensures the build works even if Railway doesn't have these set during build
export NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000}
export NEXT_PUBLIC_FOOTBALL_API_URL=${NEXT_PUBLIC_FOOTBALL_API_URL:-${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000}}

echo "Building with:"
echo "  NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}"
echo "  NEXT_PUBLIC_FOOTBALL_API_URL=${NEXT_PUBLIC_FOOTBALL_API_URL}"

# Run the build
pnpm run build
