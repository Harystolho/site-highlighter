let Dashboard = (() => {
    let funcs = {};

    funcs.librarySiteTemplate = (title, url) => {
        return `
    <div class="library-template-container">
        <h5 class="library-template-title">${title}</h5>
        <div class="library-template-url">${url}</div>
    </div>
    `;
    };

    

    return funcs;
})();