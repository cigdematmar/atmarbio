document.addEventListener('DOMContentLoaded', function () {
  // ====================
  // SIDEBAR FUNCTIONALITY
  // ====================
  const menuIcon = document.querySelector('.nav__menu-icon');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const closeIcon = document.querySelector('.sidebar__close');

  if (menuIcon && sidebar && sidebarOverlay && closeIcon) {
    menuIcon.addEventListener('click', () => {
      sidebar.classList.add('open');
      sidebarOverlay.classList.add('open');
    });

    closeIcon.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('open');
    });

    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('open');
    });
  }

  // ====================
  // PETFOOD PAGE LOGIC
  // ====================
  // Skip single-section logic on pages that define their own multi-section handling
  if (!document.body.classList.contains('multi-section-page')) {
  const categoryCards = document.querySelectorAll('.usage-card');
  const flavourItems = document.querySelectorAll('.flavour-item');
  const button = document.querySelector('.send-button');
  const popupOverlay = document.querySelector('.popup-overlay');
  const popupForm = document.getElementById('popupForm');
  const selectedCategoryDiv = document.getElementById('selectedCategory');
  const selectedFlavoursDiv = document.getElementById('selectedFlavours');

  let selectedCategory = "";
  let selectedCount = 0;

  // ✅ Category Selection
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      categoryCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      selectedCategory = card.getAttribute('data-name') || "";
    });
  });

  // ✅ Flavour Selection
  flavourItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('selected')) {
        item.classList.remove('selected');
        selectedCount--;
      } else {
        if (selectedCount < 5) {
          item.classList.add('selected');
          selectedCount++;
        } else {
          alert('You can select up to 5 flavours only.');
        }
      }

      if (button) {
        button.disabled = selectedCount === 0;
        button.classList.toggle('active', selectedCount > 0);
      }
    });
  });

  // ✅ Show Popup on Send
  if (button) {
    button.addEventListener('click', () => {
      if (!selectedCategory) {
        alert("Please select a category first.");
        return;
      }

      if (selectedCategoryDiv) {
        selectedCategoryDiv.innerText = selectedCategory;
      }

      const selectedFlavours = Array.from(document.querySelectorAll('.flavour-item.selected'))
        .map(el => el.textContent.trim());

      if (selectedFlavoursDiv) {
        selectedFlavoursDiv.innerHTML = "";
        const fragment = document.createDocumentFragment();
        selectedFlavours.forEach(flavour => {
          const span = document.createElement('span');
          span.innerText = flavour;
          fragment.appendChild(span);
        });
        selectedFlavoursDiv.appendChild(fragment);
      }

      popupOverlay?.classList.remove('hidden');
    });
  }

  // ✅ Close Popup on Overlay Click
  if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.classList.add('hidden');
      }
    });
  }

  // ✅ Handle Form Submission
  if (popupForm) {
    popupForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const formData = new FormData(popupForm);
      formData.append('category', selectedCategory);
  
      const selectedFlavours = Array.from(document.querySelectorAll('.flavour-item.selected'))
        .map(el => el.textContent.trim())
        .join(', ');
      formData.append('flavours', selectedFlavours);
  
      const payload = {};
      for (let [key, value] of formData.entries()) {
        payload[key] = value;
      }
  
      fetch('https://hook.eu2.make.com/m5nbq1lwg2up34kcb7mys99x76mw0zin?contactForm=popupPetfoodForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(res => {
          if (res.ok) {
            alert('Thank you for your message!');
            popupForm.reset();
            popupOverlay?.classList.add('hidden');
            document.querySelectorAll('.flavour-item.selected').forEach(el => el.classList.remove('selected'));
            categoryCards.forEach(c => c.classList.remove('selected'));
            selectedCategory = "";
            selectedCount = 0;
            if (button) {
              button.disabled = true;
              button.classList.remove('active');
            }
          } else {
            alert('Submission failed. Please try again.');
          }
        })
        .catch(err => {
          console.error('Webhook Error:', err);
          alert('Error sending data.');
        });
    });
  }
  } // end multi-section-page guard


  // ====================
  // BENEFIT CARDS ANIMATION
  // ====================
  const benefitCards = document.querySelectorAll('.benefits__card');
  if (benefitCards.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // animate once
        }
      });
    }, { threshold: 0.1 });

    benefitCards.forEach(card => observer.observe(card));
  }

  // ====================
  // CONTACT FORM LOGIC
  // ====================
  const contactForm = document.querySelector('.contact__form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const payload = {};

      for (let [key, value] of formData.entries()) {
        payload[key] = value;
      }

      fetch('https://hook.eu2.make.com/m5nbq1lwg2up34kcb7mys99x76mw0zin?contactForm=indexContactForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(res => {
          if (res.ok) {
            alert('Your message has been sent!');
            contactForm.reset();
          } else {
            alert('Submission failed. Please try again.');
          }
        })
        .catch(err => {
          console.error('Webhook Error:', err);
          alert('Error sending data.');
        });
    });
  }
});