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
  // FLAVOR REQUEST FORM
  // ====================
  const requestForm = document.getElementById('flavorRequestForm');

  if (requestForm) {
    const WEBHOOK_URL = 'https://atmarbio-forms.vercel.app/api/request';
    const successEl = document.getElementById('flavorRequestSuccess');
    const statusEl = document.getElementById('flavorRequestStatus');
    const againBtn = document.getElementById('flavorRequestAgain');
    const submitBtn = requestForm.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.querySelector('.btn-label');
    const otherWrap = requestForm.querySelector('[data-other]');
    const how = document.querySelector('.contact__how');
    const NONE_OPTION = 'None / not sure';

    // "How it works": collapsed on small screens, always open on desktop
    if (how) {
      const desktop = window.matchMedia('(min-width: 900px)');
      if (!desktop.matches) how.removeAttribute('open');
      desktop.addEventListener('change', function (e) {
        if (e.matches) how.setAttribute('open', '');
      });
    }

    const field = name => requestForm.querySelector('[data-field="' + name + '"]');
    const radioValue = name => {
      const el = requestForm.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : '';
    };
    const checkedValues = name =>
      Array.from(requestForm.querySelectorAll('input[name="' + name + '"]:checked')).map(i => i.value);
    const val = name => {
      const el = requestForm.elements[name];
      return el && typeof el.value === 'string' ? el.value.trim() : '';
    };

    function setError(name, message) {
      const f = field(name);
      if (!f) return;
      const err = f.querySelector('.field__error');
      f.classList.toggle('field--invalid', !!message);
      if (err) {
        err.textContent = message || '';
        err.hidden = !message;
      }
    }

    function validate() {
      const bad = [];
      const need = (name, ok, message) => {
        setError(name, ok ? '' : message);
        if (!ok) bad.push(name);
      };
      need('flavours', val('flavours').length > 0, 'Please tell us which flavor(s) you need.');
      need('application', !!radioValue('application'), 'Please choose one.');
      need('form', !!radioValue('form'), 'Please choose one.');
      need('source', !!radioValue('source'), 'Please choose one.');
      need('solubility', !!radioValue('solubility'), 'Please choose one.');
      need('process', checkedValues('process').length > 0, 'Choose at least one, or "' + NONE_OPTION + '".');
      need('quantity', !!radioValue('quantity'), 'Please choose one.');
      need('company', val('company').length > 0, 'Please enter your company name.');
      const emailEl = requestForm.elements['email'];
      need('email', emailEl.value.trim() !== '' && emailEl.checkValidity(), 'Please enter a valid email address.');
      return bad;
    }

    requestForm.addEventListener('change', function (e) {
      const t = e.target;
      if (t.name === 'application' && otherWrap) {
        otherWrap.hidden = radioValue('application') !== 'Other';
      }
      if (t.name === 'process' && t.checked) {
        requestForm.querySelectorAll('input[name="process"]').forEach(function (box) {
          if (box === t) return;
          if (t.value === NONE_OPTION) box.checked = false;
          else if (box.value === NONE_OPTION) box.checked = false;
        });
      }
      const f = t.closest('.field');
      if (f && f.dataset.field) setError(f.dataset.field, '');
    });

    requestForm.addEventListener('input', function (e) {
      const f = e.target.closest('.field');
      if (f && f.dataset.field) setError(f.dataset.field, '');
    });

    function showSuccess() {
      requestForm.hidden = true;
      successEl.hidden = false;
      successEl.focus();
      const section = document.getElementById('contact');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    requestForm.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.classList.remove('is-error');

      // honeypot: bots fill the hidden field, people never see it
      if (val('website')) {
        showSuccess();
        return;
      }

      const bad = validate();
      if (bad.length) {
        const first = field(bad[0]);
        const target = first.querySelector('input, textarea');
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (target) target.focus({ preventScroll: true });
        return;
      }

      const application = radioValue('application') === 'Other' && val('applicationOther')
        ? 'Other: ' + val('applicationOther')
        : radioValue('application');
      const process = checkedValues('process').join(', ');
      const flavours = val('flavours');

      const lines = [
        'Flavor(s): ' + flavours,
        'Used in: ' + application,
        'Form: ' + radioValue('form'),
        'Source: ' + radioValue('source'),
        'Solubility: ' + radioValue('solubility'),
        'Process factors: ' + process,
        'Estimated order size: ' + radioValue('quantity') + ' per flavor',
        'Company: ' + val('company'),
        'Name: ' + (val('name') || '-'),
        'Notes: ' + (val('notes') || '-')
      ];

      // structured fields for automation + legacy keys (name/email/subject/message)
      const payload = {
        formType: 'flavorRequest',
        flavours: flavours,
        application: application,
        form: radioValue('form'),
        source: radioValue('source'),
        solubility: radioValue('solubility'),
        processFactors: process,
        quantity: radioValue('quantity'),
        notes: val('notes'),
        company: val('company'),
        contactName: val('name'),
        email: val('email'),
        name: val('name') || val('company'),
        subject: 'Flavor request: ' + flavours,
        message: lines.join('\n')
      };

      submitBtn.disabled = true;
      submitLabel.textContent = 'Sending...';

      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          showSuccess();
        })
        .catch(function (err) {
          console.error('Request form error:', err);
          statusEl.textContent = 'Something went wrong. Please try again in a moment.';
          statusEl.classList.add('is-error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitLabel.textContent = 'Send Request';
        });
    });

    if (againBtn) {
      againBtn.addEventListener('click', function () {
        requestForm.reset();
        if (otherWrap) otherWrap.hidden = true;
        requestForm.querySelectorAll('.field').forEach(function (f) {
          if (f.dataset.field) setError(f.dataset.field, '');
        });
        successEl.hidden = true;
        requestForm.hidden = false;
        const first = requestForm.querySelector('input[name="flavours"]');
        if (first) first.focus();
      });
    }
  }
});

function toggleFaq(btn) {
  const item = btn.closest('.faq__item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq__item').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}