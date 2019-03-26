import '../css/highlight.css';

import * as common from "./common";
import {Logger as LoggerClass} from "./common";
import * as axios from 'axios';
import * as templates from './templates';
import {highlightHost} from './templates';

let Logger = new LoggerClass();

window.Highlight = (() => {
    let funcs = {};

    let finalPos = {x: 0, y: 0};
    let savedHighlightMsg = `Saved Highlight!<br><div id="savedHighlightMsg" onclick="highlightDisplayer.display()">View my Highlights</div>`;

    let options = {
        on: true, /*If true, show highlight modal when something is selected*/
        loadingTimeout: 4500 /*Time to wait before checking if the modal has been loaded correctly*/
    };

    let shortcutKey = {
        keyCode: 73,
        altKey: true,
        shiftKey: false,
        ctrlKey: false
    };

    const DOCUMENT_STATUS = {
        WOOD: "WOOD",
        GOLD: "GOLD"
    };

    /**
     * Reference to an object that has the functions used to highlight the page.
     *
     * USER: Used when the user is authenticated, the requests are sent to the server. {@link accountMode}
     * GUEST: Used when the user chooses to user the Highlight script as a guest, the highlights are stored in
     *  the local browser. {@link guestMode}
     */
    //let userMode = undefined;

    window.addEventListener('message', (event) => {
        if (event.origin === window.location.origin && event.data === 'highlight.load') {
            funcs.load();
        }
    }, false);

    window.addEventListener('mouseup', (event) => {
        finalPos.x = event.pageX;
        finalPos.y = event.pageY;

        openHighlightModal(event);
    }, false);

    window.addEventListener('keyup', (event) => {
        if (!isHighlightEnabled())
            return;

        if (event.keyCode === shortcutKey.keyCode && event.altKey === shortcutKey.altKey
            && event.shiftKey === shortcutKey.shiftKey && event.ctrlKey === shortcutKey.ctrlKey) { // 'i'
            saveSelectionUsingShortcut();
        }
    }, false);

    /**
     * Loads the Highlight script
     */
    funcs.load = () => {
        loadModal();

        loadNotificationModal();

        checkModalLoaded();
    };

    /**
     * Adds the modal div to the DOM
     */
    function loadModal() {
        if (document.getElementById("highlightModal") === null) {
            Logger.log("Insert Highlight Modal");
            document.body.innerHTML += templates.modalDiv;
        }
    }

    /**
     * The notification modal is a div that appears when something is highlighted. Adds the highlight notificaiton modal
     * to the DOM
     */
    function loadNotificationModal() {
        if (document.getElementById("highlightNotification") === null)
            document.body.innerHTML += templates.notificationDiv;
    }

    /**
     * Checks if the modal has been loaded correctly after {@link options.loadingTimeout} milliseconds. If the modal is
     * not loaded a notification{templates#notLoadedNotification} is shown
     */
    function checkModalLoaded() {
        Logger.log("Start timeout to check if modal is loaded");

        setTimeout(() => {
            if (document.querySelector("#highlightModal") === null) {
                if (localStorage.getItem('hl-nln-autoReload') === "true") {
                    Logger.log("Auto reload enabled [hl-nln-autoReload=true]");
                    funcs.load();
                } else if (localStorage.getItem('hl-nln-autoReload') === "false") {
                    Logger.log("Auto reload disabled [hl-nln-autoReload=false]");
                } else {
                    Logger.log("Show Not Loaded Notification");
                    showNotLoadedNotification();
                }
            }
        }, options.loadingTimeout);
    }

    //TODO add options to change bg color
    /**
     * @param msg
     * @param duration {int} if the {duration} is smaller than 0 ms the modal won't get closed
     */
    function showNotificationModal(msg = savedHighlightMsg, duration = 3000) {
        let notification = document.querySelector("#highlightNotification");

        if (notification !== null) {
            notification.innerHTML = msg;
            notification.style.display = "block";

            if (duration > 0)
                setTimeout(() => {
                    document.querySelector("#highlightNotification").style.display = "none";
                }, duration);
        }
    }

    /**
     * Shows or hides the modal that is used to highlight content
     * @param event
     */
    function openHighlightModal(event) {
        if (!isHighlightEnabled())
            return;

        let modal = document.querySelector("#highlightModal");

        // If the click was inside the modal
        if (modal !== null && modal.contains(event.target))
            return;

        if (!isSomethingSelected()) {
            if (modal !== null)
                modal.style.display = "none";
            return;
        }

        if (modal === null)
            return;

        // Hide social media container
        document.getElementById("highlightSocialMedia").classList.remove('social-show');

        // TODO don't show the modal inside the custom modal if the user opened the custom save modal

        const modalOffset = 15;
        let rect = getFirstRect(Array.from(window.getSelection().getRangeAt(0).getClientRects()));

        modal.style.left = `${rect.x + (rect.width / 2) - (modal.offsetWidth / 2)}px`;
        modal.classList.add("down");
        modal.classList.remove("up");

        // Display the modal before calling modal.offsetHeight() because otherwise it'd return 0
        modal.style.display = "flex";

        //          text position |  modal height     |   padding      |   window y
        modal.style.top = rect.y - modal.offsetHeight - modalOffset + window.scrollY + "px";
    }

    /**
     * Returns the DOMRect with the lowest y
     * @param rects {Array}
     */
    function getFirstRect(rects) {
        let lowest = rects[0];

        rects.forEach((rect) => {
            if (rect.y < lowest.y)
                lowest = rect;
        });

        return lowest;
    }

    /**
     * Checks if the user is authenticated before calling the [func]
     * @param func
     */
    funcs.withAuthentication = (func) => {
        if (getAuthToken() === null) { // User is not authenticated
            showAuthenticateModal();
        } else {
            func();
        }
    };

    let accountMode = {
        saveSelection(selectedText) {
            sendSelectionToServer(selectedText, (status) => {
                if (status >= 200 && status <= 299) { // 2XX
                    afterSaveSelection(selectedText);
                } else {
                    showNotificationModal("Error saving highlight", 5000);
                }
            });
        }
        ,
        /**
         * Saves the text from the custom save modal(#highlightCustomSave)
         */
        saveCustomModalText() {
            let content = document.querySelector("#customSaveContent").innerHTML;

            let docId = document.getElementById("customSave-select").value;

            // This means the selected document is the current page
            if (docId === '0') {
                return sendSelectionToServer(content, (status) => {
                    serverResponse(status);
                });
            }

            sendSelectionToServerWithDocumentId(content, docId, (status) => {
                serverResponse(status);
            });

            function serverResponse(status) {
                document.querySelector("#highlightCustomSave").remove();

                if (status >= 200 && status <= 299) { // 2XX
                    showNotificationModal();
                    highlightSelectionInPage();
                    window.getSelection().removeAllRanges();
                } else {
                    showNotificationModal("Error saving highlight", 5000);
                }
            }
        },
        openCustomSaveModal() {
            let selectedText = getSelectedText();

            // Don't add this before getting the text because it removes all ranges when it adds
            if (document.querySelector("#highlightCustomSave") === null)
                loadCustomSaveModal();

            closeHighlightModal();

            addDocumentsToCustomSelect();

            document.querySelector("#customSaveContent").innerHTML = selectedText;
        }
    };

    let guestMode = {
        saveSelection(selectedText) {
            afterSaveSelection(selectedText);
        },
        saveCustomModalText() {
            // This feature doesn't work for guests
        },
        openCustomSaveModal() {
            showNotificationModal("This feature doesn't work for guest accounts", 4000);
        }
    };

    let userMode = guestMode;

    function afterSaveSelection(selectedText) {
        console.log(selectedText);
        showNotificationModal();
        highlightSelectionInPage();
        HighlightDisplayer.addHighlight(HighlightDisplayer.createHighlight(selectedText));
        window.getSelection().removeAllRanges();
    }

    funcs.saveSelection = function () {
        if (isUserModeUndefined())
            return;

        closeHighlightModal();

        userMode.saveSelection(getSelectedText());
    };

    funcs.saveCustomModalText = () => {
        if (isUserModeUndefined())
            return;

        userMode.saveSelection(saveCustomModalText());
    };

    /**
     * Opens the Custom Save modal to edit the highlight before saving it
     */
    funcs.openCustomSaveModal = () => {
        if (isUserModeUndefined())
            return;

        userMode.openCustomSaveModal();
    };

    function closeHighlightModal() {
        document.querySelector("#highlightModal").style.display = "none";
    }

    function loadCustomSaveModal() {
        document.body.innerHTML += templates.customSaveDiv;
    }

    function saveSelectionUsingShortcut() {
        if (isSomethingSelected()) {
            Highlight.saveSelection();
        }
    }

    function sendSelectionToServer(selection, cb) {
        let formData = new FormData();
        formData.append("text", selection);
        formData.append("path", window.location.host + window.location.pathname);
        formData.append("title", document.title);

        axios.post(`${highlightHost}/api/v1/save/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': getAuthToken()
            }
        }).then((response) => {
            cb(response.status);
        }).catch((error) => {
            if (error.response) {
                showAuthenticateModal();
            }
        });
    }

    /**
     * Adds the {selection} to an existing document using it's id
     * @param selection
     * @param id the document's id
     * @param cb
     */
    function sendSelectionToServerWithDocumentId(selection, id, cb) {
        let formData = new FormData();
        formData.append("text", selection);

        axios.post(`${highlightHost}/api/v1/save/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': getAuthToken()
            },
        }).then((response) => {
            cb(response.status);
        }).catch((error) => {
            if (error.response) {
                showAuthenticateModal();
            }
        });
    }

    function getSelectedText() {
        let range = window.getSelection().getRangeAt(0);

        let fragments = range.cloneContents();
        let completeInnerHTML = "<div>";

        Array.from(fragments.childNodes).forEach((c) => {
            if (c.tagName === undefined) { // If the child is not an html tag
                completeInnerHTML += c.textContent;
            } else { // If the child is a html tag
                completeInnerHTML += `<${c.tagName.toLowerCase()} ${common.getTagAttributes(c)}>` + c.innerHTML + common.getClosingTag(c.tagName.toLowerCase());
            }
        });

        return completeInnerHTML + "</div><div><br></div>";
    }

    /**
     * Adds a <span> tag arround the selection to indicate it was highlighted
     */
    function highlightSelectionInPage() {
        let highlightSpan = document.createElement("span");

        highlightSpan.style.backgroundColor = "#fffd7c";

        try {
            window.getSelection().getRangeAt(0).surroundContents(highlightSpan);
        } catch (err) {
            // TODO fix when there is more than 1 div
        }
    }

    /**
     * Opens a window to manage the highlights. How this function is called varies from site to site, some may choose
     * to add a button or an icon, but that doesn't interfere with the functionality
     */
    funcs.openHighlightsFrame = () => {

    };

    /**
     *
     * @return {boolean} TRUE if there is something(text or image) selected
     */
    function isSomethingSelected() {
        return window.getSelection().anchorOffset !== window.getSelection().focusOffset;
    }

    function showNotLoadedNotification() {
        document.body.innerHTML += templates.notLoadedNotification;
    }

    function showAuthenticateModal() {
        if (document.getElementById("highlight-authenticateModal") === null)
            document.body.innerHTML += templates.authenticateModal;
    }

    //TODO show last used document first in custom save modal
    /**
     * Adds the documents that have the DOCUMENT_STATUS.GOLD to the #customSave-select select
     */
    function addDocumentsToCustomSelect() {
        getDocumentsThatMatchStatus(DOCUMENT_STATUS.GOLD, (response) => {
            let docs = response.data.data;

            let select = document.getElementById("customSave-select");

            // Remove existing options
            Array.from(document.getElementsByClassName('gold-document')).forEach((opt) => opt.remove());

            docs.forEach((doc) => {
                let option = document.createElement("option");
                option.classList.add('gold-document');

                option.innerHTML = doc.title;
                option.value = doc.id;

                select.appendChild(option);
            });
        });
    }

    funcs.socialMediaIconOnHover = () => {
        let container = document.getElementById("highlightSocialMedia");

        if (container.classList.contains('social-show')) {
            container.classList.remove('social-show');
        } else {
            container.classList.add('social-show');
        }
    };

    /**
     *
     * @param status {DOCUMENT_STATUS|String}
     * @param cb
     */
    function getDocumentsThatMatchStatus(status, cb) {
        axios.get(`${highlightHost}/api/v1/document/status/${status}`, {
            headers: {'Authorization': getAuthToken()}
        }).then((response) => {
            cb(response);
        }).catch((error) => {
            if (error.response) {
                showAuthenticateModal();
            }
        });
    }

    let socialMediaWindowFeatures = "width=580,height=720";

    funcs.shareSelectionFacebook = () => {
        let fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&
        quote=${encodeURIComponent(window.getSelection().getRangeAt(0).cloneContents().textContent)}`;


        window.open(fbUrl, "", socialMediaWindowFeatures);
    };

    funcs.shareSelectionTwitter = () => {
        openTweetIntent(window.getSelection().getRangeAt(0).cloneContents().textContent, window.location.href);

        function openTweetIntent(text, url = " ") {
            let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(tweetUrl, "", socialMediaWindowFeatures);
        }
    };

    /**
     * If the highlight modal state is {true}(by default it is {true}), when something is selected the highlight modal
     * appears above the selection. This is how you disable/enable the highlight modal
     * @param state {String} 'ON' or 'OFF'
     */
    funcs.setHighlightModalState = (state) => {
        options.on = state === 'ON';
    };

    function isHighlightEnabled() {
        return options.on;
    }

    funcs.notLoadedNotification = {
        remember: false,
        close() {
            if (this.remember)
                localStorage.setItem('hl-nln-autoReload', false);

            document.getElementById('highlight-notLoadedNotification').remove();
        },
        reload() {
            funcs.load();
            funcs.notLoadedNotification.close();

            // This has to come last because it calls close() and close sets the hl-nln-autoReload to false
            if (this.remember)
                localStorage.setItem('hl-nln-autoReload', true);
        },
        rememberOption(value = !this.remember) {
            let checkbox = document.getElementById("hl-nln-checkbox");

            value === true ? checkbox.classList.add('checked') : checkbox.classList.remove('checked');

            this.remember = value;
        }
    };

    funcs.authenticateModal = {
        temporaryId: undefined,
        maxTries: 15,
        asUser() {
            funcs.closeBackgroundCover();

            showNotificationModal("Waiting for Authentication... Please Sign In using the window/tab that has been opened.", -1);

            axios.post(`${highlightHost}/auth/temporaryId`).then((response) => {
                this.temporaryId = response.data.data;

                window.open(`${templates.highlightHost}/auth/?temporary_id=${this.temporaryId}`);

                this.getTokenUsingTemporaryId();
            }).catch((error) => {
            });
        },
        asGuest() {
            funcs.closeBackgroundCover();
            userMode = guestMode;
        },
        async getTokenUsingTemporaryId() {
            let tries = 1;

            while (this.temporaryId !== undefined && tries < this.maxTries) {
                // Try to get authentication token
                let response = await axios.get(`${highlightHost}/auth/token/${this.temporaryId}`);

                if (response.status === 200) { // The user logged in successfully
                    localStorage.setItem('highlight.authToken', response.data.token);
                    userMode = accountMode;

                    showNotificationModal("Successful Authentication", 3000);

                    this.temporaryId = undefined; // Break loop
                } else if (response.status === 202) { // The login window was opened but the user has not logged in yet
                    await sleep(2000);

                    tries++;
                } else { // The user didn't login or the temporary-id is invalid
                    Logger.log("Server timed out. Can't get the authentication token");
                    showNotificationModal("Failed Authentication", 5000);
                    this.temporaryId = undefined; // Break loop
                }
            }

            // Loop stopped because the auth window was opened but the user didn't sign in
            if (tries === this.maxTries) {
                showNotificationModal("Failed Authentication", 5000);
            }

            this.temporaryId = undefined;

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }
    };

    function getAuthToken() {
        // TODO if the item is null?
        return localStorage.getItem('highlight.authToken');
    }

    funcs.closeBackgroundCover = () => {
        document.querySelectorAll(".highlight-modal.highlight-cover").forEach((node) => {
            node.remove();
        });
    };

    function isUserModeUndefined() {
        if (userMode === undefined)
            showAuthenticateModal();

        return userMode === undefined;
    }


    return funcs;
})();

/**
 * Manages the container that displays the highlights made in the current page
 */
let HighlightDisplayer = (() => {
    let funcs = {};

    let highlights = [];

    funcs.display = () => {
        createDisplayer();

        // Remove existing highlights
        document.querySelectorAll('.hl-highlight').forEach(node => node.remove());

        document.getElementById('highlight-displayer').style.display = "block";

        highlights.forEach(hl => displayHighlight(hl));
    };

    /**
     * Adds the {@Link templates.highlightDisplayer} to the DOM if it doesn't exist, but doesn't display it
     */
    function createDisplayer() {
        if (document.getElementById('highlight-displayer') === null)
            document.body.innerHTML += templates.displayer;
    }

    funcs.hide = () => {
        document.getElementById('highlight-displayer').remove();
    };

    /**
     * Displays the highlight in the HighlightDisplayer
     * @param hl {@Link HighlightObj}
     */
    funcs.addHighlight = (hl) => {
        highlights.push(hl);
        displayHighlight(hl);
    };

    /**
     * @param hl [@Link HighlightObj}
     */
    function displayHighlight(hl) {
        createDisplayer();

        document.getElementById('hl-displayerList').innerHTML += templates.displayerHighlight(hl.content);
    }

    /**
     * Use this method if the {content] has html tags such as <br>, <div> or <b>
     * @param content {String}
     * @return {HighlightObj}
     */
    funcs.createHighlight = (content) => {
        let formattedContent = content.replace(/<br>/g, "");

        return new HighlightObj(formattedContent);
    };

// Global functions.
    window.highlightDisplayer = {display: funcs.display, hide: funcs.hide};

    return funcs;
})
();

/**
 * Object to represent a highlight, this is created when the user highlights something using the highlight modal
 * @param content
 */
function HighlightObj(content) {
    return {
        content: content,
        created: new Date()
    }
}