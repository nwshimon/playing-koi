// ---- Color scheme switch on scroll ----
// Inspired by scroll-based theming patterns:
// https://css-tricks.com/dark-modes-with-css/
const header = document.getElementById('main-header');
const hero = document.getElementById('section-1');

// only apply scroll color switch on pages that have the hero
if (hero) {
    const SWITCH_POINT = window.innerHeight * 0.8;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        header.classList.toggle('scrolled', scrollY > 60);
        document.body.classList.toggle('scheme-light', scrollY > SWITCH_POINT);
    });
}