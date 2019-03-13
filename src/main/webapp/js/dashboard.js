import * as common from './common';

import '../css/bootstrap.min.css'
import '../css/common.css'

window.Dashboard = (() => {
    let funcs = {};

    funcs.libraries = {
        DOCUMENT: "#documentLibrary",
        TAG: "#tagLibrary"
    };

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
                library.innerHTML += funcs.librarySiteTemplate(doc.title, doc.path, doc.id);
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
                    ContentEditor.setDocumentStatus('WOOD');
                });
            } else { // Change status to GOLD
                httpPost("/api/v1/document/status", `id=${docId}&status=gold`, (data) => {
                    document.getElementById("documentGoldStar").classList.add("active");
                    ContentEditor.setDocumentStatus('GOLD');
                });
            }
        }
    };

    // TEMPLATE FUNCTIONS
    funcs.librarySiteTemplate = (title, url, id) => {
        return `
    <div class="library-template-container" data-id="${id}">
        <h5 class="library-template-title">
            <span onclick="ContentEditor.displayDocumentContent('${id}')">${title}</span>
            <a href="https://${url}" target="_blank">
                <img class="library-template-external-link" src="/icons/external-link.png">
            </a>
        </h5>
    </div>
    `; // TODO is the url always HTTPS?
    };

    return funcs;
})(); // TODO show box to edit the link in an <a> tag

window.ContentEditor = (() => {
    let funcs = {};

    let options = {
        currentDocumentId: 0,
        status: 'WOOD',
        modifiedTimeout: undefined
    };

    // Public
    funcs.options = {
        currentDocumentId: () => options.currentDocumentId,
        documentStatus: () => options.status
    };

    // TODO add the missing ones
    // The keys below when pressed don't trigger the document to auto save because they don't modify the content
    const keysIgnoredOnContentEditor = [16 /*SHIFT*/, 17 /*CTRL*/, 18 /*ALT*/, 20 /*CAPS*/,
        27 /*ESC*/, 37 /*LEFT*/, 38 /*UP*/, 39 /*RIGHT*/, 40 /*DOWN*/];

    // TODO if the user switches to another document before this one is saved, save it before
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
        httpGet(`/api/v1/document/${id}`, (response) => {
            let data = JSON.parse(response).data;

            resetDocumentOptions(id);

            options.status = data.status;
            updatePageBasedOnStatus();

            document.querySelector("#content").innerHTML = data.highlights;
            document.querySelector("#content").setAttribute("data-document-id", id);
        });
    };

    function resetDocumentOptions(docId) {
        options.currentDocumentId = docId;
        options.modifiedTimeout = undefined;
        options.status = 'WOOD';
        document.getElementById("documentGoldStar").classList.remove("active");
    }

    function updatePageBasedOnStatus() {
        switch (options.status) {
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

        httpPost("/api/v1/document/save", `id=${content.getAttribute("data-document-id")}&text=${encodeURIComponent(content.innerHTML)}`, (data) => {
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

    funcs.setDocumentStatus = (status) =>{
      options.status = status;
    };

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