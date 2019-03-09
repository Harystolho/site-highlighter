(() => {

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
        background-color: rgb(240, 240, 240);
        display: block;
        position: absolute;
        padding: 3px;
        width: 78px;
        border-radius: 4px;
        box-shadow: 0 0 3px 2px #0000004d;
        z-index: 999;
    `;

    let modalDiv = `<div id="highlightModal" style="${modalCss}">
                        <img src="https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fcool-application-icons%2F512%2Fpencil-512.png&f=1" style="width:28px; cursor: pointer"
                        onclick="saveSelection()">
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
        document.body.innerHTML += modalDiv;
    }

    window.loadModalWrapper = () => {
        loadModal();
    };

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

        if (!isSomethingSelected()) {
            if (modal !== null)
                modal.style.display = "none";
            return;
        }

        if (modal === null) {
            displayNotLoadedMessage();
            return;
        }

        //parseFloat(window.getComputedStyle(event.target, null).getPropertyValue("font-size").slice(0, -2));

        if (selectionDirection === "DOWN") {
            modal.style.top = `${initialPos.y - (modal.offsetHeight * 1.5)}px`;
            modal.style.left = `${initialPos.x}px`;
        } else {
            modal.style.top = `${finalPos.y - (modal.offsetHeight * 1.5)}px`;
            modal.style.left = `${finalPos.x}px`;
        }

        modal.style.display = "block";
    }

    window.saveSelection = function () {
        let selectedText = getSelectedText();

        document.querySelector("#highlightModal").style.display = "none";

        sendSelectionToServer(selectedText, (status) => {
            if (status === "OK") {
                highlightSelectionInPage();
                window.getSelection().removeAllRanges();
                showNotificationModal();
            } else {
                showNotificationModal("Error saving highlight", 5000);
            }
        });
        ``
    };

    function saveSelectionUsingShortcut() {
        if (isSomethingSelected()) {
            saveSelection();
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
    window.openHighlightsFrame = () => {

    };

    /**
     *
     * @return {boolean} TRUE if there is something(text or image) selected
     */
    function isSomethingSelected() {
        return window.getSelection().anchorOffset !== window.getSelection().focusOffset;
    }

    window.listHighlights = () => {
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

})
();