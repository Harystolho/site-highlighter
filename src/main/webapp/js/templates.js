let Highlight = {}; // Just to make it easier to create templates

export let highlightHost = "https://localhost:8181";

//TODO improve highlight-plus icon
//TODO create icon sprite
let modalDiv = `<div id="highlightModal">
                    <img class="highlightModal-icon" src="${highlightHost}/icons/highlight.png" 
                    onclick="Highlight.saveSelection()">
                    <img class="highlightModal-icon" src="${highlightHost}/icons/highlight-plus.png" style="margin: 0 0 0 5px;"
                    onclick="Highlight.openCustomSaveModal()">
                    <div id="highlightSocialMedia">
                        <img class="highlightSocialMedia__icon" src="${highlightHost}/icons/twitter-icon.png" onclick="Highlight.shareSelectionTwitter()">
                        <img class="highlightSocialMedia__icon" src="${highlightHost}/icons/fb-icon.png" onclick="Highlight.shareSelectionFacebook()">
                    </div>
                    <img id="highlight_shareSocialIcon" class="highlightModal-icon" src="${highlightHost}/icons/share.png" style="margin: 0 5px;"
                    onclick="Highlight.socialMediaIconOnHover()">
                    <img class="highlightModal-icon" src="${highlightHost}/icons/gear.png" onclick="">
                </div>`;

let notificationDiv = `<div id="highlightNotification">
                    Saved Highlight!
                    </div>`;

let customSaveDiv = `<div id="highlightCustomSave">
                    <select id="customSave-select">
                        <option value="0">${document.title}</option>
                    </select>
                    <div id="customSaveContent" contenteditable="true">
                    </div>
                    <button id="customSave-saveButton" onclick="Highlight.saveCustomModalText()">Save Highlight</button>
                    </div>`;

let singleInputModal = (question) => {
    return `<div id="singleInputModal">
                        <div class="singleInputModal__header">
                            <h4>${question}</h4>
                        </div>
                        <div class="singleInputModal__content">
                            <input id="singleInputModal_input" type="text"> 
                        </div>
                        <div class="singleInputModal__footer">
                            <button onclick="Dashboard.functions.singleInputOk(document.getElementById('singleInputModal_input').value)">Ok</button>
                            <button onclick="document.getElementById('singleInputModal').remove();">Close</button>
                        </div>
                        </div>`;
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
        </h5>
    </div>
    `;
};

let notLoadedNotification =
    `<div id="highlight-notLoadedNotification">
        <span style="margin-bottom: 8px;">The Highlight Modal has not been loaded correctly. Do you wish to reload it?</span>
        <div>
            <button class="hl-nln-button" onclick="Highlight.reloadModal();">Reload</button>
            <button class="hl-nln-button" onclick="document.getElementById('highlight-notLoadedNotification').remove();">No</button>
            <div id="hl-nln-checkboxContainer">
                <div id="hl-nln-checkbox"></div>
                <span style="margin-left: 7px;">Remember option for this website</span>            
            </div>
        </div>
    </div>`;

export {
    modalDiv, notificationDiv, customSaveDiv, singleInputModal, librarySiteTemplate, notLoadedNotification
}