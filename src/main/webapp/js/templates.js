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

export {
    modalDiv, notificationDiv, customSaveDiv
}