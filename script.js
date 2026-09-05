const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => (
  `frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
)

const images = [];

// Preload all images and store in an array for zero-delay drawing
const preloadImages = () => {
  for (let i = 0; i < frameCount; i++) {
    images[i] = new Image();
    images[i].src = currentFrame(i);
  }
};

preloadImages();

// Initial draw once the first image is loaded
images[0].onload = function () {
  canvas.width = images[0].width;
  canvas.height = images[0].height;
  context.drawImage(images[0], 0, 0);
}

// Function to draw specific frame
const updateImage = index => {
  if (images[index] && images[index].complete) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index], 0, 0);
  }
}

// Map scroll to frame index
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const wrapper = document.getElementById('animation-wrapper');
  const maxScrollTop = wrapper ? (wrapper.scrollHeight - window.innerHeight) : (document.documentElement.scrollHeight - window.innerHeight);
  const scrollFraction = scrollTop / maxScrollTop;

  // Calculate exact frame index based on scroll progress up to 85%
  const animationFraction = Math.max(0, Math.min(1, scrollFraction / 0.85));
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(animationFraction * frameCount)
  );

  // Use requestAnimationFrame for smooth, tear-free rendering
  requestAnimationFrame(() => {
    updateImage(frameIndex);

    const heroText = document.getElementById('hero-text');
    if (heroText) {
      if (scrollFraction <= 0.25) {
        heroText.style.opacity = 1;
      } else if (scrollFraction <= 0.35) {
        heroText.style.opacity = 1 - ((scrollFraction - 0.25) / 0.10);
      } else {
        heroText.style.opacity = 0;
      }
    }

    // Toggle header text color when scrolling past the animation slide
    const mainEl = document.querySelector('main');
    const headerEl = document.querySelector('header');
    if (mainEl && headerEl) {
      const isDarkSection = mainEl.getBoundingClientRect().top <= headerEl.offsetHeight;
      
      // Only update DOM if state changed to avoid flicker and layout thrashing
      if (window._headerDarkState !== isDarkSection) {
        window._headerDarkState = isDarkSection;
        
        const headerLogo = document.getElementById('header-logo-text');
        const navLinks = document.querySelectorAll('.nav-link');
        const personBg = document.getElementById('header-person-bg');
        const personIcon = document.getElementById('header-person-icon');
        
        if (isDarkSection) {
          // Scrolled past animation - change to white text theme
          if (headerLogo) {
            headerLogo.classList.remove('text-black');
            headerLogo.classList.add('text-white');
          }
          navLinks.forEach(link => {
            link.classList.remove('text-black', 'hover:text-gray-800');
            link.classList.add('text-white', 'hover:text-gray-300');
          });
          if (personBg && personIcon) {
            personBg.classList.remove('bg-primary', 'border-transparent');
            personBg.classList.add('bg-surface-container-high', 'border-outline-variant/30');
            personIcon.classList.remove('text-black');
            personIcon.classList.add('text-white');
          }
        } else {
          // In animation section - keep black text theme
          if (headerLogo) {
            headerLogo.classList.remove('text-white');
            headerLogo.classList.add('text-black');
          }
          navLinks.forEach(link => {
            link.classList.remove('text-white', 'hover:text-gray-300');
            link.classList.add('text-black', 'hover:text-gray-800');
          });
          if (personBg && personIcon) {
            personBg.classList.remove('bg-surface-container-high', 'border-outline-variant/30');
            personBg.classList.add('bg-primary', 'border-transparent');
            personIcon.classList.remove('text-white');
            personIcon.classList.add('text-black');
          }
        }
      }
    }
  });
});
