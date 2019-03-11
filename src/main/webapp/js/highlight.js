let Highlight = (() => {
    let funcs = {};

    let highlightHost = "https://localhost:8181";

    let initialPos = {x: 0, y: 0};
    let finalPos = {x: 0, y: 0};

    // "UP" or "DOWN"
    let selectionDirection;

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

    window.onload = () => {
        loadCommonScript();

        loadModal();
        loadCss();
        loadNotificationModal();
    };

    window.onmousedown = (event) => {
        initialPos.x = event.pageX;
        initialPos.y = event.pageY;

    };

    window.onmouseup = (event) => {
        finalPos.x = event.pageX;
        finalPos.y = event.pageY;

        calculateSelectionDirection();
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

        modal.style.display = "block";
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
                completeInnerHTML += `<${c.tagName.toLowerCase()} ${getTagAttributes(c)}>` + c.innerHTML + getClosingTag(c.tagName.toLowerCase());
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

    function calculateSelectionDirection() {
        if (initialPos.y <= finalPos.y) {
            selectionDirection = "DOWN";
        } else {
            selectionDirection = "UP";
        }

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

    funcs.tweetSelection = () => {
        openTweetIntent(window.getSelection().getRangeAt(0).cloneContents().textContent, window.location.href);
    };

    function openTweetIntent(text, url = " ") {
        let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(tweetUrl);
    }

    function loadCss() {
        let css = document.createElement("style");
        css.type = "text/css";


        css.innerHTML = `
        #highlightModal::before, #highlightModal::after{
            content: "";
            position: absolute;
            width: 15px;
            height: 15px;
            background-color: white;
            transform: rotate(45deg);
            left: 50%;
            z-index: -1;
            }

        #highlightModal.up::before {
            box-shadow: -3px -3px 4px #0000004d;
            top: -17%;
        }
        
        #highlightModal.down::after {
            box-shadow: 3px 3px 4px #0003;
            top: 83%;
        }
        
        #highlightModal{
            background-color: rgb(252, 252, 252);
            display: none;
            position: absolute;
            padding: 5px 9px;
            z-index: 999;
            box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 6px 1px;
            border-radius: 21px;
        }
        
        .highlightModal-icon{
            width: 28px; 
            cursor: pointer;
        }
        
        #customSave-select{
            margin-bottom: 10px;
            font-size: 14px;
            padding: 3px
        }
        
        #highlightNotification{
            position: fixed;
            background-color: white;
            z-index: 99999;
            right: 0;
            top: 78px;
            padding: 9px 20px;
            box-shadow: 0 0 5px #00000080;
            border-radius: 6px 0 0 6px;
            display: none;
        }
        
        #highlightCustomSave{
            position: fixed;
            width: 326px;
            background-color: white;
            top: 15vh;
            right: 0px;
            box-shadow: 0 0 11px 2px #0003;
            border-radius: 7px 0 0 7px;
            padding: 10px;
            display: flex;
            flex-direction: column;
        }
        
        #customSaveContent{
            border: dashed 2px #0003;
            padding: 2px;
            margin-bottom: 12px; 
            max-height: 250px; 
            overflow-y: auto; 
            font-size: 14px;
        }
        
        #customSave-saveButton{
            background-color: #0070ff;
            width: max-content;
            align-self: center;
            padding: 9px 7px;
            color: #fff;
            border-radius: 4px; 
            font-size: 15px;
        }
        `;

        document.head.appendChild(css);
    }

    return funcs;
})();