const xmlFormat = require('xml-formatter');
/**
 * Method to clean the string by removing tabs/whitespaces
 * @param {*} string 
 */
export const clean = (string = '') => {
  if (string) {
    string = string.replace(/\r/gmi, ' ').replace(/\n/gmi, ' ').replace(/\t/gmi, ' ').replace(/\s{2,}/gmi, ' ').replace(/">\s*/g, '">').replace(/\s*<\//g, "</");
    string = string.trim();
    return string;
  } else {
    return null;
  }
}

const replaceAll = (str = '', findStr = '', replaceStr = '') => {
  return str.split(findStr).join(replaceStr);
}

const xml = {
  format: (xmlStr) => {
    var formattedXml = xmlFormat(xmlStr, {
      indentation: '    ',
      filter: (node) => node.type !== 'Comment',
      collapseContent: false,
      lineSeparator: '\n'
    });
    return formattedXml;
  }
}

export const formatEditorXML = (quill) => {
  try {
    let text = quill.getText(0).trim();
    text = xml.format(text);
    console.log(text);
    quill.setText(text);
  } catch (e) {
    toastr.error('Something went wrong in formatting. Check semantics');
    console.error(e);
  }
}