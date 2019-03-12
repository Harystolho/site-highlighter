import '../css/highlight.css';

import * as common from "./common";
import * as axios from 'axios';

window.Highlight = (() => {
    let funcs = {};

    let highlightHost = "https://localhost:8181";

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

    //TODO improve highlight-plus icon
    let modalDiv = `<div id="highlightModal">
                        <img class="highlightModal-icon" src="${highlightHost}/icons/highlight.png" 
                        onclick="Highlight.saveSelection()">
                        <img class="highlightModal-icon" src="${highlightHost}/icons/highlight-plus.png" style="margin: 0 0 0 5px;"
                        onclick="Highlight.openCustomSaveModal()">
                        <img class="highlightModal-icon" src="${highlightHost}/icons/share.png" style="margin: 0 5px;"
                        onclick="Highlight.tweetSelection()">
                        <img class="highlightModal-icon" src="${highlightHost}/icons/gear.png" onclick="">
                    </div>`;

    let notificationDiv = `<div id="highlightNotification">
                    Saved Highlight!
                    </div>`;

    let customSaveDiv = `<div id="highlightCustomSave">
                    <select id="customSave-select">
                        <option value="0">${document.title}</option>
                        <option>Common Document 1</option>
                        <option>Common Document 2</option>
                        <option>Common Document 3</option>
                    </select>
                    <div id="customSaveContent" contenteditable="true">
                    </div>
                    <button id="customSave-saveButton" onclick="Highlight.saveCustomModalText()">Save Highlight</button>
                    </div>`;

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

    function loadCommonScript() {
        let script = document.createElement('script');
        script.async = true;
        script.type = 'text/javascript';
        script.src = `${highlightHost}/js/common.js`;
        let node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(script, node);
    }

    /**
     * Creates the modal that shows up when something is selected
     */
    function loadModal() {
        console.log("Inserting Highlight Modal");
        // TODO make sure the modal is only inserted once
        document.body.innerHTML += modalDiv;
    }

    /**
     * The notification modal is a div that appears when something is highlighted
     */
    function loadNotificationModal() {
        document.body.innerHTML += notificationDiv;
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

        // TODO don't show the modal if the user opened the custom save modal

        const modalOffset = 15;
        let rect = getFirstRect(Array.from(window.getSelection().getRangeAt(0).getClientRects()));

        modal.style.top = rect.y - modal.offsetHeight - modalOffset + window.scrollY + "px";

        //TODO fix modal x-axis position
        modal.style.left = `${finalPos.x}px`;
        modal.classList.add("down");
        modal.classList.remove("up");

        modal.style.display = "flex";
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
                highlightSelectionInPage();
                window.getSelection().removeAllRanges();
            } else {
                showNotificationModal("Error saving highlight", 5000);
            }
        });
        ``
    };

    /**
     * Saves the text from the custom save modal(#highlightCustomSave)
     */
    funcs.saveCustomModalText = () => {
        let content = document.querySelector("#customSaveContent").innerHTML;

        sendSelectionToServer(content, (status) => {
            document.querySelector("#highlightCustomSave").remove();

            if (status === "OK") {
                showNotificationModal();
                highlightSelectionInPage(); // TODO fix this
                window.getSelection().removeAllRanges();
            } else {
                showNotificationModal("Error saving highlight", 5000);
            }
        });
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
        document.body.innerHTML += customSaveDiv;
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
        let select = document.getElementById("customSave-select");

        getDocumentsThatMatchStatus(DOCUMENT_STATUS.GOLD, (data)=>{
            console.log(data);
        });


    }

    /**
     *
     * @param status {DOCUMENT_STATUS|String}
     * @param cb
     */
    function getDocumentsThatMatchStatus(status, cb) {
        axios.get(`${highlightHost}/api/v1/document/status/${status}`).then((response)=>{
           cb(response);
        });
    }

    funcs.tweetSelection = () => {
        openTweetIntent(window.getSelection().getRangeAt(0).cloneContents().textContent, window.location.href);
    };

    function openTweetIntent(text, url = " ") {
        let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(tweetUrl);
    }

    return funcs;
})();