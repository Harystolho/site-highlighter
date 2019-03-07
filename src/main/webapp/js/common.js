/**
 * Most tags in HTMl have a closing tag, the ones that don't are called void tags.
 * @param tag
 * @return {String} the closing tag or an empty string if the tag has no closing tag
 */
function getClosingTag(tag) {
    let voidTags = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link",
        "meta", "param", "source", "track", "wbr"];

    if (voidTags.includes(tag)) {
        return "";
    } else {
        return `</${tag}>`;
    }
}

/**
 * Some tags have some attributes that have to be copied to
 * @param tag
 * @return {*}
 */
function getTagAttributes(tag) {
    let attributes = "";

    tag.getAttributeNames().forEach((attr)=>{
        attributes += `${attr}="${tag.getAttribute(attr)}"`;
    });

    return attributes;
}