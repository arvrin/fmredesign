# Google Sheets Database Setup Guide

This guide will help you set up Google Sheets as a database for your Freaking Minds admin system.

## Prerequisites

1. Google account
2. Access to Google Sheets
3. Basic understanding of Google Cloud Console

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "FreakingMinds Database" or similar
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## Step 2: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to APIs & Services > Library
   - Search for "Google Sheets API"
   - Click and enable it

## Step 3: Create Service Account

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - Name: FreakingMinds-SheetsAPI
   - Description: Service account for Freaking Minds database
4. Click "Create and Continue"
5. Skip role assignment for now
6. Click "Done"

## Step 4: Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Download the JSON file
6. Keep this file secure!

## Step 5: Share Spreadsheet with Service Account

1. Open your Google Spreadsheet
2. Click "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it "Editor" permissions
5. Uncheck "Notify people" option
6. Click "Send"

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in the values from your JSON file:

```env
# Google Sheets Integration
NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your_service_account_email@your_project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id

# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password
```

**Important:** Never commit the `.env.local` file to version control!

## Step 7: Initialize Spreadsheet Structure

Run the following API call to set up the spreadsheet headers:

```bash
curl -X POST http://localhost:3000/api/sheets/initialize
```

Or use the admin interface to initialize the database structure.

## Spreadsheet Structure

The system will create the following sheets:

### Clients Sheet
- id, name, email, phone, company, industry, status, createdAt, totalValue, health

### Invoices Sheet  
- id, invoiceNumber, clientId, clientName, date, dueDate, subtotal, tax, total, status, createdAt, lineItems, notes

### Campaigns Sheet
- id, clientId, name, type, status, budget, spent, startDate, endDate, description, createdAt

## Troubleshooting

### Authentication Issues
- Verify service account email is added to spreadsheet
- Check that Google Sheets API is enabled
- Ensure private key format is correct (with proper newlines)

### Permission Issues
- Service account must have "Editor" access to spreadsheet
- Check that spreadsheet ID is correct

### API Rate Limits
- Google Sheets API has rate limits
- The system includes fallback to localStorage for development

## Security Best Practices

1. **Never expose credentials in client-side code**
2. **Use environment variables for all sensitive data**
3. **Regularly rotate service account keys**
4. **Monitor API usage in Google Cloud Console**
5. **Restrict service account permissions to minimum required**

## Development vs Production

### Development Mode
- System falls back to localStorage if Google Sheets fails
- Mock data is used when sheets are not accessible
- Errors are logged to console

### Production Mode  
- Ensure all environment variables are properly set
- Monitor Google Sheets API quotas
- Implement proper error handling and user notifications

## API Endpoints

The system provides these API endpoints:

- `GET /api/clients` - Fetch all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients` - Update client
- `GET /api/invoices` - Fetch all invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices` - Update invoice status

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Test API endpoints manually
4. Check Google Cloud Console for API errors
5. Review spreadsheet permissions

For additional help, refer to:
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)