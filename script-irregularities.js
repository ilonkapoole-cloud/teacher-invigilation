// Irregularity examples data
const irregularityExamples = [
    {
        id: 'irreg-1',
        text: 'Possession of an unauthorised electronic device, such as a cellphone',
        category: 'candidate-misconduct'
    },
    {
        id: 'irreg-2',
        text: 'Copying from another candidate',
        category: 'candidate-misconduct'
    },
    {
        id: 'irreg-3',
        text: 'Receiving assistance from an invigilator or fellow candidate',
        category: 'candidate-misconduct'
    },
    {
        id: 'irreg-4',
        text: 'Possession of unauthorised material, such as crib notes',
        category: 'candidate-misconduct'
    },
    {
        id: 'irreg-5',
        text: 'Removal of an answer script from the examination venue',
        category: 'script-violations'
    },
    {
        id: 'irreg-6',
        text: 'Failure to batch scripts correctly',
        category: 'script-violations'
    },
    {
        id: 'irreg-7',
        text: 'Failure to submit answer scripts to the WCED within the required timeframe',
        category: 'script-violations'
    },
    {
        id: 'irreg-8',
        text: 'Candidate writes the incorrect question paper, subject, or level',
        category: 'script-violations'
    },
    {
        id: 'irreg-9',
        text: 'Tearing a page out of an answer book',
        category: 'candidate-administration'
    },
    {
        id: 'irreg-10',
        text: 'Arriving late within the first hour of the examination',
        category: 'candidate-administration'
    },
    {
        id: 'irreg-11',
        text: 'Arriving late after the first hour of the examination',
        category: 'candidate-administration'
    },
    {
        id: 'irreg-12',
        text: 'No admission letter or identification document',
        category: 'candidate-administration'
    },
    {
        id: 'irreg-13',
        text: 'Candidate\'s name not appearing on the mark sheet or Script Control Register',
        category: 'candidate-administration'
    },
    {
        id: 'irreg-14',
        text: 'Candidate writes at an incorrect examination centre',
        category: 'candidate-administration'
    },
    {
        id: 'irreg-15',
        text: 'Candidate writes an incorrect subject',
        category: 'candidate-administration'
    },
    {
        id: 'irreg-16',
        text: 'Candidate writes their name on the cover of the answer script',
        category: 'candidate-administration'
    },
    {
        id: 'irreg-17',
        text: 'Power outage or load shedding',
        category: 'venue-technical'
    },
    {
        id: 'irreg-18',
        text: 'Technical problems with examination equipment',
        category: 'venue-technical'
    }
];

let draggedCard = null;
let score = 0;

// Initialize the activity
function init() {
    renderCardBank();
    setupDragAndDrop();
    updateScore();
}

// Render irregularity cards in the card bank
function renderCardBank() {
    const cardBank = document.getElementById('card-bank');
    cardBank.innerHTML = '';

    irregularityExamples.forEach(example => {
        const cardElement = createCardElement(example);
        cardBank.appendChild(cardElement);
    });
}

// Create an irregularity card element
function createCardElement(example) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'irregularity-card';
    cardDiv.draggable = true;
    cardDiv.id = example.id;
    cardDiv.dataset.category = example.category;
    cardDiv.textContent = example.text;

    cardDiv.addEventListener('dragstart', handleDragStart);
    cardDiv.addEventListener('dragend', handleDragEnd);

    return cardDiv;
}

// Drag and Drop Event Handlers
function handleDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Setup drop zones
function setupDragAndDrop() {
    const dropZones = document.querySelectorAll('.droppable');

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (!draggedCard) return;

    // Get the target category
    const column = this.closest('.column');
    const targetCategory = column ? column.dataset.category : 'card-bank';
    const cardCategory = draggedCard.dataset.category;

    // Check if card can be placed in this column
    if (targetCategory === 'card-bank' || cardCategory === targetCategory) {
        // Valid placement
        const cardClone = draggedCard.cloneNode(true);
        cardClone.addEventListener('dragstart', handleDragStart);
        cardClone.addEventListener('dragend', handleDragEnd);
        cardClone.classList.add('placed');
        
        if (cardCategory === targetCategory) {
            cardClone.classList.add('correct');
            score++;
            showFeedback('Correct! ✓', 'success');
        } else {
            showFeedback('Correct placement!', 'success');
        }
        
        this.appendChild(cardClone);
        draggedCard.remove();
    } else {
        // Invalid placement - return to bank
        draggedCard.classList.remove('placed');
        showFeedback('Incorrect category. Try again!', 'error');
    }

    draggedCard = null;
    updateScore();
}

// Show feedback message
function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4caf50' : '#d32f2f'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2500);
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = irregularityExamples.length;
}

// Reset activity
function setupResetButton() {
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', () => {
        score = 0;
        renderCardBank();
        setupDragAndDrop();
        updateScore();
        
        // Clear all drop zones
        document.querySelectorAll('.column-body').forEach(column => {
            column.innerHTML = '';
        });
        
        showFeedback('Activity reset!', 'success');
    });
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        setupResetButton();
    });
} else {
    init();
    setupResetButton();
}