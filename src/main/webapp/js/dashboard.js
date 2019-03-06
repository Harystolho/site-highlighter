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

            funcs.currentDocumentId = id;

            document.querySelector("#content").innerHTML = response.data.highlights;
            document.querySelector("#content").setAttribute("data-document-id", id);
        });
    };

    // TEMPLATE FUNCTIONS
    funcs.librarySiteTemplate = (title, url, id) => {
        return `
    <div class="library-template-container">
        <h5 class="library-template-title" data-id="${id}" onclick="Dashboard.displayDocumentContent(${id})">${title}</h5>
        <div class="library-template-url"><a href="https://${url}" target="_blank">${url}</a></div>
    </div>
    `; // TODO is the url always HTTPS?
    };

    return funcs;
})();

let ContentEditor = (() => {
    let funcs = {};

    funcs.saveDocument = () => {
        if(Dashboard.currentDocumentId === undefined)
            return;

        let content = document.querySelector("#content");

        httpPost("/api/v1/document/save", `id=${content.getAttribute("data-document-id")}&text=${encodeURIComponent(content.innerHTML)}`, (data)=>{
            let response = JSON.parse(data);
            document.querySelector("#tempStatusMsg").innerHTML = "Saved";

            setTimeout(()=>{
                document.querySelector("#tempStatusMsg").innerHTML = "";
            }, 750);
        });
    };

    funcs.boldSelection = () =>{

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