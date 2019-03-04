(() => {

    let modalCss = `
        width: 20px;
        height: 20px;
        background-colo: green;
        position: absolute;
    `;

    let modalDiv = `<div id="highlightModal" style="${modalCss}">
                        
                    </div>`;

    window.onload = () => {
        loadModal();
    };

    window.onmouseup = () => {
        openHighlightModal();
    };

    /**
     * Creates the modal that shows up when something is selected
     */
    function loadModal() {
        console.log("Inserting Highlight Modal");
        document.body.innerHTML += modalDiv;
    }

    function openHighlightModal() {
        let modal = document.querySelector("#highlightModal");

        if (!isSomethingSelected()) {
            modal.style.display = "none";
            return;
        }


        modal.style.display = "block";
    }

    /**
     *
     * @return {boolean} TRUE if there is something(text or image) selected
     */
    function isSomethingSelected() {
        return window.getSelection().anchorOffset !== window.getSelection().focusOffset;
    }

})();
