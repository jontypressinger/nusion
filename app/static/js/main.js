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
    errorText: document.getElementById('nu-error-text'),
    body: document.body,
  },
  routes: {
    convert: 'convert',
  },

  init: function () {
    App.addEventListeners();
  },

  addEventListeners: function () {
    App.components.btnConvert.addEventListener('click', App.onConvertClicked);
    App.components.btnClear.addEventListener('click', App.onClearClicked);
    App.components.btnCopy.addEventListener('click', App.onCopyClicked);
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

  isValid: function () {
    let valid = true;
    const testInputs = [App.components.txtInputNode];

    testInputs.forEach((input) => {
      if (input.value.trim() === '') {
        valid = false;
        input.classList.add('uk-form-danger');
      }
    });

    return valid;
  },

  onConvertClicked: function (e) {
    e.preventDefault();

    if (App.isValid()) {
      console.log('VALID');
    } else {
      console.log('NOT VALID');
    }

    // App.convertNode(
    //   App.components.txtInputNode.value,
    //   App.components.txtInputWidth.value,
    //   App.components.txtInputHeight.value,
    //   'nuke'
    // );
  },

  onClearClicked: function (e) {
    e.preventDefault();
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
