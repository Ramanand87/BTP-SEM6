const express = require('express');
const PDFDocument = require('pdfkit');
const multer = require('multer');

const router = express.Router();

// Configure multer for signature image uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory instead of disk
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

function generateContractPDF(contractData, res) {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${contractData.contractId}.pdf"`);
    doc.pipe(res);

    // Function to add a styled paragraph
    function addParagraph(text, options = {}) {
        const {
            fontSize = 12,
            font = 'Helvetica',
            align = 'left',
            underline = false,
            indent = 0,
            lineGap = 5,
            characterSpacing = 0
        } = options;

        doc.font(font).fontSize(fontSize).text(text, {
            align,
            underline,
            indent,
            lineGap,
            characterSpacing
        });
    }

    // Title
    doc.font('Helvetica-Bold').fontSize(18).text('Agricultural Sales Contract', { align: 'center' });
    doc.moveDown(1);

    // 1. Parties Involved
    addParagraph('1. Parties Involved:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });
    addParagraph(`  * Farmer:`, { fontSize: 12, indent: 10 });
    addParagraph(`    * Name: ${contractData.farmerName}`, { fontSize: 12, indent: 20 });
    addParagraph(`    * Address: ${contractData.farmerAddress}`, { fontSize: 12, indent: 20 });
    addParagraph(`    * Contact Number: ${contractData.farmerContact}`, { fontSize: 12, indent: 20 });
    addParagraph(`  * Customer:`, { fontSize: 12, indent: 10 });
    addParagraph(`    * Name: ${contractData.customerName}`, { fontSize: 12, indent: 20 });
    addParagraph(`    * Address: ${contractData.customerAddress}`, { fontSize: 12, indent: 20 });
    addParagraph(`    * Contact Number: ${contractData.customerContact}`, { fontSize: 12, indent: 20 });
    doc.moveDown(1);

    // 2. Order and Contract Details
    addParagraph('2. Order and Contract Details:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });
    addParagraph(`  * Order ID: ${contractData.orderId}`, { fontSize: 12, indent: 10 });
    addParagraph(`  * Order Date: ${contractData.orderDate}`, { fontSize: 12, indent: 10 });
    addParagraph(`  * Contract ID: ${contractData.contractId}`, { fontSize: 12, indent: 10 });
    addParagraph(`  * Contract Date: ${contractData.contractStartDate}`, { fontSize: 12, indent: 10 });
    addParagraph(`  * Agreement Date: ${contractData.agreementDate}`, { fontSize: 12, indent: 10 });
    doc.moveDown(1);

    // 3. Crop Details
    addParagraph('3. Crop Details:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });
    addParagraph(`  * Crop Name: ${contractData.cropName}`, { fontSize: 12, indent: 10 });
    addParagraph(`  * Quantity: ${contractData.quantity} kg`, { fontSize: 12, indent: 10 });
    addParagraph(`  * Price per kg: ₹${contractData.pricePerUnit}`, { fontSize: 12, indent: 10 });
    addParagraph(`  * Total Amount: ₹${contractData.totalAmount}`, { fontSize: 12, indent: 10 });
    doc.moveDown(1);

    // 4. Delivery Details
    addParagraph('4. Delivery Details:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });
    addParagraph(`  * Delivery Date: ${contractData.deliveryDate}`, { fontSize: 12, indent: 10 });
    addParagraph(`  * Delivery Location: ${contractData.deliveryLocation}`, { fontSize: 12, indent: 10 });
    doc.moveDown(1);

    // 5. Terms and Conditions
    addParagraph('5. Terms and Conditions:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });

    const terms = [
        `5.1 Payment Terms: The Customer shall make full payment to the Farmer upon delivery and acceptance of the Crop at the Delivery Location. Payment shall be made in ${contractData.paymentMethod || 'Bank Transfer'} unless otherwise agreed in writing.`,
        `5.2 Quality Compliance: The Farmer warrants that the Crop shall be of good quality, merchantable, and fit for the intended purpose as communicated by the Customer. Specific quality standards are defined as: ${contractData.qualityStandards || 'Grade A as per AGMARK standards'}. The Customer shall have the right to inspect the Crop upon delivery and may reject any Crop that does not conform to the agreed-upon quality standards.`,
        `5.3 Delivery Terms:
    * The Farmer shall deliver the Crop to the Delivery Location on the Delivery Date during the hours of ${contractData.deliveryHours || '9:00 AM to 5:00 PM'}.
    * The Farmer shall provide the Customer with ${contractData.noticeDays || '3'} days' prior written notice of any anticipated delay in delivery. If the delay exceeds ${contractData.delayDays || '7'} days, the Customer shall have the option to terminate this Contract and receive a full refund of any payments made.
    * The Customer shall be responsible for providing access to the Delivery Location and for unloading the Crop.`,
        `5.4 Force Majeure: Neither party shall be liable for any failure or delay in the performance of its obligations under this Contract to the extent such failure or delay is caused by a Force Majeure Event. A "Force Majeure Event" means any event beyond the reasonable control of a party, including but not limited to acts of God, natural disasters, war, terrorism, government regulations, strikes, and other labor disputes. The affected party shall notify the other party in writing of the Force Majeure Event and shall make all reasonable efforts to mitigate its effects. If the Force Majeure Event continues for more than ${contractData.forceMajeureDays || '30'} days, either party may terminate this Contract upon written notice to the other party.`,
        `5.5 Dispute Resolution:
    * Any dispute, claim, or controversy arising out of or relating to this Contract shall be resolved through amicable negotiation between the parties.
    * If the parties are unable to resolve the dispute through negotiation within ${contractData.negotiationDays || '15'} days, either party may initiate mediation in ${contractData.mediationLocation || 'Pune, Maharashtra'}. The mediation shall be conducted in accordance with the rules of ${contractData.mediationOrganization || 'the Indian Council of Arbitration'}.
    * If mediation is unsuccessful, the dispute shall be finally resolved by binding arbitration in accordance with the ${contractData.arbitrationAct || 'the Arbitration and Conciliation Act, 1996 (India)'} in ${contractData.arbitrationLocation || 'Pune, Maharashtra'}. The language of the arbitration shall be ${contractData.arbitrationLanguage || 'English'}. The decision of the arbitrator shall be final and binding on both parties.`,
        `5.6 Additional Conditions: ${contractData.additionalConditions || 'None'}`,
        `${contractData.additionalCondition6 ? `5.7  ${contractData.additionalCondition6}` : ''}`,
        `5.8 Inspection: The Customer has the right to inspect the goods upon delivery. Acceptance of the goods implies the Customer's satisfaction with the quality and quantity of the delivered items.`,
        `5.9 Indemnification: The Farmer agrees to indemnify and hold the Customer harmless from any and all claims, losses, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to any breach by the Farmer of any of its obligations or warranties under this Contract.`,
        `5.10 Governing Law: This Contract shall be governed by and construed in accordance with the laws of India.`,
    ];

    terms.forEach(term => addParagraph(term, { fontSize: 12, indent: 10, lineGap: 5 }));
    doc.moveDown();

    // 6. Additional Conditions Section
    addParagraph('6. Additional Conditions:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });
    if (contractData.additionalConditions && contractData.additionalConditions.trim() !== '') {
        addParagraph(contractData.additionalConditions, { fontSize: 12, indent: 10, lineGap: 5 });
    } else {
        addParagraph('No additional condition provided for this agreement.', { fontSize: 12, indent: 10, lineGap: 5 });
    }
    doc.moveDown(1);

    // 7. Signatures
    addParagraph('7. Signatures:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });
    doc.moveDown();

    // Function to add signature with label
    function addSignature(label, signatureBuffer, name, date) {
        addParagraph(label, { fontSize: 12 });
        if (signatureBuffer) {
            try {
                doc.image(signatureBuffer, { fit: [150, 50], align: 'left' });
            } catch (error) {
                console.error("Error embedding signature image:", error);
                addParagraph("[Signature Image Could Not Be Displayed]", { fontSize: 10, font: 'Helvetica-Oblique' });
            }
        } else {
            doc.rect(50, doc.y, 150, 50).stroke();
        }
        addParagraph(`Printed Name: ${name}`, { fontSize: 10, indent: 50 });
        addParagraph(`Date: ${date}`, { fontSize: 10, indent: 50 });
        doc.moveDown(1);
    }

    addSignature("Farmer's Signature:", contractData.farmerSignatureBuffer, contractData.farmerName, contractData.agreementDate);
    addSignature("Customer's Signature:", contractData.customerSignatureBuffer, contractData.customerName, contractData.agreementDate);

    // 8. Entire Agreement
    addParagraph('8. Entire Agreement:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });
    addParagraph('This Contract constitutes the entire agreement between the parties and supersedes all prior or contemporaneous communications and proposals, whether oral or written, between the parties with respect to the subject matter of this Contract.', { fontSize: 12, indent: 0 });
    doc.moveDown(1);

    // 9. Severability
    addParagraph('9. Severability:', { fontSize: 14, font: 'Helvetica-Bold', underline: true });
    addParagraph('If any provision of this Contract is held to be invalid, illegal, or unenforceable, the remaining provisions of this Contract shall remain in full force and effect.', { fontSize: 12, indent: 0 });

    // Finalize the PDF
    doc.end();
}

router.post('/create', upload.fields([
    { name: 'farmerSignature', maxCount: 1 },
    { name: 'customerSignature', maxCount: 1 }
]), (req, res) => {
    try {
        const contractData = req.body;

        // Use the buffer property of the uploaded files directly
        const farmerSignatureBuffer = req.files?.farmerSignature?.[0]?.buffer;
        const customerSignatureBuffer = req.files?.customerSignature?.[0]?.buffer;

        if (!farmerSignatureBuffer || !customerSignatureBuffer) {
            return res.status(400).json({ success: false, message: 'Missing signature images' });
        }

        contractData.farmerSignatureBuffer = farmerSignatureBuffer;
        contractData.customerSignatureBuffer = customerSignatureBuffer;

        // Combine additional conditions.
        const additionalConditions = contractData.additionalConditions || '';
        const additionalCondition6 = contractData.additionalCondition6 || '';

        contractData.additionalConditions = additionalConditions;
        contractData.additionalCondition6 = additionalCondition6;

        // Basic Validation: Check for required data
        if (!contractData.farmerName || !contractData.customerName || !contractData.cropName || !contractData.quantity || !contractData.pricePerUnit || !contractData.totalAmount || !contractData.deliveryDate || !contractData.deliveryLocation || !contractData.agreementDate) {
            return res.status(400).json({ success: false, message: 'Missing required contract data.' });
        }

        generateContractPDF(contractData, res);
    } catch (error) {
        console.error("Error in /create route:", error);
        res.status(500).json({ success: false, message: 'Failed to generate contract PDF: ' + error.message });
    }
});

module.exports = router;

