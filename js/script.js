// ---- Color scheme switch on scroll ----
// Inspired by scroll-based theming patterns:
// https://css-tricks.com/dark-modes-with-css/
const header = document.getElementById('main-header');
const SWITCH_POINT = window.innerHeight * 0.8;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Shrink header padding on scroll
    header.classList.toggle('scrolled', scrollY > 60);

    // Switch color scheme after scrolling past the hero
    document.body.classList.toggle('scheme-light', scrollY > SWITCH_POINT);
});

// ---- Lightbox / video modal ----
// Focus management and focus trap based on W3C ARIA dialog pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
const modal = document.getElementById('lightbox-modal');
const modalVideoContainer = document.getElementById('modal-video-container');
const modalClose = document.getElementById('modal-close');

// Track the trigger element so focus can return to it on close
let lastFocusedItem = null;

document.querySelectorAll('.lightbox-item').forEach(item => {
    item.addEventListener('click', () => openModal(item));

    // Keyboard support: Enter and Space activate the button role
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(item);
        }
    });
});

function openModal(triggerEl) {
    const videoId = triggerEl.dataset.videoId;
    lastFocusedItem = triggerEl;

    // Replace innerHTML with a real YouTube or Google Drive iframe embed:
    // YouTube:      https://www.youtube.com/embed/VIDEO_ID
    // Google Drive: https://drive.google.com/file/d/FILE_ID/preview
    modalVideoContainer.innerHTML = `
        <div style="
            width:100%; height:100%;
            background:#111;
            border-radius:12px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-family:'Urbanist',sans-serif;
            flex-direction:column;
            gap:1rem;
            aspect-ratio:16/9;
        ">
            <p style="font-size:1rem;opacity:0.7;">Replace with iframe embed</p>
            <code style="font-size:0.8rem;opacity:0.5;background:rgba(255,255,255,0.1);padding:0.4rem 0.8rem;border-radius:6px;">
                data-video-id: ${videoId}
            </code>
        </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Move focus into modal for keyboard/screen reader users
    modalClose.focus();

    modal.addEventListener('keydown', trapFocus);
}

modalClose.addEventListener('click', closeModal);

// Close on backdrop click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close on Escape key — standard modal behavior per ARIA spec
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

function closeModal() {
    modal.classList.remove('open');
    modalVideoContainer.innerHTML = '';
    document.body.style.overflow = '';
    modal.removeEventListener('keydown', trapFocus);

    // Return focus to the element that opened the modal
    if (lastFocusedItem) lastFocusedItem.focus();
}

// Focus trap: keeps Tab/Shift+Tab cycling within the modal
// Technique from W3C ARIA Authoring Practices Guide:
// https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}