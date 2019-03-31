let tagTemplate = (name) => {
    return `
  <div class="tagLibrary--tag" onclick="Dashboard.displayDocumentsByTag('${name}')">
    <span>${name}</span>
  </div>
  `;
};

let tagDocumentTemplate = (title, id) => {
    return `
  <div class="tagLibrary--doc" onclick="ContentEditor.displayDocumentContent('${id}')">
    <span class="library-template-title">${title}</span>
  </div>
  `;
};

export {
    tagTemplate,
    tagDocumentTemplate
}