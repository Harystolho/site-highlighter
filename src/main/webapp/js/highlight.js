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

    let modalCss = `
        background-color: rgb(252, 252, 252);
        display: none;
        position: absolute;
        padding: 5px 9px;
        z-index: 999;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 6px 1px;
        border-radius: 21px;
    `;

    let cursorCss = `
        width: 28px; 
        cursor: pointer;
    `;

    //TODO improve highlight-plus icon
    let modalDiv = `<div id="highlightModal" style="${modalCss}">
                        <img src="${highlightHost}/icons/highlight.png" style="${cursorCss}"
                        onclick="Highlight.saveSelection()">
                        <img src="${highlightHost}/icons/highlight-plus.png" style="${cursorCss} margin: 0 0 0 5px;"
                        onclick="Highlight.saveSelectionCustomMode()">
                        <img src="${highlightHost}/icons/share.png" style="${cursorCss} margin: 0 5px;"
                        onclick="Highlight.tweetSelection()">
                        <img src="${highlightHost}/icons/gear.png" style="${cursorCss}"
                        onclick="">
                    </div>`;

    let notificationCss = `
        position: fixed;
        background-color: white;
        z-index: 99999;
        right: 17px;
        top: 78px;
        padding: 9px 20px;
        box-shadow: 0 0 5px #00000080;
        border-radius: 6px;
        display: none;
    `;

    let notificationDiv = `<div id="highlightNotification" style="${notificationCss}">
                    Saved Highlight!
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

    function loadCss() {
        let css = document.createElement('style');

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
        }`;

        let node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(css, node);
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
        if(modal !== null && modal.contains(event.target))
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

        document.querySelector("#highlightModal").style.display = "none";

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

    funcs.saveSelectionCustomMode = () => {

    };

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

    funcs.listHighlights = () => {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);

            }
        };

        xhttp.open("POST", `${highlightHost}/api/v1/highlight`, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(`path=${window.location.host + window.location.pathname}`);
    };

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

    return funcs;
})();