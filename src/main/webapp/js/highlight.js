(() => {

    let highlightHost = "http://localhost:8080";

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
    `;

    let modalDiv = `<div id="highlightModal" style="${modalCss}">
                        <img src="https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fcool-application-icons%2F512%2Fpencil-512.png&f=1" style="width:28px; cursor: pointer"
                        onclick="saveSelection()">
                    </div>`;

    window.onload = () => {
        loadModal();
    };

    window.onmousedown = (event) => {
        initialPos.x = event.layerX;
        initialPos.y = event.layerY;
    };

    window.onmouseup = (event) => {
        finalPos.x = event.layerX;
        finalPos.y = event.layerY;

        calculateSelectionDirection();
        openHighlightModal(event);
    };

    /**
     * Creates the modal that shows up when something is selected
     */
    function loadModal() {
        console.log("Inserting Highlight Modal");
        document.body.innerHTML += modalDiv;
    }

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

        sendSelectionToServer(selectedText, (status) => {
            if (status === "OK")
                window.getSelection().removeAllRanges();
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
        xhttp.send(`id=${Highlight.id}&text=${selection}&path=${window.location.host + window.location.pathname}`);
    }

    function getSelectedText() {
        let range = window.getSelection().getRangeAt(0);

        return range.cloneContents().textContent;
    }

    function calculateSelectionDirection() {
        if (initialPos.y <= finalPos.y) {
            selectionDirection = "DOWN";
        } else {
            selectionDirection = "UP";
        }
    }

    /**
     *
     * @return {boolean} TRUE if there is something(text or image) selected
     */
    function isSomethingSelected() {
        return window.getSelection().anchorOffset !== window.getSelection().focusOffset;
    }


})();