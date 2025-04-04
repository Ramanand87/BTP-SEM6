const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Create contract
router.post('/create', async (req, res) => {
    try {
        const {
            orderId,
            orderDate,
            farmerName,
            farmerContact,
            farmerAddress,
            customerName,
            customerContact,
            customerAddress,
            productDetails,
            deliveryDate,
            deliveryLocation,
            signatures,
        } = req.body;

        // Validate required fields
        if (!farmerName || !customerName || !productDetails || !deliveryDate || !signatures) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Ensure contracts directory exists
        const contractsDir = path.join(__dirname, '..', 'contracts');
        if (!fs.existsSync(contractsDir)) {
            fs.mkdirSync(contractsDir, { recursive: true });
        }

        const contractId = orderId.replace('ORD', 'CON');
        const pdfPath = path.join(contractsDir, `${contractId}.pdf`);

        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        });

        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);

        // Title
        doc.fontSize(18)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('AGRICULTURAL SALES CONTRACT', { align: 'center' });
        doc.moveDown(1);

        // Parties Section
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('PARTIES', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#000000')
           .text('This Agricultural Sales Contract (hereinafter referred to as the "Agreement") is entered into on ' + 
                 new Date(orderDate).toLocaleDateString() + ', by and between:');
        doc.moveDown(1);

        // Farmer Details
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#555555')
           .text('1. Farmer Details');
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#000000')
           .text('Name: ' + farmerName)
           .text('Contact Number: ' + (farmerContact || '_______________'))
           .text('Address: ' + (farmerAddress || '_______________'));
        doc.moveDown(1);

        // Customer Details
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#555555')
           .text('2. Customer Details');
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#000000')
           .text('Name: ' + customerName)
           .text('Contact Number: ' + (customerContact || '_______________'))
           .text('Address: ' + (customerAddress || '_______________'));
        doc.moveDown(0.5);
        doc.text('(All parties collectively referred to as "Parties")');
        doc.moveDown(1);

        // WHEREAS Section
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('WHEREAS', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#000000')
           .text('The Farmer agrees to sell and deliver the specified crop to the Customer under the terms set forth herein.')
           .moveDown(0.5)
           .text('The Customer agrees to purchase and accept the crop as per the agreed-upon terms.');
        doc.moveDown(1);

        // Order Details
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('ORDER DETAILS', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#000000')
           .text('Order ID: ' + orderId)
           .text('Order Date: ' + new Date(orderDate).toLocaleDateString())
           .text('Crop Name: ' + (productDetails.cropName || '_______________'))
           .text('Quantity: ' + (productDetails.quantity || '_______________') + ' kg')
           .text('Price per kg: ₹' + (productDetails.price || '_______________'))
           .text('Total Amount: ₹' + (productDetails.totalAmount || '_______________'))
           .text('Delivery Date: ' + new Date(deliveryDate).toLocaleDateString())
           .text('Delivery Location: ' + (deliveryLocation || '_______________'));
        doc.moveDown(1);

        // Terms and Conditions
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('TERMS AND CONDITIONS', { underline: true });
        doc.moveDown(0.5);

        const terms = [
            {
                title: 'Payment Terms',
                content: 'Full payment shall be made upon delivery of the crop.'
            },
            {
                title: 'Quality Compliance',
                content: 'The crop must meet the agreed-upon quality standards. The Customer reserves the right to inspect the crop upon delivery.'
            },
            {
                title: 'Delivery Terms',
                content: 'The Farmer shall ensure timely delivery on the specified date and location. Any delays must be communicated in writing.'
            },
            {
                title: 'Force Majeure',
                content: 'If an unforeseen event prevents either party from fulfilling their obligations, the contract terms may be adjusted accordingly.'
            },
            {
                title: 'Dispute Resolution',
                content: 'Any disputes arising under this contract shall be resolved through mutual discussion. If unresolved, the matter shall be referred to arbitration in accordance with the Indian Arbitration and Conciliation Act, 1996.'
            },
            {
                title: 'Legal Compliance',
                content: 'Both parties shall comply with all applicable laws and regulations regarding the sale and transportation of agricultural goods.'
            },
            {
                title: 'Indemnification',
                content: 'Each party agrees to indemnify and hold harmless the other against any losses, damages, or liabilities resulting from non-compliance with the contract.'
            }
        ];

        terms.forEach(term => {
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .fillColor('#000000')
               .text(term.title + ' – ' + term.content, {
                   align: 'justify',
                   lineGap: 5
               });
            doc.moveDown(0.5);
        });

        // Signatures
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('SIGNATURES', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#000000')
           .text('The Parties hereby agree to the terms and conditions set forth in this Agreement as demonstrated by their signatures below:');
        doc.moveDown(1);

        // Farmer's signature
        doc.text('Farmer\'s Signature: _______________')
           .text('Name: ' + signatures.farmer)
           .text('Date: ' + new Date(signatures.date).toLocaleDateString());
        doc.moveDown(1);

        // Customer's signature
        doc.text('Customer\'s Signature: _______________')
           .text('Name: ' + signatures.customer)
           .text('Date: ' + new Date(signatures.date).toLocaleDateString());
        doc.moveDown(1);

        // Footer
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#777777')
           .text('"This agreement is legally binding upon signing by both parties."', { align: 'center' });
        
        // Add page number at the bottom right
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#777777')
           .text(
               'Page 1 of 1',
               50,
               doc.page.height - 50,
               { align: 'right' }
           );

        // Finalize PDF
        doc.end();

        // Wait for the PDF to be written
        writeStream.on('finish', () => {
            res.status(201).json({
                success: true,
                contractId,
                message: 'Contract created successfully'
            });
        });

    } catch (error) {
        console.error('Error creating contract:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating contract: ' + error.message
        });
    }
});

// Get contract by ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { format } = req.query;
        const pdfPath = path.join(__dirname, '..', 'contracts', `${id}.pdf`);

        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Set response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        
        // Always set to inline for preview, unless explicitly requested as download
        if (format === 'download') {
            res.setHeader('Content-Disposition', `attachment; filename="Contract-${id}.pdf"`);
        } else {
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Cache-Control', 'no-cache');
        }
        
        // Stream the PDF file
        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);

        // Handle stream errors
        fileStream.on('error', (error) => {
            console.error('Error streaming PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Error streaming contract PDF'
            });
        });
    } catch (error) {
        console.error('Error retrieving contract:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving contract: ' + error.message
        });
    }
});

// Get all contracts
router.get('/', (req, res) => {
    try {
        const contractsDir = path.join(__dirname, '..', 'contracts');
        const contracts = [];

        if (fs.existsSync(contractsDir)) {
            fs.readdirSync(contractsDir)
                .filter(file => file.endsWith('.pdf'))
                .forEach(file => {
                    const stats = fs.statSync(path.join(contractsDir, file));
                    contracts.push({
                        id: file.replace('.pdf', ''),
                        createdAt: stats.birthtime
                    });
                });

            // Sort contracts by creation date (newest first)
            contracts.sort((a, b) => b.createdAt - a.createdAt);
        }

        res.json(contracts);
    } catch (error) {
        console.error('Error retrieving contracts:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving contracts list'
        });
    }
});

module.exports = router; 