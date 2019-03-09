let Dashboard = (() => {
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

    funcs.displayDocumentContent = (id) => {
        httpGet(`/api/v1/document/${id}`, (data) => {
            let response = JSON.parse(data);

            funcs.currentDocumentId = id;

            document.querySelector("#content").innerHTML = response.data.highlights;
            document.querySelector("#content").setAttribute("data-document-id", id);
        });
    };

    /**
     * @param library {String}
     */
    funcs.displayLibrary = (library) => {
        document.querySelectorAll(".generalLibrary").forEach(l => l.style.display = "none");

        document.querySelector(library).style.display = "block";
    };

    // TEMPLATE FUNCTIONS
    funcs.librarySiteTemplate = (title, url, id) => {
        return `
    <div class="library-template-container" data-id="${id}">
        <h5 class="library-template-title">
            <span onclick="Dashboard.displayDocumentContent(${id})">${title}</span>
            <a href="https://${url}" target="_blank">
                <img class="library-template-external-link" src="/icons/external-link.png">
            </a>
        </h5>
    </div>
    `; // TODO is the url always HTTPS?
    };

    return funcs;
})(); // TODO show box to edit the link in an <a> tag

let ContentEditor = (() => {
    let funcs = {};

    funcs.saveDocument = () => {
        if (Dashboard.currentDocumentId === undefined)
            return;

        let content = document.querySelector("#content");

        httpPost("/api/v1/document/save", `id=${content.getAttribute("data-document-id")}&text=${encodeURIComponent(content.innerHTML)}`, (data) => {
            let response = JSON.parse(data);
            document.querySelector("#tempStatusMsg").innerHTML = "Saved";

            setTimeout(() => {
                document.querySelector("#tempStatusMsg").innerHTML = "";
            }, 750);
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
                    completeInnerHTML += `<${c.tagName.toLowerCase()}  ${getTagAttributes(c)}>` + c.innerHTML + getClosingTag(c.tagName.toLowerCase());
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

        range.insertNode(document.createTextNode(range.extractContents().textContent));
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