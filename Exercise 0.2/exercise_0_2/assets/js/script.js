/* ==========================================================================
   Appliance Energy Consumption Website — shared behaviour
   ========================================================================== */

// ---------------------------------------------------------------------
// Footer: always show the current year, on every page, automatically.
// ---------------------------------------------------------------------
function setFooterYear() {
  var yearEls = document.querySelectorAll('[data-current-year]');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
}

// ---------------------------------------------------------------------
// FAQ accordion (Home page)
// Hidden by default, toggled open/closed by the user, one control at a
// time is not enforced — each question is independent.
// ---------------------------------------------------------------------
function initFaqAccordion() {
  var questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(function (button) {
    button.addEventListener('click', function () {
      var expanded = button.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(button.getAttribute('aria-controls'));

      button.setAttribute('aria-expanded', String(!expanded));

      if (!expanded) {
        // Opening: expand to the answer's natural height.
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        // Closing.
        answer.style.maxHeight = 0;
      }
    });
  });
}

// ---------------------------------------------------------------------
// Appliance Energy Calculator (optional JS extension)
// Vanilla JS only — no external libraries.
// ---------------------------------------------------------------------

// A small set of made-up reference appliances with a typical wattage.
// Used to populate the "known appliance" dropdown.
var APPLIANCE_PRESETS = {
  custom: null,
  led_tv_43: 60,
  led_tv_65: 110,
  oled_tv_55: 150,
  fridge: 150,
  split_ac: 1200,
  ceiling_fan: 70,
  washing_machine: 500,
  desktop_pc: 200
};

function initEnergyCalculator() {
  var form = document.getElementById('calc-form');
  if (!form) return; // Calculator markup not on this page.

  var applianceSelect = document.getElementById('calc-appliance');
  var wattsInput = document.getElementById('calc-watts');
  var hoursInput = document.getElementById('calc-hours');
  var priceInput = document.getElementById('calc-price');

  var errorBox = document.getElementById('calc-error');

  var outDaily = document.getElementById('result-daily');
  var outMonthly = document.getElementById('result-monthly');
  var outYearly = document.getElementById('result-yearly');
  var outCost = document.getElementById('result-cost');

  // Restore last-used values after a refresh (calculator must keep
  // working correctly after the page reloads).
  restoreSavedValues();

  // When a known appliance is chosen, fill in (and lock) the wattage.
  applianceSelect.addEventListener('change', function () {
    var preset = APPLIANCE_PRESETS[applianceSelect.value];
    if (preset) {
      wattsInput.value = preset;
      wattsInput.setAttribute('readonly', 'readonly');
    } else {
      wattsInput.removeAttribute('readonly');
      wattsInput.value = '';
      wattsInput.focus();
    }
    runCalculation();
  });

  // Recalculate live as the user types, and on explicit submit.
  [wattsInput, hoursInput, priceInput].forEach(function (input) {
    input.addEventListener('input', runCalculation);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    runCalculation();
  });

  function readInputs() {
    return {
      watts: parseFloat(wattsInput.value),
      hours: parseFloat(hoursInput.value),
      price: parseFloat(priceInput.value)
    };
  }

  function validate(values) {
    if (
      wattsInput.value.trim() === '' ||
      hoursInput.value.trim() === '' ||
      priceInput.value.trim() === ''
    ) {
      return 'Fill in all three fields to see a result.';
    }
    if (isNaN(values.watts) || values.watts <= 0) {
      return 'Power usage must be a number greater than 0.';
    }
    if (isNaN(values.hours) || values.hours < 0 || values.hours > 24) {
      return 'Hours of use must be between 0 and 24.';
    }
    if (isNaN(values.price) || values.price <= 0) {
      return 'Electricity price must be a number greater than 0.';
    }
    return null;
  }

  function runCalculation() {
    var values = readInputs();
    var problem = validate(values);

    if (problem) {
      errorBox.textContent = problem;
      clearResults();
      return;
    }

    errorBox.textContent = '';

    var dailyKwh = (values.watts * values.hours) / 1000;
    var monthlyKwh = dailyKwh * 30;
    var yearlyKwh = dailyKwh * 365;
    var yearlyCost = yearlyKwh * (values.price / 100); // price is cents/kWh

    outDaily.textContent = dailyKwh.toFixed(2) + ' kWh';
    outMonthly.textContent = monthlyKwh.toFixed(1) + ' kWh';
    outYearly.textContent = yearlyKwh.toFixed(0) + ' kWh';
    outCost.textContent = '$' + yearlyCost.toFixed(2);

    saveValues(values, applianceSelect.value);
  }

  function clearResults() {
    [outDaily, outMonthly, outYearly, outCost].forEach(function (el) {
      el.textContent = '\u2013'; // en dash placeholder
    });
  }

  function saveValues(values, applianceKey) {
    var state = {
      appliance: applianceKey,
      watts: values.watts,
      hours: values.hours,
      price: values.price
    };
    try {
      sessionStorage.setItem('energyCalculatorState', JSON.stringify(state));
    } catch (e) {
      // sessionStorage may be unavailable (e.g. private browsing) —
      // the calculator still works, it just won't persist on refresh.
    }
  }

  function restoreSavedValues() {
    var raw;
    try {
      raw = sessionStorage.getItem('energyCalculatorState');
    } catch (e) {
      raw = null;
    }
    if (!raw) {
      clearResults();
      return;
    }

    try {
      var state = JSON.parse(raw);
      applianceSelect.value = state.appliance || 'custom';
      wattsInput.value = state.watts != null ? state.watts : '';
      hoursInput.value = state.hours != null ? state.hours : '';
      priceInput.value = state.price != null ? state.price : '';

      if (APPLIANCE_PRESETS[applianceSelect.value]) {
        wattsInput.setAttribute('readonly', 'readonly');
      }
      runCalculation();
    } catch (e) {
      clearResults();
    }
  }
}

// ---------------------------------------------------------------------
// Init on DOM ready
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  setFooterYear();
  initFaqAccordion();
  initEnergyCalculator();
});
