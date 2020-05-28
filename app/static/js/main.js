"use strict";

var App = {
    components: {
        btnConvert: document.getElementById("btn-convert"),
        btnClear: document.getElementById("btn-clear"),
        btnCopy: document.getElementById("btn-copy"),
        btnResHelp: document.getElementById("btn-res-help"),
        btnResHelpClose: document.querySelectorAll(".btn-res-help-close"),
        btnAbout: document.getElementById("btn-about"),
        btnAboutClose: document.querySelectorAll(".btn-about-close"),
        btnList: document.getElementById("btn-list"),
        btnListClose: document.querySelectorAll(".btn-list-close"),
        txtInputNode: document.getElementById("input-node"),
        txtOutputNode: document.getElementById("output-node"),
        modalAbout: document.getElementById("modal-about"),
        modalList: document.getElementById("modal-list"),
        modalResHelp: document.getElementById("modal-res-help"),
        body: document.body
    },

    routes: {
        convert: "convert",
    },

    init: function() {
        App.addEventListeners();
    },

    addEventListeners: function() {
        App.components.btnConvert.addEventListener("click", App.onConvertClicked);
        App.components.btnClear.addEventListener("click", App.onClearClicked);
        App.components.btnCopy.addEventListener("click", App.onCopyClicked);
        App.components.btnResHelp.addEventListener("click", App.onResHelpClicked);
        App.components.btnAbout.addEventListener("click", App.onAboutClicked);
        App.components.btnList.addEventListener("click", App.onListClicked);
        App.components.body.addEventListener("click", App.onBodyClicked);

        App.components.btnResHelpClose.forEach(item => {
            item.addEventListener("click", App.onResHelpCloseClicked)
        });

        App.components.btnAboutClose.forEach(item => {
            item.addEventListener("click", App.onAboutCloseClicked)
        });

        App.components.btnListClose.forEach(item => {
            item.addEventListener("click", App.onListCloseClicked)
        });
    },

    convertNode: function(inputNode, fromSoftware) {
        return fetch(
            App.routes.convert,
            {
                headers: {'Content-Type': 'application/json'},
                method: "POST",
                body: JSON.stringify({ "data": inputNode, "fromSoftware": fromSoftware })
            }
        )
        .then( response => response.json() )
        .then( function(response) {
                App.components.txtOutputNode.value = response["data"];
        });
    },

    onConvertClicked: function() {
      App.convertNode(
          App.components.txtInputNode.value, "nuke"
      )

    },

    onClearClicked: function() {
        App.components.txtOutputNode.value = "";
        App.components.txtInputNode.value = "";
        App.components.txtInputNode.focus();
    },

    onCopyClicked: function() {
        copyToClipboard(App.components.txtOutputNode.value);

        // Change button text for user feedback
        const originalText = App.components.btnCopy.innerHTML;
        App.components.btnCopy.innerHTML = "Copied!";
        setTimeout(function() {
            App.components.btnCopy.innerHTML = originalText;
        }, 2000)
    },

    onAboutClicked: function() {
        App.components.modalAbout.classList.add("active");
    },

    onAboutCloseClicked: function() {
        App.components.modalAbout.classList.remove("active");
    },

    onListClicked: function() {
        App.components.modalList.classList.add("active");
    },

    onListCloseClicked: function() {
        App.components.modalList.classList.remove("active");
    },

    onResHelpClicked: function() {
        App.components.modalResHelp.classList.add("active");
        event.preventDefault();
    },

    onResHelpCloseClicked: function() {
        App.components.modalResHelp.classList.remove("active");
    },

    onBodyClicked: function() {
      console.log(event.target)
        if (event.target.classList.contains('modal-overlay')) {
              App.components.modalList.classList.remove('active');
              App.components.modalAbout.classList.remove('active');
              App.components.modalResHelp.classList.remove('active');
        }
    },

}

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
        return clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

window.addEventListener("load", function () {
    App.init();
});
