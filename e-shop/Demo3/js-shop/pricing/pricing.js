const header = document.querySelector('.secondary-sticky-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const footerOffset = document.querySelector('footer').offsetTop; // Adjust to footer position
  const headerHeight = document.querySelector('.main-header').offsetHeight;

  if (scrollY > lastScrollY && scrollY + window.innerHeight < footerOffset) {
    // Scrolling down and not yet at the footer
    header.style.position = 'fixed';
    header.style.top = `${headerHeight}px`; // Stay below the main header
  } else if (scrollY <= headerHeight) {
    // Near the top, reset position
    header.style.position = 'static';
  } else if (scrollY < lastScrollY) {
    // Scrolling up, return to static as you move upwards
    header.style.position = 'static';
  }

  lastScrollY = scrollY;
});
