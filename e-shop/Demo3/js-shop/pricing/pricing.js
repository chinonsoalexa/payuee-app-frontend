const trialBadge = document.querySelector('.trial-badge');

trialBadge.addEventListener('click', () => {
  // Add tilt-shake class
  trialBadge.classList.add('tilt-shake');
  
  // Remove tilt-shake class after animation duration (0.5s here)
  setTimeout(() => {
    trialBadge.classList.remove('tilt-shake');
  }, 500);
});
