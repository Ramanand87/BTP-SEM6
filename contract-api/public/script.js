document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contractForm');
    
    // Auto-generate Order ID
    const orderIdInput = document.getElementById('orderId');
    orderIdInput.value = 'ORD-' + Date.now().toString().slice(-6);
    
    // Auto-generate Contract ID
    const contractIdInput = document.getElementById('contractId');
    contractIdInput.value = 'CON-' + Date.now().toString().slice(-6);
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('orderDate').value = today;
    document.getElementById('contractStartDate').value = today;
    document.getElementById('agreementDate').value = today;
    
    // Calculate total amount when quantity or price changes
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('pricePerUnit');
    const totalInput = document.getElementById('totalAmount');
    
    function calculateTotal() {
        const quantity = parseFloat(quantityInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const total = quantity * price;
        totalInput.value = '₹' + total.toFixed(2);
        return total.toFixed(2);
    }
    
    quantityInput.addEventListener('input', calculateTotal);
    priceInput.addEventListener('input', calculateTotal);

    // Create modal for contract preview
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Contract Preview</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <object id="contract-preview" type="application/pdf" width="100%" height="600px">
                    <p>Unable to display PDF file. <a href="" target="_blank">Download</a> instead.</p>
                </object>
            </div>
            <div class="modal-footer">
                <button id="download-contract" class="action-button">Download PDF</button>
                <button id="print-contract" class="action-button">Print</button>
                <button id="close-preview" class="action-button secondary">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            overflow-y: auto;
        }
        .modal-content {
            background-color: white;
            margin: 2% auto;
            padding: 20px;
            width: 90%;
            max-width: 1000px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #2E7D32;
            padding-bottom: 10px;
        }
        .modal-header h2 {
            color: #2E7D32;
            margin: 0;
        }
        .close {
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #666;
        }
        .close:hover {
            color: #2E7D32;
        }
        .modal-body {
            margin-bottom: 20px;
            min-height: 600px;
        }
        .modal-footer {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .action-button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            background-color: #2E7D32;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        .action-button:hover {
            background-color: #1B5E20;
        }
        .action-button.secondary {
            background-color: #757575;
        }
        .action-button.secondary:hover {
            background-color: #616161;
        }
        #contract-preview {
            border: 1px solid #eee;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);

    // Get modal elements
    const closeBtn = modal.querySelector('.close');
    const downloadBtn = modal.querySelector('#download-contract');
    const printBtn = modal.querySelector('#print-contract');
    const closePreviewBtn = modal.querySelector('#close-preview');
    const contractPreview = modal.querySelector('#contract-preview');
    const previewLink = contractPreview.querySelector('a');

    // Close modal functions
    function closeModal() {
        modal.style.display = "none";
        contractPreview.data = "";
    }

    closeBtn.onclick = closeModal;
    closePreviewBtn.onclick = closeModal;
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Handle contract actions
    let currentContractId = null;

    downloadBtn.onclick = function() {
        if (currentContractId) {
            const downloadUrl = `/api/contracts/${currentContractId}?format=pdf`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `Contract-${currentContractId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    printBtn.onclick = function() {
        if (currentContractId) {
            window.open(`/api/contracts/${currentContractId}?format=pdf`, '_blank');
        }
    }
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check if terms are accepted
        if (!document.getElementById('termsCheck').checked) {
            alert('Please accept the terms and conditions');
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/contracts/create', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('Contract created successfully!');

                // Update preview and download link
                const previewUrl = result.pdfPath;
                contractPreview.data = previewUrl;
                previewLink.href = previewUrl;

                // Show modal
                modal.style.display = "block";
            } else {
                throw new Error(result.message || 'Failed to create contract');
            }
        } catch (error) {
            alert('Error creating contract: ' + error.message);
        }
    });
    
    // Reset form handler
    form.addEventListener('reset', function() {
        // Re-generate IDs after reset
        orderIdInput.value = 'ORD-' + Date.now().toString().slice(-6);
        contractIdInput.value = 'CON-' + Date.now().toString().slice(-6);
        document.getElementById('orderDate').value = today;
        document.getElementById('contractStartDate').value = today;
        document.getElementById('agreementDate').value = today;
        totalInput.value = '';
    });

    // Add additional conditions to terms and conditions
    const additionalConditionsInput = document.getElementById('additionalConditions');
    const addConditionButton = document.getElementById('addConditionButton');
    const termsContent = document.querySelector('.terms-content');

    addConditionButton.addEventListener('click', function() {
        const condition = additionalConditionsInput.value.trim();
        if (condition) {
            const conditionParagraph = document.createElement('p');
            conditionParagraph.textContent = condition;
            termsContent.appendChild(conditionParagraph);
            additionalConditionsInput.value = ''; // Clear the input box
        } else {
            alert('Please enter a valid condition.');
        }
    });
});