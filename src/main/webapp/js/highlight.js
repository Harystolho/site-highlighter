(() => {

    let modalCss = `
        background-color: rgb(246, 246, 246);
        display: block;
        position: absolute;
        padding: 3px;
    `;

    let modalDiv = `<div id="highlightModal" style="${modalCss}">
                        H
                    </div>`;

    window.onload = () => {
        loadModal();
    };

    window.onmouseup = (event) => {
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
        modal.style.top = `${event.clientY}px`;
        modal.style.left = `${event.clientX}px`;
    }

    /**
     *
     * @return {boolean} TRUE if there is something(text or image) selected
     */
    function isSomethingSelected() {
        return window.getSelection().anchorOffset !== window.getSelection().focusOffset;
    }

})();
