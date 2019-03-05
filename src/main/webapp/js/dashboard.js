let Dashboard = (() => {
    let funcs = {};

    window.onload = () => {
        requestDocuments();
    };

    /**
     * A {Document} is a file that contains highlights in it.
     */
    function requestDocuments() {
        httpGet("/api/v1/documents", (data) => {
            let response = JSON.parse(data);

            let library = document.querySelector("#libraryContainer");

            response.data.forEach((doc) => {
                library.innerHTML += funcs.librarySiteTemplate(doc.title, doc.path, doc.id);
            });
        });
    }

    funcs.displayDocumentContent = (id) => {
        httpGet(`/api/v1/document/${id}`, (data) => {
            let response = JSON.parse(data);

            document.querySelector("#content").innerHTML = response.data.highlights;
            document.querySelector("#content").setAttribute("data-document-id", id);
        });
    };

    // TEMPLATE FUNCTIONS
    funcs.librarySiteTemplate = (title, url, id) => {
        return `
    <div class="library-template-container">
        <h5 class="library-template-title" data-id="${id}" onclick="Dashboard.displayDocumentContent(${id})">${title}</h5>
        <div class="library-template-url">${url}</div>
    </div>
    `;
    };

    // HELPER FUNCTIONS
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

    return funcs;
})();

let ContentEditor = (() => {
    let funcs = {};

    funcs.saveDocument = () => {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);
            }
        };

        let content = document.querySelector("#content");

        xhttp.open("POST", `/api/v1/document/save`, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(`id=${content.getAttribute("data-document-id")}&text=${content.innerHTML}`);
    };

    return funcs;
})();