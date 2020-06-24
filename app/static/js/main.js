'use strict';

const consts = Object.freeze({
  NUKE_TEST_PATTERN: `set cut_paste_input [stack 0]`,
  FUSION_TEST_PATTERN: `{
    Tools = ordered() {`,
});

var App = {
  previousInputNodeType: 'nuke', // this is a ghetto componentShouldUpdate
  inputNodeType: 'nuke', // and this is ghetto state

  components: {
    btnConvert: document.getElementById('nu-btn-convert'),
    btnClear: document.getElementById('nu-btn-clear'),
    btnCopy: document.getElementById('nu-btn-copy'),
    txtInputNode: document.getElementById('nu-input-node'),
    txtOutputNode: document.getElementById('nu-output-node'),
    txtInputWidth: document.getElementById('nu-input-width'),
    txtInputHeight: document.getElementById('nu-input-height'),
    errorText: document.getElementById('nu-input-error-text'),
    nukeInputHeading: document.getElementById('nu-nuke-input-heading'),
    fusionInputHeading: document.getElementById('nu-fusion-input-heading'),
    nukeOutputHeading: document.getElementById('nu-nuke-output-heading'),
    fusionOutputHeading: document.getElementById('nu-fusion-output-heading'),
    resolutionRow: document.getElementById('nu-resolution-row'),
    body: document.body,
  },

  routes: {
    convert: 'convert',
  },

  init: function () {
    App.addEventListeners();

    App.matchHeights(
      App.components.txtInputNode,
      App.components.txtOutputNode,
      App.outerHeight(App.components.resolutionRow) // makes up for the space created by the resolution row
    );
  },

  addEventListeners: function () {
    App.components.btnConvert.addEventListener('click', App.onConvertClicked);
    App.components.btnClear.addEventListener('click', App.onClearClicked);
    App.components.btnCopy.addEventListener('click', App.onCopyClicked);
    App.components.txtInputNode.addEventListener('focus', App.onInputFocus);
    App.components.txtInputNode.addEventListener(
      'input',
      App.onTxtInputNodeInput
    );
    App.components.txtInputWidth.addEventListener('focus', App.onInputFocus);
    App.components.txtInputHeight.addEventListener('focus', App.onInputFocus);
  },

  /**
   * Tests if a one string contains another AND that the test pattern is the start of the value
   *
   * @param {String} value
   * @param {String} testPattern
   */
  matchNodeTest(value, testPattern) {
    const sanitizedValue = value.toString().replace(/\s/g, '').trim();
    const sanitizedTestPattern = testPattern
      .toString()
      .replace(/\s/g, '')
      .trim();

    return (
      sanitizedValue.includes(sanitizedTestPattern) &&
      sanitizedValue.indexOf(sanitizedTestPattern) === 0
    );
  },

  onTxtInputNodeInput: function (event) {
    const value = event.target.value;

    if (App.matchNodeTest(value, consts.NUKE_TEST_PATTERN)) {
      App.inputNodeType = 'nuke';
    }

    if (App.matchNodeTest(value, consts.FUSION_TEST_PATTERN)) {
      App.inputNodeType = 'fusion';
    }

    App.animateCardHeaders();
  },

  /**
   * Animates the headers based on the detected input node, works fine for 2 header options but this really isnt scalable.
   */
  animateCardHeaders: function () {
    // only update the UI if there was a change
    if (App.inputNodeType === 'nuke' && App.previousInputNodeType !== 'nuke') {
      App.previousInputNodeType = 'nuke';
      App.nukeInputHeading_show();
      App.fusionInputHeading_hide();
      App.nukeOutputHeading_hide();
      App.fusionOutputHeading_show();
    }

    // only update the UI if there was a change
    if (
      App.inputNodeType === 'fusion' &&
      App.previousInputNodeType !== 'fusion'
    ) {
      App.previousInputNodeType = 'fusion';
      App.nukeInputHeading_hide();
      App.fusionInputHeading_show();
      App.nukeOutputHeading_show();
      App.fusionOutputHeading_hide();
    }
  },

  /**
   * Removes danger text formatting on input focus.
   *
   * @param {Event} event
   */
  onInputFocus: function (event) {
    event.target.classList.remove('uk-form-danger');
  },

  convertNode: function (inputNode, resWidth, resHeight, fromSoftware) {
    return fetch(App.routes.convert, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        data: inputNode,
        width: resWidth,
        height: resHeight,
        fromSoftware: fromSoftware,
      }),
    })
      .then((response) => response.json())
      .then(function (response) {
        App.components.txtOutputNode.value = response['result'];
      });
  },

  /**
   * Checks the given array of inputs are valid for now "valid" means not empty.
   *
   * @param {Array} inputs
   * @return {Boolean}
   */
  isValid: function (inputs) {
    let valid = true;

    inputs.forEach((input) => {
      if (input.value.trim() === '') {
        valid = false;
        input.classList.add('uk-form-danger');
      }
    });

    return valid;
  },

  /**
   * Gets the computed height of an element in px
   *
   * @param {HTMLElement} element
   */
  outerHeight: function (element) {
    var height = element.offsetHeight;
    var style = getComputedStyle(element);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  },

  /**
   * Sets an elements height in pixels
   *
   * @param {HTMLElement} element
   * @param {Number} val
   */
  setHeight: function (element, val) {
    if (typeof val === 'function') val = val();
    if (typeof val === 'string') element.style.height = val;
    else element.style.height = val + 'px';
  },

  /**
   * Matches the target elements height to the source elements height, can also be tuned with an offset value
   *
   * @param {HTMLElement} source
   * @param {HTMLElement} target
   * @param {Number} offset
   */
  matchHeights: function (source, target, offset = 0) {
    const sourceHeight = App.outerHeight(source);
    App.setHeight(target, sourceHeight + offset);
  },

  onConvertClicked: function (e) {
    e.preventDefault();
    const validateInputs = [
      App.components.txtInputNode,
      App.components.txtInputWidth,
      App.components.txtInputHeight,
    ];

    if (App.isValid(validateInputs)) {
      App.errorText_hide();
      App.convertNode(
        App.components.txtInputNode.value,
        App.components.txtInputWidth.value,
        App.components.txtInputHeight.value,
        App.inputNodeType
      );
    } else {
      App.errorText_show();
    }
  },

  errorText_show: function () {
    App.components.errorText.classList.remove('nu-invisible');
    App.oozeStyle(App.components.errorText, 'fadeInDown');
  },

  errorText_hide: function () {
    App.oozeStyle(App.components.errorText, 'fadeOutUp').then(() => {
      App.components.errorText.classList.add('nu-invisible');
    });
  },

  nukeInputHeading_show: function () {
    App.components.nukeInputHeading.classList.remove('nu-hidden');
    App.oozeStyle(App.components.nukeInputHeading, 'fadeInUp');
  },

  nukeInputHeading_hide: function () {
    App.oozeStyle(App.components.nukeInputHeading, 'fadeOutUp').then(() => {
      App.components.nukeInputHeading.classList.add('nu-hidden');
    });
  },

  fusionInputHeading_show: function () {
    App.components.fusionInputHeading.classList.remove('nu-hidden');
    App.oozeStyle(App.components.fusionInputHeading, 'fadeInUp');
  },

  fusionInputHeading_hide: function () {
    App.oozeStyle(App.components.fusionInputHeading, 'fadeOutUp').then(() => {
      App.components.fusionInputHeading.classList.add('nu-hidden');
    });
  },

  nukeOutputHeading_show: function () {
    App.components.nukeOutputHeading.classList.remove('nu-hidden');
    App.oozeStyle(App.components.nukeOutputHeading, 'fadeInUp');
  },

  nukeOutputHeading_hide: function () {
    App.oozeStyle(App.components.nukeOutputHeading, 'fadeOutUp').then(() => {
      App.components.nukeOutputHeading.classList.add('nu-hidden');
    });
  },

  fusionOutputHeading_show: function () {
    App.components.fusionOutputHeading.classList.remove('nu-hidden');
    App.oozeStyle(App.components.fusionOutputHeading, 'fadeInUp');
  },

  fusionOutputHeading_hide: function () {
    App.oozeStyle(App.components.fusionOutputHeading, 'fadeOutUp').then(() => {
      App.components.fusionOutputHeading.classList.add('nu-hidden');
    });
  },

  /**
   * Helper method to manage animations provided by Animate.css
   *
   * @param {HTMLElement} element
   * @param {String} animation - see homepage for options https://animate.style/
   * @param {String} prefix
   * @param {String} speed - slow, slower, fast, faster
   */
  oozeStyle: function (
    element,
    animation,
    prefix = 'animate__',
    speed = 'faster'
  ) {
    return new Promise((resolve) => {
      const animationName = `${prefix}${animation}`;

      element.classList.add(
        `${prefix}animated`,
        animationName,
        `${prefix}${speed}`
      );

      // animation ended - clean the classes and resolve the Promise and remove event listener
      function handleAnimationEnd() {
        element.classList.remove(
          `${prefix}animated`,
          animationName,
          `${prefix}${speed}`
        );

        element.removeEventListener('animationend', handleAnimationEnd);

        resolve();
      }

      element.addEventListener('animationend', handleAnimationEnd);
    });
  },

  onClearClicked: function (e) {
    e.preventDefault();
    App.errorText_hide();
    App.components.txtOutputNode.value = '';
    App.components.txtInputNode.value = '';
    App.components.txtInputNode.focus();
  },

  onCopyClicked: function (e) {
    e.preventDefault();
    copyToClipboard(App.components.txtOutputNode.value);

    // Change button text for user feedback
    const originalText = App.components.btnCopy.innerHTML;
    App.components.btnCopy.innerHTML = 'Copied';
    setTimeout(function () {
      App.components.btnCopy.innerHTML = originalText;
    }, 2000);
  },
};

// Copies a string to the clipboard. Must be called from within an
// event handler such as click. May return false if it failed, but
// this is not always possible. Browser support for Chrome 43+,
// Firefox 42+, Safari 10+, Edge and Internet Explorer 10+.
// Internet Explorer: The clipboard feature may be disabled by
// an administrator. By default a prompt is shown the first
// time the clipboard is used (per session).
function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    var textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

window.addEventListener('load', function () {
  App.init();
});
