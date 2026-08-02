const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const navLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const accordionItems = document.querySelectorAll(".accordion-item");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 18);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const open = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("nav-open", open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `${Math.floor(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

accordionItems.forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");
  const symbol = item.querySelector(".accordion-symbol");

  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    accordionItems.forEach((otherItem) => {
      otherItem.classList.remove("open");
      otherItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      otherItem.querySelector(".accordion-symbol").textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
      symbol.textContent = "−";
    }
  });
});

const sections = [...document.querySelectorAll("main section[id]")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isMatch);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxcIomAOfwhf_GEB0MtQipP_y4D7Se7TtKBeM4y7iC1oWcIa70JpzSTgts3-TCOGDvy/exec";
const contactForm = document.getElementById("contact-page-form");
if (contactForm) {
  const nameField = document.getElementById("contact-name");
  const emailField = document.getElementById("contact-email");
  const phoneField = document.getElementById("contact-phone");
  const interestField = document.getElementById("contact-interest");
  const messageField = document.getElementById("contact-message");
  const consentField = document.getElementById("contact-consent");
  const consentLabel = document.querySelector(".contact-consent");
  const statusMessage = document.getElementById("contact-form-status");
  const submitButton = document.getElementById("contact-submit-btn");
  let popupTimer;

  const setSubmittingState = (isSubmitting) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("loading", isSubmitting);
    const buttonText = submitButton.querySelector(".btn-text");
    if (buttonText) {
      buttonText.textContent = isSubmitting ? "Sending..." : "Send Message";
    }
  };

  const showPopup = (message, type = "success", autoHide = true) => {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.className = `form-status popup ${type}`;
    statusMessage.classList.add("show");

    clearTimeout(popupTimer);
    if (autoHide) {
      popupTimer = setTimeout(() => {
        statusMessage.classList.remove("show");
        statusMessage.textContent = "";
        statusMessage.className = "form-status";
      }, 4000);
    }
  };

  const setFieldError = (field, message) => {
    const fieldWrap = field.closest(".form-field");
    if (fieldWrap) {
      fieldWrap.classList.toggle("invalid", Boolean(message));
      const errorText = fieldWrap.querySelector(".field-error");
      if (errorText) {
        errorText.textContent = message || "";
      }
    }
  };

  const clearFieldError = (field) => setFieldError(field, "");

  const validateName = () => {
    const value = nameField.value.trim();
    const message = value ? "" : "Please enter your full name.";
    setFieldError(nameField, message);
    return !message;
  };

  const validateEmail = () => {
    const value = emailField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setFieldError(emailField, "Please enter your email address.");
      return false;
    }

    const message = emailPattern.test(value) ? "" : "Enter a valid email address.";
    setFieldError(emailField, message);
    return !message;
  };

  const validatePhone = () => {
    const value = phoneField.value.trim();
    const message = value ? "" : "Please enter your phone number.";
    setFieldError(phoneField, message);
    return !message;
  };

  const validateInterest = () => {
    const value = interestField.value.trim();
    const message = value ? "" : "Please select a topic.";
    setFieldError(interestField, message);
    return !message;
  };

  const validateMessage = () => {
    const value = messageField.value.trim();
    const message = value ? "" : "Please enter your message.";
    setFieldError(messageField, message);
    return !message;
  };

  const validateConsent = () => {
    if (!consentField.checked) {
      consentLabel.classList.add("invalid");
      return false;
    }

    consentLabel.classList.remove("invalid");
    return true;
  };

  const validateForm = () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isInterestValid = validateInterest();
    const isMessageValid = validateMessage();
    const isConsentValid = validateConsent();

    return isNameValid && isEmailValid && isPhoneValid && isInterestValid && isMessageValid && isConsentValid;
  };

  [nameField, emailField, phoneField, interestField, messageField].forEach((field) => {
    field.addEventListener("input", () => {
      if (field === emailField) {
        validateEmail();
      } else if (field === nameField) {
        validateName();
      } else if (field === phoneField) {
        validatePhone();
      } else if (field === interestField) {
        validateInterest();
      } else {
        validateMessage();
      }

      if (statusMessage.textContent) {
        statusMessage.textContent = "";
        statusMessage.className = "form-status";
      }
    });

    field.addEventListener("change", () => {
      if (field === emailField) {
        validateEmail();
      } else if (field === nameField) {
        validateName();
      } else if (field === phoneField) {
        validatePhone();
      } else if (field === interestField) {
        validateInterest();
      } else {
        validateMessage();
      }
    });
  });

  consentField.addEventListener("change", validateConsent);

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      const firstInvalidField = contactForm.querySelector(".invalid input, .invalid select, .invalid textarea");
      if (firstInvalidField) {
        firstInvalidField.focus();
      } else if (consentLabel.classList.contains("invalid")) {
        consentField.focus();
      }
      showPopup("Please complete all required fields.", "error");
      return;
    }

    const data = {
      form: "contact",
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField.value.trim(),
      type: interestField.value.trim(),
      message: messageField.value.trim()
    };

    setSubmittingState(true);
    showPopup("Loading...", "loading", false);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        showPopup("Thank you! Your message has been sent.", "success");
        contactForm.reset();
        [nameField, emailField, phoneField, interestField, messageField].forEach(clearFieldError);
        consentLabel.classList.remove("invalid");
      } else {
        showPopup("Something went wrong. Please try again.", "error");
      }
    } catch (ex) {
      showPopup("Something went wrong. Please try again.", "error");
    } finally {
      setSubmittingState(false);
    }
  });
}

const careersForm = document.getElementById("career-form");
if (careersForm) {
  const fullNameField = document.getElementById("full-name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const interestField = document.getElementById("interest");
  const resumeField = document.getElementById("resume");
  const fileName = document.getElementById("file-name");
  const statusMessage = document.getElementById("form-status");
  const submitButton = careersForm.querySelector(".form-submit");
  let popupTimer;

  const setSubmittingState = (isSubmitting) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("loading", isSubmitting);
    const buttonText = submitButton.querySelector(".btn-text");
    if (buttonText) {
      buttonText.textContent = isSubmitting ? "Processing..." : "Submit Your Resume";
    }
  };

  const showPopup = (message, type = "success", autoHide = true) => {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.className = `form-status popup ${type}`;
    statusMessage.classList.add("show");

    clearTimeout(popupTimer);
    if (autoHide) {
      popupTimer = setTimeout(() => {
        statusMessage.classList.remove("show");
        statusMessage.textContent = "";
        statusMessage.className = "form-status";
      }, 4000);
    }
  };

  const setFieldError = (field, message) => {
    const fieldWrap = field.closest(".form-field");
    if (fieldWrap) {
      fieldWrap.classList.toggle("invalid", Boolean(message));
      const errorText = fieldWrap.querySelector(".field-error");
      if (errorText) {
        errorText.textContent = message || "";
      }
    }
  };

  const clearFieldError = (field) => setFieldError(field, "");

  const validateFullName = () => {
    const value = fullNameField.value.trim();
    const message = value ? "" : "Please enter your full name.";
    setFieldError(fullNameField, message);
    return !message;
  };

  const validateEmail = () => {
    const value = emailField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setFieldError(emailField, "Please enter your email address.");
      return false;
    }

    const message = emailPattern.test(value) ? "" : "Enter a valid email address.";
    setFieldError(emailField, message);
    return !message;
  };

  const validatePhone = () => {
    const value = phoneField.value.trim();
    const message = value ? "" : "Enter your phone number.";
    setFieldError(phoneField, message);
    return !message;
  };

  const validateInterest = () => {
    const value = interestField.value.trim();
    const message = value ? "" : "Select an area.";
    setFieldError(interestField, message);
    return !message;
  };

  const validateResume = () => {
    const value = resumeField.files && resumeField.files.length ? resumeField.files[0].name : "";
    const message = value ? "" : "Please attach your resume.";
    setFieldError(resumeField, message);
    if (fileName && value) {
      fileName.textContent = value;
    }
    return !message;
  };

  const validateForm = () => {
    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isInterestValid = validateInterest();
    const isResumeValid = validateResume();

    return isNameValid && isEmailValid && isPhoneValid && isInterestValid && isResumeValid;
  };

  [fullNameField, emailField, phoneField, interestField].forEach((field) => {
    field.addEventListener("input", () => {
      if (field === fullNameField) {
        validateFullName();
      } else if (field === emailField) {
        validateEmail();
      } else if (field === phoneField) {
        validatePhone();
      } else {
        validateInterest();
      }

      if (statusMessage && statusMessage.textContent) {
        statusMessage.textContent = "";
        statusMessage.className = "form-status";
      }
    });

    field.addEventListener("change", () => {
      if (field === fullNameField) {
        validateFullName();
      } else if (field === emailField) {
        validateEmail();
      } else if (field === phoneField) {
        validatePhone();
      } else {
        validateInterest();
      }
    });
  });

  resumeField.addEventListener("change", () => {
    validateResume();
    if (statusMessage && statusMessage.textContent) {
      statusMessage.textContent = "";
      statusMessage.className = "form-status";
    }
  });

  careersForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      const firstInvalidField = careersForm.querySelector(".invalid input, .invalid select, .invalid textarea");
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    const file = resumeField.files && resumeField.files[0] ? resumeField.files[0] : null;
    if (!file) {
      showPopup("Please attach your resume.", "error");
      return;
    }

    setSubmittingState(true);
    showPopup("Processing...", "loading", false);

    const reader = new FileReader();

    reader.onload = async function () {
      const base64 = reader.result.split(",")[1];
      const formData = new FormData();

formData.append("form", "career");
formData.append("name", fullNameField.value.trim());
formData.append("email", emailField.value.trim());
formData.append("phone", phoneField.value.trim());
formData.append("interest", interestField.value.trim());
formData.append("message", document.getElementById("message").value.trim());

formData.append("resume", base64);
formData.append("resumeName", file.name);
formData.append("resumeType", file.type);
      try {
        const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: formData
});

        const result = await response.json();

        if (result.success) {
          showPopup("Application submitted successfully!", "success");
          careersForm.reset();
        } else {
          showPopup("Something went wrong.", "error");
        }
      } catch (ex) {
        showPopup("Something went wrong.", "error");
      } finally {
        setSubmittingState(false);
      }
    };

    reader.readAsDataURL(file);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".nav-dropdown-toggle").forEach((toggle)=>{toggle.addEventListener("click",(event)=>{event.stopPropagation();const dropdown=toggle.closest(".nav-dropdown");const open=dropdown.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});});
document.addEventListener("click",()=>{document.querySelectorAll(".nav-dropdown.open").forEach((dropdown)=>{dropdown.classList.remove("open");const toggle=dropdown.querySelector(".nav-dropdown-toggle");if(toggle)toggle.setAttribute("aria-expanded","false");});});
