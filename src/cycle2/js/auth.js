(function () {
  "use strict";

  const PASSWORD_MIN_LENGTH = 8;
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

  function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }

    if (inputElement) {
      inputElement.classList.add("form-input-error");
      inputElement.setAttribute("aria-invalid", "true");
    }
  }

  function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }

    if (inputElement) {
      inputElement.classList.remove("form-input-error");
      inputElement.setAttribute("aria-invalid", "false");
    }
  }

  function clearAllErrors(form) {
    const errorElements = form.querySelectorAll(".form-error");
    const inputElements = form.querySelectorAll(".form-input, .form-select");

    errorElements.forEach((error) => {
      error.textContent = "";
      error.style.display = "none";
    });

    inputElements.forEach((input) => {
      input.classList.remove("form-input-error");
      input.setAttribute("aria-invalid", "false");
    });
  }

  function showFormLoading(button, isLoading) {
    const btnText = button.querySelector(".btn-text");
    const btnLoading = button.querySelector(".btn-loading");

    if (isLoading) {
      btnText.style.display = "none";
      btnLoading.style.display = "inline";
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    } else {
      btnText.style.display = "inline";
      btnLoading.style.display = "none";
      button.disabled = false;
      button.setAttribute("aria-busy", "false");
    }
  }

  function showSuccessMessage(message) {
    const notification = document.createElement("div");
    notification.className = "auth-notification auth-notification-success";
    notification.setAttribute("role", "alert");
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  function showErrorMessage(message) {
    const notification = document.createElement("div");
    notification.className = "auth-notification auth-notification-error";
    notification.setAttribute("role", "alert");
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">❌</span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  function validateEmail(email) {
    if (!email.trim()) {
      return "Email address is required";
    }
    if (!EMAIL_REGEX.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  }

  function validatePassword(password) {
    if (!password) {
      return "Password is required";
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
    }
    if (!PASSWORD_REGEX.test(password)) {
      return "Password must include uppercase, lowercase, number, and special character";
    }
    return null;
  }

  function validateName(name, fieldName) {
    if (!name.trim()) {
      return `${fieldName} is required`;
    }
    if (!NAME_REGEX.test(name.trim())) {
      return `${fieldName} must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes`;
    }
    return null;
  }

  function validatePasswordConfirmation(password, confirmPassword) {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  }

  function setupLogin() {
    const loginForm = document.getElementById("login-form");
    const passwordToggle = document.getElementById("password-toggle");
    const forgotPasswordLink = document.getElementById("forgot-password");

    if (!loginForm) return;

    if (passwordToggle) {
      passwordToggle.addEventListener("click", function () {
        const passwordInput = document.getElementById("password");
        const isVisible = passwordInput.type === "text";

        passwordInput.type = isVisible ? "password" : "text";
        this.textContent = isVisible ? "👁️" : "🙈";
        this.setAttribute(
          "aria-label",
          isVisible ? "Show password" : "Hide password"
        );
      });
    }

    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", function (e) {
        e.preventDefault();
        showErrorMessage(
          "Password reset functionality is not yet implemented. Please contact support at info@indigenousartatlas.org"
        );
      });
    }

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        const error = validateEmail(this.value);
        if (error) {
          showError("email", error);
        } else {
          clearError("email");
        }
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener("input", function () {
        if (this.value && this.classList.contains("form-input-error")) {
          clearError("password");
        }
      });
    }

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleLogin(this);
    });
  }

  function handleLogin(form) {
    clearAllErrors(form);

    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    const remember = formData.get("remember");
    const submitButton = form.querySelector("#login-btn");

    let hasErrors = false;

    const emailError = validateEmail(email);
    if (emailError) {
      showError("email", emailError);
      hasErrors = true;
    }

    if (!password) {
      showError("password", "Password is required");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    showFormLoading(submitButton, true);

    setTimeout(() => {
      showFormLoading(submitButton, false);

      if (email === "demo@indigenousartatlas.org" && password === "Demo123!") {
        const userData = {
          email: email,
          name: "Demo User",
          loginTime: new Date().toISOString(),
          remember: remember === "on",
        };

        localStorage.setItem("userSession", JSON.stringify(userData));
        showSuccessMessage(
          "Successfully signed in! Redirecting to homepage..."
        );

        setTimeout(() => {
          window.location.href = window.Utils.page("homePage/index.html");
        }, 2000);
      } else {
        showErrorMessage(
          "Invalid email or password. Try demo@indigenousartatlas.org with password Demo123!"
        );
      }
    }, 1500);
  }

  function setupRegistration() {
    const registerForm = document.getElementById("register-form");
    const passwordToggle = document.getElementById("password-toggle");
    const confirmPasswordToggle = document.getElementById(
      "confirm-password-toggle"
    );

    if (!registerForm) return;

    [passwordToggle, confirmPasswordToggle].forEach((toggle) => {
      if (toggle) {
        toggle.addEventListener("click", function () {
          const targetId =
            this.id === "password-toggle" ? "password" : "confirmPassword";
          const passwordInput = document.getElementById(targetId);
          const isVisible = passwordInput.type === "text";

          passwordInput.type = isVisible ? "password" : "text";
          this.textContent = isVisible ? "👁️" : "🙈";
          this.setAttribute(
            "aria-label",
            isVisible ? "Show password" : "Hide password"
          );
        });
      }
    });

    setupRegisterValidation(registerForm);

    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleRegistration(this);
    });
  }

  function setupRegisterValidation(form) {
    const fields = {
      firstName: (value) => validateName(value, "First name"),
      lastName: (value) => validateName(value, "Last name"),
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (value) => {
        const password = document.getElementById("password").value;
        return validatePasswordConfirmation(password, value);
      },
      userType: (value) => (!value ? "Please select your account type" : null),
      terms: (checked) =>
        !checked ? "You must agree to the terms and conditions" : null,
    };

    Object.keys(fields).forEach((fieldId) => {
      const element = document.getElementById(fieldId);
      if (!element) return;

      const validator = fields[fieldId];

      if (element.type === "checkbox") {
        element.addEventListener("change", function () {
          const error = validator(this.checked);
          if (error) {
            showError(fieldId, error);
          } else {
            clearError(fieldId);
          }
        });
      } else {
        element.addEventListener("blur", function () {
          const error = validator(this.value);
          if (error) {
            showError(fieldId, error);
          } else {
            clearError(fieldId);
          }
        });

        element.addEventListener("input", function () {
          if (this.classList.contains("form-input-error")) {
            clearError(fieldId);
          }
        });
      }
    });
  }

  function handleRegistration(form) {
    clearAllErrors(form);

    const formData = new FormData(form);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      userType: formData.get("userType"),
      terms: formData.get("terms") === "on",
      newsletter: formData.get("newsletter") === "on",
    };

    const submitButton = form.querySelector("#register-btn");

    let hasErrors = false;

    const validationRules = {
      firstName: () => validateName(data.firstName, "First name"),
      lastName: () => validateName(data.lastName, "Last name"),
      email: () => validateEmail(data.email),
      password: () => validatePassword(data.password),
      confirmPassword: () =>
        validatePasswordConfirmation(data.password, data.confirmPassword),
      userType: () =>
        !data.userType ? "Please select your account type" : null,
      terms: () =>
        !data.terms ? "You must agree to the terms and conditions" : null,
    };

    Object.keys(validationRules).forEach((field) => {
      const error = validationRules[field]();
      if (error) {
        showError(field, error);
        hasErrors = true;
      }
    });

    if (hasErrors) {
      return;
    }

    showFormLoading(submitButton, true);

    setTimeout(() => {
      showFormLoading(submitButton, false);

      const userData = {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        userType: data.userType,
        newsletter: data.newsletter,
        registrationTime: new Date().toISOString(),
      };

      localStorage.setItem("userSession", JSON.stringify(userData));
      showSuccessMessage(
        "Account created successfully! Welcome to the Indigenous Art Atlas community. Redirecting to homepage..."
      );

      setTimeout(() => {
        window.location.href = window.Utils.page("homePage/index.html");
      }, 3000);
    }, 2000);
  }

  function checkUserSession() {
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        const userData = JSON.parse(session);
        updateUserAvatar(userData);
      } catch (e) {
        console.error("Invalid session data:", e);
        localStorage.removeItem("userSession");
      }
    }
  }

  function updateUserAvatar(userData) {
    const userNameElement = document.querySelector(".user-name");
    const avatarInitials = document.querySelector(".avatar-initials");

    if (userNameElement) {
      userNameElement.textContent = userData.name || "User";
    }

    if (avatarInitials && userData.name) {
      const names = userData.name.split(" ");
      const initials = names
        .map((name) => name.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
      avatarInitials.textContent = initials;
    }
  }

  function init() {
    checkUserSession();
    setupLogin();
    setupRegistration();
    console.log("Authentication system initialized");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.AuthUtils = {
    logout: function () {
      localStorage.removeItem("userSession");
      showSuccessMessage("Successfully logged out");
      setTimeout(() => {
        window.location.href = window.Utils.page("homePage/index.html");
      }, 1500);
    },
  };
})();
