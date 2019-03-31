import * as common from './common';
import * as axios from 'axios';
import * as templates from './templates';

import '../css/bootstrap.min.css'
import '../css/common.css'

const ENTER_KEY_CODE = 13;

window.Dashboard = (() => {
    let funcs = {};

    funcs.libraries = {
        DOCUMENT: "#documentLibrary",
        TAG: "#tagLibrary"
    };

    // Object used by the inputModals to call a callback function
    funcs.functions = {};

    window.onload = () => {
        requestDocuments();
    };

    /**
     * A {Document} is a file that contains highlights in it.
     */
    function requestDocuments() {
        httpGet("/api/v1/documents", (data) => {
            let response = JSON.parse(data);

            let library = document.querySelector("#documentLibraryList");

            response.data.forEach((doc) => {
                library.innerHTML += templates.librarySiteTemplate(doc.title, doc.path, doc.id);
            });
        });
    }

    /**
     * @param library {String}
     */
    funcs.displayLibrary = (library) => {
        document.querySelectorAll(".generalLibrary").forEach(l => l.style.display = "none");

        document.querySelector(library).style.display = "block";
    };

    funcs.switchDocumentGoldStatus = () => {
        let docId = ContentEditor.options.currentDocumentId();
        let status = ContentEditor.options.documentStatus();

        if (docId !== 0) {
            if (status === 'GOLD') { // Change status to WOOD
                httpPost("/api/v1/document/status", `id=${docId}&status=wood`, (data) => {
                    document.getElementById("documentGoldStar").classList.remove("active");
                    ContentEditor.options.setDocumentStatus('WOOD');
                });
            } else { // Change status to GOLD
                httpPost("/api/v1/document/status", `id=${docId}&status=gold`, (data) => {
                    document.getElementById("documentGoldStar").classList.add("active");
                    ContentEditor.options.setDocumentStatus('GOLD');
                });
            }
        }
    };

    funcs.deleteDocument = () => {
        let docId = ContentEditor.options.currentDocumentId();

        if (docId !== 0 && docId !== undefined) {
            let title = document.querySelector(`[data-id='${docId}']`).querySelector("span").textContent;

            confirmModal.display(`Delete "${title}"?`, () => {
                axios.delete(`/api/v1/document/${docId}`).then((response) => {
                    if (response.status === 200) {
                        document.querySelector(`[data-id='${docId}']`).remove();
                        ContentEditor.displayDocumentContent(0);
                    }

                    confirmModal.hide();
                });
            });
        }
    };

    funcs.createNewDocument = () => {
        singleInputModal.display("How do you want your document to be named?", (name) => {
            if (name.trim().length > 3) {
                let formData = new FormData();
                formData.append("text", name);

                // Example dashboard.com/myBigTitle-1285682382
                formData.append("path", `${window.location.host}/${name.trim().replace(/ /g, "")}-${parseInt(Math.random() * 999999)}`);
                formData.append("title", name);

                axios.post(`/api/v1/save/`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then((response) => {
                    // Remove existing documents
                    Array.from(document.querySelector("#documentLibraryList").children).forEach(child => child.remove());
                    requestDocuments();
                });
            } else {
                alert("Title has to have more than 3 characters");
            }

            singleInputModal.hide();
        });
    };

    let singleInputModal = {
        /**
         * Displays the {#singleInputModal}. The modal is closed when the 'Close' button is pressed. When the 'Ok'
         * button is pressed it doesn't closed the modal, it just calls the callback.
         * @param question {String} The text that appears on the header of the modal
         * @param cb {Function} called when the 'Ok' button is pressed
         */
        display(question, cb) {
            document.body.innerHTML += templates.singleInputModal(question);

            Dashboard.functions.singleInputOk = cb;
        },
        hide() {
            document.getElementById('singleInputModal').remove();
        }
    };

    let confirmModal = {
        /**
         * Displays the {#confirmModal}. The modal is closed when the 'Close' button is pressed. When the 'Ok'
         * button is pressed it doesn't closed the modal, it just calls the callback.
         * @param question {String} The text that appears on the header of the modal
         * @param cb {Function} called when the 'Ok' button is pressed
         */
        display(question, cb) {
            document.body.innerHTML += templates.confirmModal(question);

            Dashboard.functions.confirmOk = cb;
        },
        hide() {
            document.getElementById('confirmModal').remove();
        }
    };

    /**
     * Deletes the cookie that is used by the server to identify the user and redirects to the home page
     */
    funcs.logOut = () => {
        let cookies = document.cookie.split("; "); // Get all cookies

        let finalCookie = "";

        cookies.forEach((cookie) => {
            // If the cookie is not the one used by the server, add it to the final cookie
            if (cookie.includes(common.HIGHLIGHT_COOKIE)) {
                finalCookie += cookie + '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            } else {
                finalCookie += cookie + '; ';
            }

        });

        document.cookie = finalCookie;
    };

    funcs.tagEditor = {
        onkeydown(event) {
            if (event.keyCode === ENTER_KEY_CODE) {
                this.createTagsFromInput();
            }
        },
        /**
         * Creates tags and displays them
         */
        createTagsFromInput() {
            let input = document.getElementById("tagsInput");

            if (!this.verifyInput(input.value)) {
                return; // TODO
            }

            let tags = input.value.toLowerCase().split(" ");

            tags = tags.filter(t => t.length > 0);

            this.saveTagsInServer(tags, () => {
                this.displayTagsInToolbar(tags);
            });
        },
        /**
         * @param tags {Array}
         * @param cb
         */
        saveTagsInServer(tags, cb) {
            let formData = new FormData();
            formData.append("tags", tags);

            axios.post(`/api/v1/documents/${ContentEditor.options.currentDocumentId()}/tags`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then((response) => {
                cb();
            });
        },
        /**
         *
         * @param value
         * @return {Boolean} 'true' if the value is valid, false otherwise
         */
        verifyInput(value) {
            if (value.match(/[.,"]/g) !== null)
                return false; // TODO show invalid input

            return true;
        },
        /**
         * @param tags {Array}
         * ToolBar = div with id 'contentToolbar'
         */
        displayTagsInToolbar(tags) {
            if (tags === null || tags.length === 0) {
                this.showTagEditor();

            } else {
                document.getElementById("tagsInput").style.display = 'none'; // Hide tag input

                tags.forEach((tag) => {
                    document.getElementById("tagContainer").innerHTML += templates.tag(tag);
                });
            }
        },
        showTagEditor() {
            let input = document.getElementById("tagsInput");

            if (input.style.display === 'none') { // The tag input is hidden
                input.style.display = 'block';

                let tags = document.querySelectorAll('.document-tag');
                let tagNames = [];

                tags.forEach((tag) => {
                    tagNames.push(tag.innerHTML);

                    tag.remove();
                });

                input.value = tagNames.join(" ");
            }
        },
        reset() {
            document.querySelectorAll('.document-tag').forEach(tag => tag.remove());
            document.getElementById("tagsInput").style.display = "none";
        }
    };

    return funcs;
})(); // TODO show box to edit the link in an <a> tag

window.ContentEditor = (() => {
    let funcs = {};

    let options = {
        currentDocumentId: 0,
        modifiedTimeout: undefined,
        getStatus: () => options._status,
        setStatus(status) {
            options._status = status;
            updatePageBasedOnStatus();
        }
    };

    // Public
    funcs.options = {
        currentDocumentId: () => options.currentDocumentId,
        documentStatus: options.getStatus,
        setDocumentStatus: options.setStatus
    };

    // TODO add the missing keys
    // The keys below when pressed don't trigger the document to auto save because they don't modify the content
    const keysIgnoredOnContentEditor = [16 /*SHIFT*/, 17 /*CTRL*/, 18 /*ALT*/, 20 /*CAPS*/,
        27 /*ESC*/, 37 /*LEFT*/, 38 /*UP*/, 39 /*RIGHT*/, 40 /*DOWN*/];

    /**
     * Waits some time after the user has typed something and then saves the document automatically. The document is saved
     * only if the user has typed some key and for 2 seconds no other keys have been pressed.
     * @param event
     */
    funcs.contentEditorOnKeyUp = (event) => {
        if (keysIgnoredOnContentEditor.includes(event.keyCode))
            return;

        if (options.modifiedTimeout !== undefined)
            clearTimeout(options.modifiedTimeout);

        options.modifiedTimeout = setTimeout(() => {
            funcs.saveDocument();
        }, 2000);

    };

    funcs.displayDocumentContent = (id) => {
        if (id === 0) {
            resetDocumentOptions(id);

            document.querySelector("#content").innerHTML = "";
            return;
        }

        // The document being displayed was modified but not saved
        if (options.modifiedTimeout !== undefined) {
            clearTimeout(options.modifiedTimeout); // Clear the existing timeout so it doesn't save twice
            funcs.saveDocument();
        }

        httpGet(`/api/v1/document/${id}`, (response) => {
            let data = JSON.parse(response).data;

            resetDocumentOptions(id);
            Dashboard.tagEditor.reset();

            options.setStatus(data.status);

            document.querySelector("#content").innerHTML = data.highlights;

            Dashboard.tagEditor.displayTagsInToolbar(data.tags);
        });
    };

    function resetDocumentOptions(docId) {
        options.currentDocumentId = docId;
        options.modifiedTimeout = undefined;
        options.setStatus('WOOD');
    }

    function updatePageBasedOnStatus() {
        document.getElementById("documentGoldStar").classList.remove("active");

        switch (options.getStatus()) {
            case 'WOOD':
                break;
            case 'GOLD':
                document.getElementById("documentGoldStar").classList.add("active");
                break;
        }
    }

    funcs.saveDocument = () => {
        if (options.currentDocumentId === undefined)
            return;

        let content = document.querySelector("#content");

        httpPost("/api/v1/document/save", `id=${options.currentDocumentId}&text=${encodeURIComponent(content.innerHTML)}`, (data) => {
            let response = JSON.parse(data);

            let tempStatusMsg = document.querySelector("#tempStatusMsg");

            tempStatusMsg.innerHTML = "Saved!";
            tempStatusMsg.style.display = "block";

            setTimeout(() => {
                tempStatusMsg.style.display = "none";
            }, 1200);
        });
    };

    funcs.boldSelection = () => {
        let range = window.getSelection().getRangeAt(0);

        if (range.startContainer.parentElement.tagName === "B") { // Selection range is bold
            range.insertNode(document.createTextNode(range.extractContents().textContent));
        } else {
            let b = document.createElement("b");
            b.innerHTML = range.extractContents().textContent;
            range.insertNode(b);
        }

    };

    const EDITOR_SEPARATOR = "!#!";

    funcs.changeSelectionColor = () => {
        surroundSelectionWithEditorSeparator();

        let range = window.getSelection().getRangeAt(0);

        let fragments = range.commonAncestorContainer.innerHTML.split(EDITOR_SEPARATOR);

        console.log(fragments[1]);

        let newContent = `<span style="background-color: palegoldenrod">${fragments[1]}</span>`;

        range.commonAncestorContainer.innerHTML = fragments[0] + newContent + fragments[2];
    };

    /**
     * Surrounds the selected context with the EDITOR_SEPARATOR tag. This tag is used to indicate where the selection
     * begins and where it ends, usually after this method is called you use the {range.commonAncestorContainer.innerHTML}
     * and replace the content between the EDITOR_SEPARATOR tags.
     */
    function surroundSelectionWithEditorSeparator() {
        let range = window.getSelection().getRangeAt(0);

        // if the endContainer is of the type '#text"
        if (typeof range.endContainer.appendData === "function") {
            range.insertNode(document.createTextNode(EDITOR_SEPARATOR));

            let firstPart = range.endContainer.textContent.slice(0, range.endOffset);
            let lastPart = range.endContainer.textContent.slice(range.endOffset);

            range.endContainer.textContent = firstPart + EDITOR_SEPARATOR + lastPart;
        } else { // if the endContainer is of the type "#div" or related some html tag
            let fragments = range.extractContents();

            // Insert the separator here so I know where to replace the text later
            range.insertNode(document.createTextNode(EDITOR_SEPARATOR));

            // Place a EDITOR_SEPARATOR in the beginning of the text
            let completeInnerHTML = EDITOR_SEPARATOR;

            Array.from(fragments.childNodes).forEach((c) => {
                if (c.tagName === undefined) { // If the child is not an html tag
                    completeInnerHTML += c.textContent;
                } else { // If the child is an html tag
                    completeInnerHTML += `<${c.tagName.toLowerCase()}  ${common.getTagAttributes(c)}>` + c.innerHTML + common.getClosingTag(c.tagName.toLowerCase());
                }
            });

            // Place another EDITOR_SEPARATOR at the end of the text
            completeInnerHTML += EDITOR_SEPARATOR;

            range.commonAncestorContainer.innerHTML = range.commonAncestorContainer.innerHTML.replace(EDITOR_SEPARATOR, completeInnerHTML);
        }
    }

    // TODO fix this to remove the style
    funcs.removeSelectionFormatting = () => {
        let range = window.getSelection().getRangeAt(0);

        //range.insertNode(document.createTextNode(range.extractContents().textContent));
    };

    return funcs;
})();

function httpGet(url, cb) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            cb(this.responseText);
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

function httpPost(url, body, cb) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            cb(this.responseText);
        }
    };

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(body);
}

// Helper functions
$id = id => document.getElementById(id);
$class = clazz => document.getElementsByClassName(clazz);
$selector = sel => document.querySelector(sel);

/**
 * @param el {Element}
 */
function $hide(el){
    el.style.display = "none";
}

/**
 * @param el {Element}
 * @param display {String} display type
 */
function $show(el, display="block"){
    el.style.display = display;
}