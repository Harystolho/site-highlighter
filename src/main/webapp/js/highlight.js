(() => {

    let highlightHost = "https://localhost:8181";

    let initialPos = {x: 0, y: 0};
    let finalPos = {x: 0, y: 0};

    // "UP" or "DOWN"
    let selectionDirection;

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

    window.onload = () => {
        loadCommonScript();

        loadModal();
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

    function loadCommonScript() {
        let script = document.createElement('script');
        script.async = true;script.type = 'text/javascript';
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
     * Shows or hides the modal that is used to highlight content
     * @param event
     */
    function openHighlightModal(event) {
        let modal = document.querySelector("#highlightModal");

        if (!isSomethingSelected()) {
            modal.style.display = "none";
            return;
        }

        modal.style.display = "block";

        //parseFloat(window.getComputedStyle(event.target, null).getPropertyValue("font-size").slice(0, -2));

        if (selectionDirection === "DOWN") {
            modal.style.top = `${initialPos.y - (modal.offsetHeight * 1.5)}px`;
            modal.style.left = `${initialPos.x}px`;
        } else {
            modal.style.top = `${finalPos.y - (modal.offsetHeight * 1.5)}px`;
            modal.style.left = `${finalPos.x}px`;
        }
    }

    window.saveSelection = function () {
        let selectedText = getSelectedText();

        // TODO display some kind of notification to show if the highlight was saved or failed
        document.querySelector("#highlightModal").style.display = "none";

        sendSelectionToServer(selectedText, (status) => {
            if (status === "OK") {
                window.getSelection().removeAllRanges();
            }

        });
    };

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
        xhttp.send(`id=${Highlight.id}&text=${encodeURIComponent(selection)} 
            &path=${window.location.host + window.location.pathname}&title=${document.title}`);
    }

    function getSelectedText() {
        let range = window.getSelection().getRangeAt(0);

        let fragments = range.cloneContents();
        let completeInnerHTML = "";

        Array.from(fragments.childNodes).forEach((c) => {
            if (c.tagName === undefined) { // If the child is not an html tag
                completeInnerHTML += c.textContent;
            } else { // If the child is a html tag
                completeInnerHTML += `<${c.tagName.toLowerCase()} ${getTagAttributes(c)}>` + c.innerHTML + getClosingTag(c.tagName.toLowerCase());
            }
        });

        return completeInnerHTML;
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
        xhttp.send(`id=${Highlight.id}&path=${window.location.host + window.location.pathname}`);
    }

})();