import '../css/highlight.css';

import * as common from "./common";
import * as axios from 'axios';
import * as templates from './templates';
import {highlightHost} from './templates';

window.Highlight = (() => {
    let funcs = {};

    let finalPos = {x: 0, y: 0};

    let options = {
        triedReload: false
    };

    let shortcutKey = {
        keyCode: 73,
        altKey: true,
        shiftKey: false,
        ctrlKey: false
    };

    const DOCUMENT_STATUS = {
        WOOD: "WOOD",
        GOLD: "GOLD"
    };

    window.onload = () => {
        loadModal();

        loadNotificationModal();
    };

    window.onmouseup = (event) => {
        finalPos.x = event.pageX;
        finalPos.y = event.pageY;

        openHighlightModal(event);
    };

    window.onkeyup = (event) => {
        if (event.keyCode === shortcutKey.keyCode && event.altKey === shortcutKey.altKey
            && event.shiftKey === shortcutKey.shiftKey && event.ctrlKey === shortcutKey.ctrlKey) { // 'i'
            saveSelectionUsingShortcut();
        }
    };

    /**
     * Adds the modal div to the DOM
     */
    function loadModal() {
        if (document.getElementById("highlightModal") === null) {
            console.log("Inserting Highlight Modal");
            document.body.innerHTML += templates.modalDiv;
        }
    }

    /**
     * The notification modal is a div that appears when something is highlighted. Adds the highlight notificaiton modal
     * to the DOM
     */
    function loadNotificationModal() {
        if (document.getElementById("highlightNotification") === null) {
            document.body.innerHTML += templates.notificationDiv;
        }
    }

    function showNotificationModal(msg = "Saved Highlight!", duration = 1000) {
        let notif = document.querySelector("#highlightNotification");

        if (notif !== null) {
            notif.innerHTML = msg;
            notif.style.display = "block";

            setTimeout(() => {
                notif.style.display = "none";
            }, duration);
        }
    }

    /**
     * Shows or hides the modal that is used to highlight content
     * @param event
     */
    function openHighlightModal(event) {
        let modal = document.querySelector("#highlightModal");

        // If the click was inside the modal
        if (modal !== null && modal.contains(event.target))
            return;

        if (!isSomethingSelected()) {
            if (modal !== null)
                modal.style.display = "none";
            return;
        }

        if (modal === null) {
            displayNotLoadedMessage();
            return;
        }

        // TODO don't show the modal inside the custom modal if the user opened the custom save modal

        const modalOffset = 15;
        let rect = getFirstRect(Array.from(window.getSelection().getRangeAt(0).getClientRects()));

        modal.style.left = `${rect.x + (rect.width / 2) - (modal.offsetWidth / 2)}px`;
        modal.classList.add("down");
        modal.classList.remove("up");

        // Display the modal before calling modal.offsetHeight() because otherwise it'd return 0
        modal.style.display = "flex";

        //          text position |  modal height     |   padding      |   window y
        modal.style.top = rect.y - modal.offsetHeight - modalOffset + window.scrollY + "px";
    }

    /**
     * Returns the DOMRect with the lowest y
     * @param rects {Array}
     */
    function getFirstRect(rects) {
        let lowest = rects[0];

        rects.forEach((rect) => {
            if (rect.y < lowest.y)
                lowest = rect;
        });

        return lowest;
    }

    funcs.saveSelection = function () {
        let selectedText = getSelectedText();

        closeHighlightModal();

        sendSelectionToServer(selectedText, (status) => {
            if (status === "OK") {
                showNotificationModal();

                try {
                    highlightSelectionInPage();
                } catch (err) {
                    // TODO select when there is more than one div
                }

                window.getSelection().removeAllRanges();
            } else {
                showNotificationModal("Error saving highlight", 5000);
            }
        });

    };

    /**
     * Saves the text from the custom save modal(#highlightCustomSave)
     */
    funcs.saveCustomModalText = () => {
        let content = document.querySelector("#customSaveContent").innerHTML;

        let docId = document.getElementById("customSave-select").value;

        // This means the selected document is the current page
        if (docId === '0') {
            return sendSelectionToServer(content, (status) => {
                serverResponse(status);
            });
        }

        sendSelectionToServerWithDocumentId(content, docId, (response) => {
            serverResponse(response.status);
        });

        function serverResponse(status) {
            document.querySelector("#highlightCustomSave").remove();

            if (status === 200 || status === 'OK') {
                showNotificationModal();
                highlightSelectionInPage(); // TODO fix this
                window.getSelection().removeAllRanges();
            } else {
                showNotificationModal("Error saving highlight", 5000);
            }
        }
    };

    /**
     * Opens the Custom Save modal to edit the highlight before saving it
     */
    funcs.openCustomSaveModal = () => {
        let selectedText = getSelectedText();

        // Don't add this before getting the text because it removes all ranges when it adds
        if (document.querySelector("#highlightCustomSave") === null)
            loadCustomSaveModal();

        closeHighlightModal();

        addDocumentsToCustomSelect();

        document.querySelector("#customSaveContent").innerHTML = selectedText;
    };

    function closeHighlightModal() {
        document.querySelector("#highlightModal").style.display = "none";
    }

    function loadCustomSaveModal() {
        document.body.innerHTML += templates.customSaveDiv;
    }

    function saveSelectionUsingShortcut() {
        if (isSomethingSelected()) {
            Highlight.saveSelection();
        }
    }

    function sendSelectionToServer(selection, cb) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);
                cb(response.error);
            }
        };

        xhttp.open("POST", `${highlightHost}/api/v1/save`, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(`text=${encodeURIComponent(selection)}
            &path=${window.location.host + window.location.pathname}
            &title=${encodeURIComponent(document.title)}`);
    }

    /**
     * Adds the {selection} to an existing document using it's id
     * @param selection
     * @param id the document's id
     * @param cb
     */
    function sendSelectionToServerWithDocumentId(selection, id, cb) {
        let formData = new FormData();
        formData.append("text", selection);

        axios.post(`${highlightHost}/api/v1/save/${id}`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then((response) => {
            cb(response);
        });
    }

    function getSelectedText() {
        let range = window.getSelection().getRangeAt(0);

        let fragments = range.cloneContents();
        let completeInnerHTML = "<div>";

        Array.from(fragments.childNodes).forEach((c) => {
            if (c.tagName === undefined) { // If the child is not an html tag
                completeInnerHTML += c.textContent;
            } else { // If the child is a html tag
                completeInnerHTML += `<${c.tagName.toLowerCase()} ${common.getTagAttributes(c)}>` + c.innerHTML + common.getClosingTag(c.tagName.toLowerCase());
            }
        });

        return completeInnerHTML + "</div><div><br></div>";
    }

    /**
     * Adds a <span> tag arround the selection to indicate it was highlighted
     */
    function highlightSelectionInPage() {
        let highlightSpan = document.createElement("span");

        highlightSpan.style.backgroundColor = "#fffd7c";

        window.getSelection().getRangeAt(0).surroundContents(highlightSpan);
    }

    /**
     * Opens a window to manage the highlights. How this function is called varies from site to site, some may choose
     * to add a button or an icon, but that doesn't interfere with the functionality
     */
    funcs.openHighlightsFrame = () => {

    };

    /**
     *
     * @return {boolean} TRUE if there is something(text or image) selected
     */
    function isSomethingSelected() {
        return window.getSelection().anchorOffset !== window.getSelection().focusOffset;
    }

    function displayNotLoadedMessage() {
        if (!options.triedReload) {
            if (confirm("Highlight script is not loaded correctly. Try to load again?")) {
                window.onload();
            }
            options.triedReload = true;
        }
    }

    /**
     * Adds the documents that have the DOCUMENT_STATUS.GOLD to the #customSave-select select
     */
    function addDocumentsToCustomSelect() {
        getDocumentsThatMatchStatus(DOCUMENT_STATUS.GOLD, (response) => {
            let docs = response.data.data;

            let select = document.getElementById("customSave-select");

            // Remove existing options
            Array.from(document.getElementsByClassName('gold-document')).forEach((opt) => opt.remove());

            docs.forEach((doc) => {
                let option = document.createElement("option");
                option.classList.add('gold-document');

                option.innerHTML = doc.title;
                option.value = doc.id;

                select.appendChild(option);
            });
        });
    }

    funcs.socialMediaIconOnHover = () => {
        let container = document.getElementById("highlightSocialMedia");

        if (container.classList.contains('social-show')) {
            container.classList.remove('social-show');
        } else {
            container.classList.add('social-show');
        }
    };

    /**
     *
     * @param status {DOCUMENT_STATUS|String}
     * @param cb
     */
    function getDocumentsThatMatchStatus(status, cb) {
        axios.get(`${highlightHost}/api/v1/document/status/${status}`).then((response) => {
            cb(response);
        });
    }

    let socialMediaWindowFeatures = "width=580,height=720";

    funcs.shareSelectionFacebook = () => {
        let fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&
        quote=${encodeURIComponent(window.getSelection().getRangeAt(0).cloneContents().textContent)}`;


        window.open(fbUrl, "", socialMediaWindowFeatures);
    };

    funcs.shareSelectionTwitter = () => {
        openTweetIntent(window.getSelection().getRangeAt(0).cloneContents().textContent, window.location.href);

        function openTweetIntent(text, url = " ") {
            let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(tweetUrl, "", socialMediaWindowFeatures);
        }
    };


    return funcs;
})();