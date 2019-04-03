let tagTemplate = (name) => {
    return `
  <div class="tagLibrary--tag" onclick="Dashboard.displayDocumentsByTag('${name}')">
    <span>${name}</span>
  </div>
  `;
};

let tagDocumentTemplate = (title, id) => {
    return `
  <div class="tagLibrary--doc" onclick="ContentEditor.displayDocumentContent('${id}')">
    <span class="library-template-title">${title}</span>
  </div>
  `;
};

let librarySiteTemplate = (title, url, id) => {
    return `
    <div class="library-template-container" data-id="${id}">
        <h5 class="library-template-title">
            <span onclick="ContentEditor.displayDocumentContent('${id}')">${title}</span>
            <!-- Most sites redirect to HTTPS-->
            <a href="http://${url}" target="_blank"> 
                <img class="library-template-external-link" src="/icons/external-link.png">
            </a>
            <div class="library-template-external-link" onclick="Dashboard.renameDocument('${id}')">
                <img src="icons/gear.png" width="20px">            
            </div>
        </h5>
    </div>
    `;
};

class InputModal {
    constructor() {
        this.html = ``;
    }

    _create() {
        let template = document.createElement('template');
        template.innerHTML = this.html.trim();

        this._element = template.content.firstChild;
    }

    /**
     * @return {HTMLElement}
     */
    getElement() {
        return this._element;
    }

    display(){
        Dashboard.modalContainer.show(this.getElement());
    }

    hide() {
        Dashboard.modalContainer.hide();
    }

    /**
     * Subclass should IMPLEMENT this method if they wish to use it
     *
     * Only call this method after this._element has been created.
     * @private
     */
    _addEventHandlers() {
    }

    closeEventHandler() {
        this.getElement().querySelector('.dashboardModalClose').addEventListener('click',
            () => this.hide(), false);
    }
}

class SingleInputModal extends InputModal {
    constructor(title, options = {}, cb) {
        if (title === undefined)
            throw "Title can't be undefined";

        super();

        this._options = options;
        this._cb = cb;

        this.html =
            `<div id="singleInputModal" class="dashboard-modal">
                <div class="dashboard-modal__header">
                    <h4>${title}</h4>
                </div>
                <div class="dashboard-modal__content">
                    <input id="singleInputModal_input" type="text"> 
                </div>
                <div class="dashboard-modal__footer">
                    <button id="dashboardModalSIMOk">Ok</button> 
                    <button class="dashboardModalClose">Close</button>
                </div>
            </div>`;

        this._create();

        this._addEventHandlers();
    }

    /**
     * Only call this method after this._element has been created. It's usually created in the _create function
     * @private
     */
    _addEventHandlers() {
        this.closeEventHandler();

        this.getElement().querySelector('#dashboardModalSIMOk').addEventListener('click',
            () => this._cb(this.inputValue(), this.hide), false);
    }

    display() {
        Dashboard.modalContainer.show(this.getElement());

        $id('singleInputModal_input').value = this._options.value === undefined ? "" : this._options.value;
        $id('singleInputModal_input').select();
    }

    inputValue() {
        return this.getElement().querySelector('#singleInputModal_input').value;
    }
}

class ConfirmModal extends InputModal {
    constructor(question, cb) {
        if (question === undefined)
            throw "Question can't be undefined";

        super();

        this._cb = cb;

        this.html =
            `<div id="confirmModal" class="dashboard-modal">
                <div class="dashboard-modal__header">
                    <h4>${question}</h4>
                </div>
                <div class="dashboard-modal__footer">
                    <button id="dashboardModalCMConfirm" onclick="">Confirm</button>
                    <button class="dashboardModalClose">Close</button>
                </div>
            </div>`;

        this._create();

        this._addEventHandlers();
    }


    _addEventHandlers() {
        this.closeEventHandler();

        this.getElement().querySelector('#dashboardModalCMConfirm').addEventListener('click',
            () => this._cb(this.hide), false);
    }
}

export {
    tagTemplate,
    tagDocumentTemplate,
    SingleInputModal,
    ConfirmModal,
    librarySiteTemplate
}