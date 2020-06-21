'use strict';

var App = {
  components: {
    btnConvert: document.getElementById('nu-btn-convert'),
    btnClear: document.getElementById('nu-btn-clear'),
    btnCopy: document.getElementById('nu-btn-copy'),
    txtInputNode: document.getElementById('nu-input-node'),
    txtOutputNode: document.getElementById('nu-output-node'),
    txtInputWidth: document.getElementById('nu-input-width'),
    txtInputHeight: document.getElementById('nu-input-height'),
    errorText: document.getElementById('nu-input-error-text'),
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
      55 // makes up for the space created by the resolution row
    );
  },

  addEventListeners: function () {
    App.components.btnConvert.addEventListener('click', App.onConvertClicked);
    App.components.btnClear.addEventListener('click', App.onClearClicked);
    App.components.btnCopy.addEventListener('click', App.onCopyClicked);
    App.components.txtInputNode.addEventListener('focus', App.onInputFocus);
    App.components.txtInputWidth.addEventListener('focus', App.onInputFocus);
    App.components.txtInputHeight.addEventListener('focus', App.onInputFocus);
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
   * @param {Element} element
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
   * @param {Element} element
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
   * @param {Element} source
   * @param {Element} target
   * @param {Number} offset
   */
  matchHeights: function (source, target, offset) {
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
      App.components.errorText.classList.add('nu-invisible');
      App.convertNode(
        App.components.txtInputNode.value,
        App.components.txtInputWidth.value,
        App.components.txtInputHeight.value,
        'nuke'
      );
    } else {
      App.components.errorText.classList.remove('nu-invisible');
    }
  },

  onClearClicked: function (e) {
    e.preventDefault();
    App.components.errorText.classList.add('nu-invisible');
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
