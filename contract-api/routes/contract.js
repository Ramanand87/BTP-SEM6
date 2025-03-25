const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Create a new contract
router.post('/create', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      'contractType',
      'farmerName',
      'customerName',
      'productDetails',
      'quantity',
      'price',
      'deliveryDate',
      'terms'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields
      });
    }

    const {
      contractType,
      farmerName,
      customerName,
      productDetails,
      quantity,
      price,
      deliveryDate,
      terms
    } = req.body;

    // Ensure contracts directory exists
    const contractsDir = path.join(__dirname, '..', 'contracts');
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
    }

    // Generate a unique contract ID
    const contractId = Date.now().toString();
    // Sanitize contract type for filename
    const safeContractType = (contractType || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Contract_${safeContractType}_${contractId}.pdf`;
    const contractPath = path.join(contractsDir, fileName);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(contractPath);
    const buffers = [];

    // Handle writeStream errors
    writeStream.on('error', (error) => {
      console.error('Error writing to file:', error);
      res.status(500).json({ error: 'Error saving contract' });
    });

    doc.on('data', buffer => buffers.push(buffer));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(pdfData);
    });

    // Pipe the PDF to the file
    doc.pipe(writeStream);

    // Add content to PDF with a header
    doc.fontSize(24).text('Agricultural Contract Agreement', { align: 'center' });
    doc.moveDown();
    
    // Add contract ID in a box
    doc.fontSize(12);
    doc.rect(doc.x, doc.y, 250, 40).stroke();
    doc.text(`Contract ID: ${contractId}`, { align: 'left', indent: 10 });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'left', indent: 10 });
    doc.moveDown();
    
    // Contract Details
    doc.fontSize(14).text('Contract Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Contract Type: ${contractType}`);
    doc.moveDown();
    
    // Parties Section
    doc.fontSize(14).text('Parties Involved', { underline: true });
    doc.fontSize(12);
    doc.text(`Farmer: ${farmerName}`);
    doc.text(`Customer: ${customerName}`);
    doc.moveDown();
    
    // Product Details Section
    doc.fontSize(14).text('Product Information', { underline: true });
    doc.fontSize(12);
    doc.text(`Product: ${productDetails}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Price: $${price}`);
    doc.text(`Delivery Date: ${deliveryDate}`);
    doc.moveDown();
    
    // Terms Section
    doc.fontSize(14).text('Terms and Conditions', { underline: true });
    doc.fontSize(12);
    doc.text(terms);
    doc.moveDown();
    
    // Signature Section
    doc.fontSize(14).text('Signatures', { underline: true });
    doc.fontSize(12);
    doc.moveDown();
    
    // Farmer Signature
    doc.text('Farmer Signature:');
    doc.rect(doc.x, doc.y, 200, 50).stroke();
    doc.moveDown(4);
    doc.text(`Name: ${farmerName}`);
    doc.text('Date: ________________');
    doc.moveDown();
    
    // Customer Signature
    doc.text('Customer Signature:');
    doc.rect(doc.x, doc.y, 200, 50).stroke();
    doc.moveDown(4);
    doc.text(`Name: ${customerName}`);
    doc.text('Date: ________________');

    // Add footer with contract ID
    doc.fontSize(10);
    const bottom = doc.page.height - 50;
    doc.text(`Contract Reference: ${contractId}`, doc.x, bottom, { align: 'center' });

    // Save contract metadata
    const metadata = {
      id: contractId,
      fileName,
      contractType,
      farmerName,
      customerName,
      productDetails,
      quantity,
      price,
      deliveryDate,
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(contractsDir, `${contractId}.json`),
      JSON.stringify(metadata, null, 2)
    );

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ 
      error: 'Error generating contract',
      details: error.message 
    });
  }
});

// Get contract by ID
router.get('/:id', (req, res) => {
  try {
    const contractId = req.params.id;
    const metadataPath = path.join(__dirname, '..', 'contracts', `${contractId}.json`);

    // Check if contract exists
    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Get contract metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const contractPath = path.join(__dirname, '..', 'contracts', metadata.fileName);

    // If format=pdf is specified, return the PDF file
    if (req.query.format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${metadata.fileName}"`);
      fs.createReadStream(contractPath).pipe(res);
    } else {
      // Otherwise return contract metadata
      res.json(metadata);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving contract' });
  }
});

// Get all contracts
router.get('/', (req, res) => {
  try {
    const contractsDir = path.join(__dirname, '..', 'contracts');
    const contracts = [];

    // Read all JSON files in the contracts directory
    fs.readdirSync(contractsDir)
      .filter(file => file.endsWith('.json'))
      .forEach(file => {
        const metadata = JSON.parse(
          fs.readFileSync(path.join(contractsDir, file), 'utf-8')
        );
        contracts.push(metadata);
      });

    // Sort contracts by creation date (newest first)
    contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(contracts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving contracts' });
  }
});

module.exports = router; 