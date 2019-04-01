let Highlight = {}; // Just to make it easier to create templates

export let highlightHost = "https://page-highlight.com:8181";

//TODO improve highlight-plus icon
//TODO create icon sprite
let modalDiv = `<div id="highlightModal">
                    <img id="highlightModal-iconSave" class="highlightModal-icon" src="${highlightHost}/icons/highlight.png"
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

let notLoadedNotification =
    `<div id="highlight-notLoadedNotification">
        <span style="margin-bottom: 8px;">The Highlight Modal has not been loaded correctly. Do you wish to reload it?</span>
        <div>
            <button class="hl-nln-button" onclick="Highlight.notLoadedNotification.reload();">Reload</button>
            <button class="hl-nln-button" onclick="Highlight.notLoadedNotification.close()">No</button>
            <div id="hl-nln-checkboxContainer">
                <div id="hl-nln-checkbox" onclick="Highlight.notLoadedNotification.rememberOption()"></div>
                <span style="margin-left: 7px;">Remember option for this website</span>            
            </div>
        </div>
    </div>`;

let authenticateModal =
    `<div id="highlight-backgroundCover" class="highlight-modal highlight-cover" onclick="Highlight.closeBackgroundCover()"></div>
    <div id="highlight-authenticateModal" class="highlight-modal highlight-cover">
        <div class="authModal-heading">Use Highlight as:</div>
        <div class="authModal-container">
            <div class="authModal-button login" onclick="Highlight.authenticateModal.asUser()">User</div>
            <div class="authModal-button guest" onclick="Highlight.authenticateModal.asGuest()">Guest</div>        
        </div>
    </div>`;

let displayer = `
    <div id="highlight-displayer">
        <div style="display: flex;justify-content: space-between; margin-left: 7px;">
            <h5 id="hl-displayer-header">Highlights</h5>
            <div class="hl-close-icon displayer" onclick="highlightDisplayer.hide()"></div>
        </div>
        <div id="hl-displayerList">
            <!--Highlights go here-->
        </div>
        <div style="margin-left: 7px">
            <a href="${highlightHost}/dashboard" target="_blank">See all your Highlights -></a>
        </div>
    </div>`;

let displayerHighlight = (content) => {
    return `
    <div class="hl-highlight">
        ${content}
    </div>
    `;
};

let tag = (text) =>{
    return `<div class="document-tag">${text}</div>`;
};

export {
    modalDiv,
    notificationDiv,
    customSaveDiv,
    notLoadedNotification,
    authenticateModal,
    displayer,
    displayerHighlight,
    tag
}