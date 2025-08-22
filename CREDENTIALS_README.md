# 🔐 Credentials Setup Guide

## Quick Setup

1. **Edit the credentials file:**
   ```bash
   # Open credentials-setup.js and fill in your values
   code credentials-setup.js
   ```

2. **Update the CONFIG object with your credentials:**
   - Google Spreadsheet ID
   - Google Cloud Service Account details
   - Admin password
   - Company information

3. **Run the setup script:**
   ```bash
   node credentials-setup.js
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Test the integration:**
   - Go to: http://localhost:3000/admin/test-sheets
   - Run all tests to verify functionality

## Required Credentials

### Google Sheets Integration
- **Spreadsheet ID**: From your Google Sheets URL
- **Project ID**: From Google Cloud Console
- **Private Key ID**: From service account JSON
- **Private Key**: From service account JSON
- **Client Email**: Service account email
- **Client ID**: From service account JSON

### Admin System
- **Admin Password**: Secure password for admin access
- **JWT Secret**: Auto-generated for session security

### Company Information
- Company details for invoices and branding
- Contact information
- GST number (if applicable)

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `credentials-setup.js` to version control
- The `.env.local` file is automatically protected by .gitignore
- Keep your Google Service Account credentials secure
- Use a strong admin password (8+ characters)

## Troubleshooting

If you encounter issues:

1. **Check credentials format**: Ensure private key includes proper headers/footers
2. **Verify spreadsheet permissions**: Service account must have Editor access
3. **Test API access**: Use the test interface at `/admin/test-sheets`
4. **Check console logs**: Browser console shows detailed error messages

## Getting Credentials

### Google Sheets Setup
1. Create Google Cloud Project
2. Enable Google Sheets API
3. Create Service Account
4. Download JSON credentials
5. Share spreadsheet with service account email

See `GOOGLE_SHEETS_SETUP.md` for detailed instructions.

## File Structure

```
credentials-setup.js    # Configuration script (DON'T COMMIT)
.env.local             # Generated environment file (DON'T COMMIT)
.env.example           # Template with placeholder values (SAFE TO COMMIT)
GOOGLE_SHEETS_SETUP.md # Detailed setup instructions
```

## Support

For issues with setup:
1. Check the browser console for errors
2. Verify all credentials are correctly formatted
3. Test individual components using the test interface
4. Review Google Cloud Console for API errors

Happy invoicing! 🚀