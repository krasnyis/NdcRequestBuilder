// NDC Request Templates
const NDC_TEMPLATES = {
    airShopping: {
        "AirShoppingRQ": {
            "Document": {
                "Name": "NDC AirShopping transaction",
                "ReferenceVersion": "1.0"
            },
            "Party": {
                "Sender": {
                    "TravelAgencySender": {
                        "Name": "TravelAgency",
                        "IATA_Number": "12345678"
                    }
                }
            },
            "CoreQuery": {
                "OriginDestinations": {
                    "OriginDestination": [
                        {
                            "Departure": {
                                "AirportCode": "JFK",
                                "Date": "2024-12-01"
                            },
                            "Arrival": {
                                "AirportCode": "LAX"
                            }
                        }
                    ]
                },
                "Travelers": {
                    "Traveler": [
                        {
                            "AnonymousTraveler": {
                                "PTC": "ADT"
                            }
                        }
                    ]
                }
            }
        }
    },
    flightPrice: {
        "FlightPriceRQ": {
            "Document": {
                "Name": "NDC FlightPrice transaction",
                "ReferenceVersion": "1.0"
            },
            "Party": {
                "Sender": {
                    "TravelAgencySender": {
                        "Name": "TravelAgency",
                        "IATA_Number": "12345678"
                    }
                }
            },
            "Query": {
                "Offer": {
                    "OfferID": "OFFER_ID_HERE",
                    "Owner": "AIRLINE_CODE"
                }
            }
        }
    },
    seatAvailability: {
        "SeatAvailabilityRQ": {
            "Document": {
                "Name": "NDC SeatAvailability transaction",
                "ReferenceVersion": "1.0"
            },
            "Party": {
                "Sender": {
                    "TravelAgencySender": {
                        "Name": "TravelAgency",
                        "IATA_Number": "12345678"
                    }
                }
            },
            "Query": {
                "FlightSegment": {
                    "Departure": {
                        "AirportCode": "JFK",
                        "Date": "2024-12-01"
                    },
                    "Arrival": {
                        "AirportCode": "LAX"
                    },
                    "MarketingCarrier": {
                        "AirlineID": "AA",
                        "FlightNumber": "100"
                    }
                }
            }
        }
    },
    orderCreate: {
        "OrderCreateRQ": {
            "Document": {
                "Name": "NDC OrderCreate transaction",
                "ReferenceVersion": "1.0"
            },
            "Party": {
                "Sender": {
                    "TravelAgencySender": {
                        "Name": "TravelAgency",
                        "IATA_Number": "12345678"
                    }
                }
            },
            "Query": {
                "OrderItems": {
                    "ShoppingResponse": {
                        "Owner": "AIRLINE_CODE",
                        "ResponseID": "RESPONSE_ID_HERE"
                    },
                    "OfferItem": {
                        "OfferItemID": "OFFER_ITEM_ID_HERE",
                        "Quantity": 1
                    }
                },
                "Travelers": {
                    "Traveler": [
                        {
                            "GivenName": "John",
                            "Surname": "Doe",
                            "PTC": "ADT"
                        }
                    ]
                }
            }
        }
    },
    orderRetrieve: {
        "OrderRetrieveRQ": {
            "Document": {
                "Name": "NDC OrderRetrieve transaction",
                "ReferenceVersion": "1.0"
            },
            "Party": {
                "Sender": {
                    "TravelAgencySender": {
                        "Name": "TravelAgency",
                        "IATA_Number": "12345678"
                    }
                }
            },
            "Query": {
                "Filters": {
                    "OrderID": "ORDER_ID_HERE"
                }
            }
        }
    }
};

// Application state
let currentRequestType = null;
let currentRequest = null;

// DOM elements
const requestTypeButtons = document.querySelectorAll('.request-type-btn');
const requestTitle = document.getElementById('request-title');
const requestInput = document.getElementById('request-input');
const responseOutput = document.getElementById('response-output');
const statusText = document.getElementById('status-text');
const requestInfo = document.getElementById('request-info');

// Action buttons
const newRequestBtn = document.getElementById('new-request-btn');
const loadRequestBtn = document.getElementById('load-request-btn');
const saveRequestBtn = document.getElementById('save-request-btn');
const sendRequestBtn = document.getElementById('send-request-btn');
const formatBtn = document.getElementById('format-btn');
const validateBtn = document.getElementById('validate-btn');

// Modal elements
const aboutModal = document.getElementById('about-modal');
const closeModal = document.querySelector('.close');

// Initialize the application
async function initializeApp() {
    try {
        // Load app version
        const version = await window.electronAPI.getAppVersion();
        const appName = await window.electronAPI.getAppName();
        
        document.getElementById('app-version').textContent = `v${version}`;
        document.getElementById('about-version').textContent = `Version ${version}`;
        
        updateStatus('Application loaded successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        updateStatus('Error loading application');
    }
}

// Event listeners for request type buttons
requestTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const requestType = button.dataset.type;
        selectRequestType(requestType);
    });
});

// Action button event listeners
newRequestBtn.addEventListener('click', createNewRequest);
loadRequestBtn.addEventListener('click', loadRequest);
saveRequestBtn.addEventListener('click', saveRequest);
sendRequestBtn.addEventListener('click', sendRequest);
formatBtn.addEventListener('click', formatJSON);
validateBtn.addEventListener('click', validateJSON);

// Modal event listeners
closeModal.addEventListener('click', () => {
    aboutModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === aboutModal) {
        aboutModal.style.display = 'none';
    }
});

// Menu event listeners
window.electronAPI.onMenuNewRequest(() => createNewRequest());
window.electronAPI.onMenuOpenRequest(() => loadRequest());
window.electronAPI.onMenuSaveRequest(() => saveRequest());
window.electronAPI.onMenuAbout(() => {
    aboutModal.style.display = 'block';
});

// Request type selection
function selectRequestType(requestType) {
    currentRequestType = requestType;
    
    // Update UI
    requestTypeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-type="${requestType}"]`).classList.add('active');
    
    // Update title
    const titles = {
        airShopping: 'Air Shopping Request',
        flightPrice: 'Flight Price Request',
        seatAvailability: 'Seat Availability Request',
        orderCreate: 'Order Create Request',
        orderRetrieve: 'Order Retrieve Request'
    };
    
    requestTitle.textContent = titles[requestType] || 'Unknown Request Type';
    
    // Load template
    if (NDC_TEMPLATES[requestType]) {
        const template = JSON.stringify(NDC_TEMPLATES[requestType], null, 2);
        requestInput.value = template;
        currentRequest = NDC_TEMPLATES[requestType];
        updateRequestInfo();
        updateStatus(`Loaded ${titles[requestType]} template`);
    }
}

// Create new request
function createNewRequest() {
    requestInput.value = '';
    responseOutput.innerHTML = '<div class="placeholder">Response will appear here after sending the request</div>';
    currentRequest = null;
    currentRequestType = null;
    
    // Clear active request type
    requestTypeButtons.forEach(btn => btn.classList.remove('active'));
    requestTitle.textContent = 'Select a Request Type';
    
    updateRequestInfo();
    updateStatus('New request created');
}

// Load request (placeholder - would integrate with file system)
function loadRequest() {
    // This would typically open a file dialog
    updateStatus('Load request functionality - to be implemented');
}

// Save request (placeholder - would integrate with file system)
function saveRequest() {
    if (!requestInput.value.trim()) {
        updateStatus('No request to save');
        return;
    }
    
    // This would typically open a save dialog
    updateStatus('Save request functionality - to be implemented');
}

// Send request
async function sendRequest() {
    const requestData = requestInput.value.trim();
    
    if (!requestData) {
        updateStatus('No request to send');
        return;
    }
    
    try {
        // Parse JSON to validate
        const parsedRequest = JSON.parse(requestData);
        
        updateStatus('Sending request...');
        
        // Send request via IPC
        const result = await window.electronAPI.processNdcRequest(parsedRequest);
        
        if (result.success) {
            displayResponse(result.data, 'success');
            updateStatus('Request sent successfully');
        } else {
            displayResponse({ error: result.error }, 'error');
            updateStatus('Request failed');
        }
    } catch (error) {
        displayResponse({ error: 'Invalid JSON format' }, 'error');
        updateStatus('Invalid JSON format');
    }
}

// Format JSON
function formatJSON() {
    try {
        const parsed = JSON.parse(requestInput.value);
        requestInput.value = JSON.stringify(parsed, null, 2);
        updateStatus('JSON formatted');
    } catch (error) {
        updateStatus('Invalid JSON - cannot format');
    }
}

// Validate JSON
function validateJSON() {
    try {
        JSON.parse(requestInput.value);
        updateStatus('JSON is valid');
        displayResponse({ message: 'JSON is valid ✓' }, 'success');
    } catch (error) {
        updateStatus('Invalid JSON');
        displayResponse({ error: `JSON validation error: ${error.message}` }, 'error');
    }
}

// Display response
function displayResponse(data, type = 'success') {
    const className = type === 'success' ? 'response-success' : 'response-error';
    const formattedData = JSON.stringify(data, null, 2);
    
    responseOutput.innerHTML = `<pre class="${className}">${formattedData}</pre>`;
}

// Update status
function updateStatus(message) {
    statusText.textContent = message;
    setTimeout(() => {
        statusText.textContent = 'Ready';
    }, 3000);
}

// Update request info
function updateRequestInfo() {
    if (currentRequestType) {
        requestInfo.textContent = `Request Type: ${currentRequestType}`;
    } else {
        requestInfo.textContent = '';
    }
}

// Handle input changes
requestInput.addEventListener('input', () => {
    try {
        currentRequest = JSON.parse(requestInput.value);
    } catch (error) {
        // Invalid JSON, but don't show error until user tries to send
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);