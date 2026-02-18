# 🔧 Google Sheets GST & Address Field Fix

## Problem
Your Google Sheets client structure is missing:
- GST Number field (required for invoices)  
- Proper address fields (address, city, state, zipCode, country)
- Contract and billing information

## Current Sheets Structure
```
id | name | email | phone | company | industry | status | createdAt | totalValue | health
```

## Required New Structure  
```
id | name | email | phone | address | city | state | zipCode | country | gstNumber | 
industry | companySize | website | status | health | accountManager | contractType |
contractValue | contractStartDate | contractEndDate | billingCycle | services |
createdAt | updatedAt | totalValue | tags | notes
```

## 🚀 Solutions (Choose One)

### Option 1: Simple Admin Page ✅ RECOMMENDED
1. **Go to:** `http://localhost:3000/admin/init-sheets`
2. **Click:** "Update Google Sheets" button
3. **Wait:** For confirmation message
4. **Verify:** Check your Google Sheets for new columns

### Option 2: Direct API Call
Open browser console and run:
```javascript
fetch('/api/sheets/initialize', { method: 'POST' })
  .then(r => r.json())
  .then(data => console.log('Result:', data));
```

### Option 3: Fixed Test Page
1. **Go to:** `http://localhost:3000/admin/test-sheets`  
2. **Click:** "Initialize Sheets" button
3. **Check logs:** For success/error messages

### Option 4: Manual cURL
```bash
curl -X POST http://localhost:3000/api/sheets/initialize
```

## 🔍 Verification Steps

### 1. Check Google Sheets
Your "Clients" sheet should now have **25 columns** instead of 10:
- ✅ `gstNumber` column should appear after `country`
- ✅ `address`, `city`, `state`, `zipCode`, `country` should be separate columns  
- ✅ Contract fields like `contractType`, `contractValue` should be present

### 2. Test Client Creation
1. Go to **Admin → Clients → Add Client**
2. Fill in a test client with GST number
3. Save and verify data appears in Google Sheets

### 3. Test Invoice Generation
1. Go to **Admin → Invoice Generator**
2. Select the test client
3. Verify GST number appears in client dropdown
4. Generate PDF and confirm GST is included

## 🐛 Troubleshooting

### API Endpoint Not Working?
- **Check:** Server is running (`npm run dev`)
- **Verify:** You're on the correct URL
- **Test:** Go to `/api/sheets/initialize` first (GET request shows info)

### Google Sheets API Issues?
```bash
# Check environment variables
echo $NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID
echo $GOOGLE_CLIENT_EMAIL
```

### Permission Errors?
- **Verify:** Google Sheets is shared with service account email
- **Check:** Service account has "Editor" permissions
- **Confirm:** Sheets API is enabled in Google Cloud Console

## ✅ Success Indicators

### After Running Initialize:
- ✅ Google Sheets has 25 columns
- ✅ `gstNumber` field exists  
- ✅ Address fields are separated
- ✅ API returns success message

### After Adding Test Client:
- ✅ Client appears in Google Sheets with GST
- ✅ Invoice form shows complete client data
- ✅ PDF invoices include GST number

## 📞 If Still Not Working

1. **Check browser console** for JavaScript errors
2. **Check server logs** for API errors  
3. **Verify environment variables** are set correctly
4. **Test with manual POST** using Postman/Insomnia
5. **Share Google Sheets again** with service account email

---

**The fix is ready! Just run Option 1 above to update your sheets. 🚀**