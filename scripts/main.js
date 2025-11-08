// Page Loader
window.addEventListener('load', () => {
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 500);
  }
});

// Countdown Timer Function
function initializeCountdown(targetDate, containerId, onExpire) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const daysElement = container.querySelector('[data-days]');
  const hoursElement = container.querySelector('[data-hours]');
  const minutesElement = container.querySelector('[data-minutes]');
  const secondsElement = container.querySelector('[data-seconds]');

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // Countdown expired
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      
      container.closest('.countdown-card, .countdown-card-small, .countdown-banner')?.classList.add('countdown-expired');
      
      if (onExpire) {
        onExpire();
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');

    // Add animation on update
    [daysElement, hoursElement, minutesElement, secondsElement].forEach(el => {
      el.style.transform = 'scale(1.1)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 200);
    });
  }

  // Update immediately and then every second
  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);

  // Clear interval when countdown expires
  const checkExpired = setInterval(() => {
    const now = new Date().getTime();
    if (targetDate - now < 0) {
      clearInterval(interval);
      clearInterval(checkExpired);
    }
  }, 1000);
}

// Initialize Countdown Timers
document.addEventListener('DOMContentLoaded', () => {
  // Early-Bird Deadline: 30 days before cohort starts (26 January 2026)
  const cohortStartDate = new Date('2026-01-26T00:00:00');
  const earlyBirdDeadline = new Date(cohortStartDate);
  earlyBirdDeadline.setDate(earlyBirdDeadline.getDate() - 30); // 30 days before
  
  // Registration Deadline: 7 days before cohort starts
  const registrationDeadline = new Date(cohortStartDate);
  registrationDeadline.setDate(registrationDeadline.getDate() - 7); // 7 days before

  // Early-Bird Countdown (Hero Section)
  initializeCountdown(earlyBirdDeadline.getTime(), 'earlyBirdCountdown', () => {
    const container = document.getElementById('earlyBirdCountdown');
    if (container) {
      const card = container.closest('.countdown-card');
      if (card) {
        card.querySelector('.countdown-title').textContent = 'Early-Bird Registration Has Ended';
      }
    }
  });

  // Registration Countdown (Sidebar)
  initializeCountdown(registrationDeadline.getTime(), 'registrationCountdown', () => {
    const container = document.getElementById('registrationCountdown');
    if (container) {
      const card = container.closest('.countdown-card-small');
      if (card) {
        const header = card.querySelector('.countdown-header-small span');
        if (header) {
          header.textContent = 'Registration Closed';
        }
      }
    }
  });

});

// Progress bar and header scroll effect
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
  
  // Scroll to top button
  const scrollBtn = document.getElementById('scrollTop');
  if (winScroll > 300) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
  
  // Header scroll effect
  const header = document.querySelector('.enhanced-header');
  if (header) {
    if (winScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Active navigation link based on scroll position
  updateActiveNavLink();
});

// Update active navigation link
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const header = document.querySelector('.enhanced-header');
  const headerHeight = header ? header.offsetHeight : 100;
  
  let current = '';
  const scrollPosition = window.pageYOffset + headerHeight + 50;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}` || (href === '#apply' && current === 'home')) {
      link.classList.add('active');
    }
  });
}

// Scroll to top
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (menuClose && mobileMenu) {
  menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close mobile menu when clicking links
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Close mobile menu when clicking outside
if (mobileMenu) {
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Form submission with loading states
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
  submitBtn.addEventListener('click', function() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const country = document.getElementById('countryInput').value;
    const form = document.querySelector('form');
    
    if (!name || !email || !country) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Add loading state
    const originalText = this.innerHTML;
    this.classList.add('btn-loading');
    this.disabled = true;
    this.innerHTML = 'Submitting';
    
    if (form) {
      form.classList.add('form-loading');
    }
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      // Remove loading state
      this.classList.remove('btn-loading');
      this.disabled = false;
      
      if (form) {
        form.classList.remove('form-loading');
      }
      
      // Success animation
      const checkIcon = '<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      this.innerHTML = checkIcon + 'Submitted!';
      this.style.background = '#0f9d58';
      
      setTimeout(() => {
        alert('Thanks, ' + name + '! Your expression of interest has been received. We\'ll contact you at ' + email + ' with next steps.');
        
        // Reset form
        if (form) {
          form.reset();
        }
        this.innerHTML = originalText;
        this.style.background = '';
      }, 1000);
    }, 2000); // Simulate 2 second API call
  });
}

// Show skeleton screens while content loads
function showSkeletonScreen(element) {
  if (element && !element.classList.contains('skeleton-loaded')) {
    element.classList.add('skeleton');
    element.style.minHeight = '200px';
  }
}

function hideSkeletonScreen(element) {
  if (element) {
    element.classList.remove('skeleton');
    element.classList.add('skeleton-loaded');
  }
}

// Progress indicator for multi-step processes
function createProgressIndicator(steps, currentStep, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-indicator';
  
  const progressFill = document.createElement('div');
  progressFill.className = 'progress-bar-indicator';
  const progressPercentage = (currentStep / steps) * 100;
  progressFill.style.width = progressPercentage + '%';
  
  progressBar.appendChild(progressFill);
  container.appendChild(progressBar);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const header = document.querySelector('.enhanced-header');
      const headerHeight = header ? header.offsetHeight : 100;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  });
});

// Add entrance animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Input validation feedback
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
  input.addEventListener('blur', function() {
    if (this.value.trim() === '' && this.id !== 'roleSelect') {
      this.style.borderColor = '#f87171';
    } else if (this.type === 'email' && this.value) {
      if (!/\S+@\S+\.\S+/.test(this.value)) {
        this.style.borderColor = '#f87171';
      } else {
        this.style.borderColor = '#0f9d58';
      }
    } else if (this.value) {
      this.style.borderColor = '#0f9d58';
    }
  });
  
  input.addEventListener('focus', function() {
    this.style.borderColor = '#0f9d58';
  });
});

// Add counter animation for stats
const animateCount = (element, target) => {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 20);
};

// Trigger count animation when stat cards are visible
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const numberElement = entry.target.querySelector('.text-lg');
      const text = numberElement.textContent;
      if (text.includes('+')) {
        const num = parseInt(text);
        numberElement.textContent = '0';
        animateCount(numberElement, num);
        entry.target.dataset.animated = 'true';
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
  statObserver.observe(card);
});

