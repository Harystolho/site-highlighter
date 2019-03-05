let Dashboard = (() => {
    let funcs = {};

    window.onload = () => {
      requestDocuments();
    };

    /**
     * A {Document} is a file that contains highlights in it.
     */
    function requestDocuments() {
        httpGet("/api/v1/documents", (data)=>{
            let response = JSON.parse(data);

            console.log(response);
        });
    }
    
    // TEMPLATE FUNCTIONS
    funcs.librarySiteTemplate = (title, url) => {
        return `
    <div class="library-template-container">
        <h5 class="library-template-title">${title}</h5>
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