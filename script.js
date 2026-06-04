// Duty cards data for Phase 1: Venue Preparation
const dutyCards = [
    {
        id: 'card-1',
        text: 'Ensure the examination venue is prepared at least two days before the examination.',
        roles: ['chief-invigilator']
    },
    {
        id: 'card-2',
        text: 'Ensure the seating plan is displayed inside and outside the examination room.',
        roles: ['both-roles']
    },
    {
        id: 'card-3',
        text: 'Confirm the correct candidate-to-invigilator ratio of 1:30 is maintained.',
        roles: ['chief-invigilator']
    },
    {
        id: 'card-4',
        text: 'Check that all examination materials are present and accounted for.',
        roles: ['both-roles']
    },
    {
        id: 'card-5',
        text: 'Verify that the examination room meets health and safety requirements.',
        roles: ['chief-invigilator']
    },
    {
        id: 'card-6',
        text: 'Ensure that invigilators are briefed on their roles and responsibilities.',
        roles: ['chief-invigilator']
    },
    {
        id: 'card-7',
        text: 'Conduct a walkthrough of the examination venue.',
        roles: ['invigilator']
    },
    {
        id: 'card-8',
        text: 'Set up candidate desks and equipment.',
        roles: ['invigilator']
    }
];

let draggedCard = null;
let sourceZone = null;

// Initialize the activity
function init() {
    renderCardBank();
    setupDragAndDrop();
    setupTabNavigation();
}

// Render duty cards in the card bank
function renderCardBank() {
    const cardBank = document.getElementById('card-bank');
    cardBank.innerHTML = '';

    dutyCards.forEach(card => {
        const cardElement = createCardElement(card);
        cardBank.appendChild(cardElement);
    });
}

// Create a duty card element
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'duty-card';
    cardDiv.draggable = true;
    cardDiv.id = card.id;
    cardDiv.dataset.roles = card.roles.join(',');
    cardDiv.textContent = card.text;

    cardDiv.addEventListener('dragstart', handleDragStart);
    cardDiv.addEventListener('dragend', handleDragEnd);

    return cardDiv;
}

// Drag and Drop Event Handlers
function handleDragStart(e) {
    draggedCard = this;
    sourceZone = this.parentElement;
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

    // Get the target column role
    const column = this.closest('.column');
    const targetRole = column ? column.dataset.role : 'card-bank';
    const cardRoles = draggedCard.dataset.roles.split(',');

    // Check if card can be placed in this column
    if (targetRole === 'card-bank' || cardRoles.includes(targetRole)) {
        // Valid placement
        const cardClone = draggedCard.cloneNode(true);
        cardClone.addEventListener('dragstart', handleDragStart);
        cardClone.addEventListener('dragend', handleDragEnd);
        cardClone.classList.add('placed');
        this.appendChild(cardClone);

        // Remove from original position
        draggedCard.remove();

        // Show feedback
        showFeedback('Valid placement!', 'success', this);
    } else {
        // Invalid placement - return to bank
        draggedCard.classList.remove('placed');
        showFeedback('This card does not belong in this column. Returning to bank.', 'error', this);
    }

    draggedCard = null;
}

// Show feedback message
function showFeedback(message, type, element) {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
}

// Setup tab navigation
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const phaseId = tab.dataset.phase;

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all phase content
            document.querySelectorAll('.phase-content').forEach(content => {
                content.classList.remove('active');
            });
            // Show selected phase content
            document.getElementById(`phase-${phaseId}`).classList.add('active');
        });
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
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
