(() => {

    let initialPos = {x: 0, y: 0};
    let finalPos = {x: 0, y: 0};

    // "UP" or "DOWN"
    let selectionDirection;

    let modalCss = `
        background-color: rgb(246, 246, 246);
        display: block;
        position: absolute;
        padding: 3px;
    `;

    let modalDiv = `<div id="highlightModal" style="${modalCss}">
                        <img src="https://image.flaticon.com/icons/svg/25/25688.svg" style="width:28px;">
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

    function openHighlightModal(event) {
        let modal = document.querySelector("#highlightModal");

        if (!isSomethingSelected()) {
            modal.style.display = "none";
            return;
        }

        modal.style.display = "block";

        if (selectionDirection === "DOWN") {
            modal.style.top = `${initialPos.y - modal.offsetHeight}px`;
            modal.style.left = `${initialPos.x}px`;
        } else {

        }
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