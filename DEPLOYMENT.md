# 🚀 Freaking Minds Admin System - Deployment Guide

## Prerequisites

- Vercel account
- GitHub repository access
- Google Cloud Service Account credentials
- Google Spreadsheet with proper sharing

## Deployment Steps

### 1. Environment Variables Setup

In your Vercel dashboard, go to **Settings > Environment Variables** and add these variables:

#### Google Sheets Integration
```bash
NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID=1HFG8UsWVErAqennUnmKHsIaBgWVB4JeULKKTl-fvqBU
GOOGLE_PROJECT_ID=fm-admin-469817
GOOGLE_PRIVATE_KEY_ID=575a41fd148864cab732f9f78a4c223bc15b62b3
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7dikdSx9rigcK
r2s9VIfZozEFwxcF8KHjZTiAQX1VerCm4u1aQ9EJbxbBgwGFcJ2ReOLHW2mVKNOW
o9P1GSmbZzuAvn1WdU9mv8uh0kBow2kX4JcdqhANF9/9rd1Y/oPta6o5o8yrD/4W
d4WfDd6wmir8Ee5sf9uk9SspaB3/yRhZRwct7N6ZHzZaWnG5a65bWRYejzmZrcK5
OGdUVKKWPyRMjk/tXQVQy50IW0O04QCfk5TMY3y51q0/Q0Y2Ucpc3HgtEbM6Box9
oCvIXWy/z3cGDZrtJWsYwY6Sk1wr3gtJLGSygVTfgCBrNuxhmBFkgDK3m0VfCD9K
Q7E6MZT1AgMBAAECggEAT6i5deo7Us5XibHbRzeJdvFC3qj1Op/zmxajONUbdlxp
frFFnSreRD0BlX+fAN5HBs8wxvhQWIL9zrCVXDyyEoh+n4nS5w94izgLRxt6JUqM
eQoGDSP8KCQyGbFtMukMlLJApre1PCfSmCd4D4usSq1ogK75+v8mDeXkznag8NUA
GR1EEy/Lh/1Csnud5TifOvyAsA6WZoV8lb5ZAL/+S4SzSUOn06/VSxiUPxqZkexo
E/ANqn9IAWFoCCwveD79gBwCg0cQcDpLO7rtue1eT6X1vqYCqrvp1SeRNRucOWXg
nDE0b2tWP3jW3uvtmo5s2kb/lAaaEkfKtImYXObdbQKBgQDgTOWPDcYAlmG4kBwR
eCP2M+ry+mIuKApGvzGAMCbQTlm4cPrwFlJ49bDZReUsbYBAGtxyejiTtwCr4k3y
UJU14WcUft4ZnQBxFPcamORztcPnFzxPH3R1ifmUxN54DnBWYH9rQdXcwcRSgwJ8
HofjkdUk/Of5Aa7QVhmZv3ablwKBgQDV9HMSLWiTywInCxyb1SdubzBUkrQFq4iY
by9jgTvnX23InBMtB8FI5whsMgf/Bj2XSYYrbPRwv+bvGgRcUqmntj+nZgIS56HQ
O6AN6gzp4Xn6ZN53STkVr0XRHJRPX0Xijs/rEQ1fJF6nfnwK8ERHJpsKr7a55xlj
zzxUlgxVUwKBgQCxECL7Xb0bg5sazjBKHhQNbAihzMQqeZM7K/0Qm3JYaDFtZ0rA
sm5ibFkx+3ohK0Pd1xaFDDSTbxiJl3k+uxw+z3PG+yuq/oR1wD4c8esN6MQALhh+
wW72xneOWCbikUte9IhBjFQeE5w+IouYnaVaISooK7mXmRt9/Snyc/FWewKBgQCa
ssdJC2AkDJMf297xpet+5BJT9EcKGn8HiM0A635+yvc8J+2Nj5/nsHTclkhF0yNR
ci361CriIz88/tjMUFCvHQ1lYlJ5jNXpFFOj++keapOhwrFAGseVsEeQ7VMnGMIV
ECGx24CJnGh8Pu49koAr2fQcg/Rg8oHfMwZyOpPsVQKBgQDd8IJZgNsEo/EYEMCS
yBLKeYbd9epj0/0Pka7+7EcLfdRPYxOk7RPzzJaAJoxZ4i9ypxqp+k113JURvr1b
W8kMXPEy10WhCk2E/zsZRRH34Yumdh0X8R02Ty6NTdK03WuyY+ZPHw+/TZlCP5zc
sgBrPvLp+52tBvbfv8MfEog+Ng==
-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=freakingminds-sheetsapi@fm-admin-469817.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=105868785875002980726
```

#### Admin System
```bash
ADMIN_PASSWORD=FreakingMinds2024!
JWT_SECRET=64207f2ed1e5f7f283a52afe26cb0eb3270578112c268a4e94b8bf1a20e5c6cf
```

#### Next.js Configuration
```bash
NEXTAUTH_URL=https://your-deployed-domain.vercel.app
NEXTAUTH_SECRET=64207f2ed1e5f7f283a52afe26cb0eb3270578112c268a4e94b8bf1a20e5c6cf
NODE_ENV=production
```

### 2. Google Sheets Permissions

Ensure your Google Spreadsheet is shared with:
```
freakingminds-sheetsapi@fm-admin-469817.iam.gserviceaccount.com
```

### 3. Deploy to Vercel

#### Option A: Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `arvrin/fmredesign`
4. Configure environment variables
5. Deploy

#### Option B: Deploy via CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. Post-Deployment Verification

After deployment, test these URLs:

1. **Admin Login**: `https://your-domain.vercel.app/admin`
   - Password: `FreakingMinds2024!`

2. **Test Interface**: `https://your-domain.vercel.app/admin/test-sheets`
   - Run all tests to verify Google Sheets integration

3. **Invoice System**: `https://your-domain.vercel.app/admin/invoice`
   - Create a test invoice

4. **API Health**: `https://your-domain.vercel.app/api/clients`
   - Should return client data

### 5. Domain Configuration

Update these after getting your domain:

1. **Environment Variables**:
   ```bash
   NEXTAUTH_URL=https://your-custom-domain.com
   ```

2. **Google Cloud Console**:
   - Add your domain to authorized domains
   - Update redirect URIs if needed

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Check variable names match exactly
   - Ensure no extra spaces or quotes
   - Redeploy after adding variables

2. **Google Sheets API Errors**
   - Verify service account email has access
   - Check API is enabled in Google Cloud
   - Validate private key format

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

### Performance Optimization

1. **API Routes**: Max duration set to 30s for Google Sheets operations
2. **Region**: Deployed to Mumbai (bom1) for better performance in India
3. **Caching**: Static assets cached by Vercel CDN

## Security Notes

- Never commit `.env.local` to repository
- Use Vercel environment variables for sensitive data
- Regularly rotate service account keys
- Monitor API usage in Google Cloud Console

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test Google Sheets integration
4. Check browser console for errors

---

🚀 **Your Freaking Minds admin system is ready for production!**