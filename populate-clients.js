/**
 * Script to populate the Clients sheet with real data
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID;

// Service account credentials
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function populateClientsSheet() {
  try {
    console.log('Connecting to Google Sheets...');
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    console.log('Connected successfully');

    // Check if Clients sheet exists
    let clientsSheet = doc.sheetsByTitle['Clients'];

    if (!clientsSheet) {
      console.log('Creating Clients sheet...');
      clientsSheet = await doc.addSheet({ title: 'Clients' });
    } else {
      console.log('Clients sheet found, clearing existing data...');
      await clientsSheet.clear();
    }

    // Add headers
    const headers = [
      'id', 'name', 'email', 'phone', 'address', 'city', 'state', 'zipCode',
      'country', 'gstNumber', 'industry', 'companySize', 'website', 'status',
      'health', 'accountManager', 'contractType', 'contractValue',
      'contractStartDate', 'contractEndDate', 'billingCycle', 'services',
      'createdAt', 'updatedAt', 'totalValue', 'tags', 'notes'
    ];

    await clientsSheet.setHeaderRow(headers);

    // Real client data from your local system
    const clientsData = [
      [
        'client-1756808400007', 'Rukmani Amusement Ltd', 'Kanhafuncity@yahoo.com', '+91-9200001208',
        'Fun City, Hoshangabad road', 'Bhopal', 'Madhya Pradesh', '462011', 'India',
        '23AABCR8389R1ZH', 'entertainment', 'medium', 'https://harshexpress.com/',
        'active', 'good', 'admin', 'project', '0', '2025-09-02T10:20:00.007Z',
        '2025-12-31', 'monthly', '', '2025-09-02T10:20:00.007Z', '2025-09-02T10:20:00.007Z',
        '0', '', ''
      ],
      [
        'client-1756808610885', 'Elisa home appliances private limited', 'info@elisaindia.in', '+91-9876543210',
        'Aredhi', 'Bhopal', 'Madhya Pradesh', '123456', 'India',
        '23AAFCE2335J1ZW', 'retail', 'medium', 'https://harshexpress.com/',
        'active', 'good', 'admin', 'project', '0', '2025-09-02T10:23:30.885Z',
        '2025-12-31', 'monthly', '', '2025-09-02T10:23:30.885Z', '2025-09-02T10:23:30.885Z',
        '0', '', ''
      ],
      [
        'client-1756810138338', 'HARSH TRANSPORT PVT LTD', 'info@harshexpress.com', '+91-9200001208',
        'T3, Citi Centre, Indira Press Complex, Zone 1, MP nagar', 'Bhopal', 'Madhya Pradesh', '462011', 'India',
        '23AAACH3738B1Z6', 'Transport & Logistics', 'medium', 'https://harshexpress.com/',
        'active', 'good', 'admin', 'project', '0', '2025-09-02T10:48:58.338Z',
        '2025-12-31', 'monthly', '', '2025-09-02T10:48:58.338Z', '2025-09-02T10:48:58.338Z',
        '0', '', ''
      ]
    ];

    console.log('Adding client data...');
    await clientsSheet.addRows(clientsData);

    console.log('✅ Clients sheet populated successfully!');
    console.log('Real clients added:');
    console.log('- Rukmani Amusement Ltd');
    console.log('- Elisa home appliances private limited');
    console.log('- HARSH TRANSPORT PVT LTD');

  } catch (error) {
    console.error('❌ Error populating Clients sheet:', error);
  }
}

populateClientsSheet();