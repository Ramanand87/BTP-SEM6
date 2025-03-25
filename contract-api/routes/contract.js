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
            customerName,
            productDetails,
            deliveryDate,
            deliveryLocation,
            signatures
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

        // Helper function to draw a horizontal line
        function drawLine() {
            doc.moveDown(0.5);
            doc.moveTo(50, doc.y)
               .lineTo(doc.page.width - 50, doc.y)
               .stroke();
            doc.moveDown(0.5);
        }

        // Title
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('Contract Agreement', { align: 'center' });
        doc.moveDown(0.5);

        // Contract ID and Date
        doc.fontSize(10)
           .font('Helvetica')
           .text(`Contract ID: ${contractId}`)
           .text(`Date: ${new Date(orderDate).toLocaleDateString()}`);
        
        drawLine();

        // Parties Involved
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text('Parties Involved');
        doc.fontSize(10)
           .font('Helvetica')
           .text(`Farmer: ${farmerName}`)
           .text(`Customer: ${customerName}`);
        
        drawLine();

        // Product Details
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text('Product Details');
        doc.fontSize(10)
           .font('Helvetica')
           .text(`Crop Name: ${productDetails.cropName || 'Not specified'}`)
           .text(`Quantity: ${productDetails.quantity} kg`)
           .text(`Price per unit: ₹${productDetails.price}`)
           .text(`Total Amount: ₹${productDetails.totalAmount}`)
           .text(`Delivery Date: ${new Date(deliveryDate).toLocaleDateString()}`)
           .text(`Delivery Location: ${deliveryLocation}`);
        
        drawLine();

        // Terms and Conditions
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text('Terms and Conditions');
        doc.fontSize(10)
           .font('Helvetica');

        const terms_list = [
            'Payment Terms: Payment will be made within 7 days of successful delivery and quality check.',
            'Quality Compliance: The produce must meet the agreed quality standards; failure to comply may lead to rejection or reduced payment.',
            'Delivery Terms: The farmer is responsible for delivering the produce to the agreed location on the specified date.',
            'Force Majeure Clause: Neither party shall be held responsible for delays due to natural disasters, strikes, or other unforeseen events.',
            'Dispute Resolution: Any disputes arising will be resolved through arbitration or local governing bodies.',
            'Cancellation Policy: Either party may cancel the contract with 15 days\' notice, subject to applicable penalties.',
            'Confidentiality: Personal and business details will be kept confidential and not shared with third parties without consent.',
            'Liability Clause: Both parties agree that liability for non-performance shall not exceed the agreed contract value.',
            'Legal Jurisdiction: Any legal disputes will be subject to the jurisdiction of the local court.',
            'Electronic Agreement: This contract can be signed digitally and holds the same legal value as a physical signature.'
        ];

        terms_list.forEach((term, index) => {
            doc.text(`• ${term}`, {
                indent: 20,
                align: 'left',
                lineGap: 5
            });
        });
        
        drawLine();

        // Signatures
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text('Signatures');
        doc.moveDown();

        // Farmer's signature
        doc.fontSize(10)
           .font('Helvetica')
           .text('Farmer\'s Signature:')
           .text(`Name: ${signatures.farmer}`)
           .text(`Date: ${new Date(signatures.date).toLocaleDateString()}`);
        doc.moveDown();

        // Customer's signature
        doc.text('Company Representative\'s Signature:')
           .text(`Name: ${signatures.customer}`)
           .text(`Date: ${new Date(signatures.date).toLocaleDateString()}`);

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