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

let singleInputModal = (question) => {
    return `<div id="singleInputModal" class="dashboard-modal">
                        <div class="dashboard-modal__header">
                            <h4>${question}</h4>
                        </div>
                        <div class="dashboard-modal__content">
                            <input id="singleInputModal_input" type="text"> 
                        </div>
                        <div class="dashboard-modal__footer">
                            <button onclick="Dashboard.functions.singleInputOk(document.getElementById('singleInputModal_input').value)">Ok</button>
                            <button onclick="Dashboard.modalContainer.hide()">Close</button>
                        </div>
                        </div>`;
};

let confirmModal = (question) => {
    return `<div id="confirmModal" class="dashboard-modal">
                        <div class="dashboard-modal__header">
                            <h4>${question}</h4>
                        </div>
                        <div class="dashboard-modal__footer">
                            <button onclick="Dashboard.functions.confirmOk()">Confirm</button>
                            <button onclick="Dashboard.modalContainer.hide()">Close</button>
                        </div>
                        </div>`;
};

export {
    tagTemplate,
    tagDocumentTemplate,
    singleInputModal,
    confirmModal,
    librarySiteTemplate
}