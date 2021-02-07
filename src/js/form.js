const toastr = require('./toastr'),
  stringUtil = require('./string');

const copyText = () => {
  let isValid = ssml_validate_handler(window.quillInstance);
  const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toastr.success('Copied the SSML to clipboard');
  };
  if (isValid) {
    stringUtil.formatEditorXML(window.quillInstance);
    let text = window.quillInstance.getText(0).trim();
    if (text) {
      text = stringUtil.clean(text);
      copyToClipboard(text);
    } else {
      toastr.warning('Nothing to copy from editor!');
    }
  }
}

function ssml_validate_handler(quill) {
  // get text w/o formatting from editor
  var editorText = quill.getText(0);
  // remove amazon namespace before dom parser
  editorText = editorText.replace(/zapr:/g, '').trim();
  // basic validation if text starts with <speak>
  if (editorText.startsWith("<speak") && editorText.endsWith("</speak>")) {
    // use browser dom parster to validate XML
    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(editorText, "application/xml");
    // if error found in parsing result
    if (oDOM.getElementsByTagName("parsererror").length > 0) {
      // get error element and extract relevant information
      toastr.error("Invalid SSML: " + oDOM.getElementsByTagName("parsererror")[0].childNodes[1].innerHTML);
      return false;
    } else {
      return true;
    }
  } else {
    toastr.error("Invalid SSML: Missing <speak> tag");
    return false;
  }
}