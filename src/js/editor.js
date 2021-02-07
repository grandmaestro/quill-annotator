const toastr = require('./toastr'),
  stringUtil = require('./string');
// get module form quill to extend
const Module = Quill.import('core/module');


// extrend module class from quill
class RichVoiceEditor extends Module {

  cleanSelection(quill, range) {
    const originalText = quill.getText(range.index, range.length);
    const cleanText = (originalText || '').trim();
    quill.deleteText(range.index, range.length);
    quill.insertText(range.index, cleanText);
    return {
      index: range.index,
      length: cleanText.length
    }
  }

  constructor(quill, options) {
    super(quill, options)
    this.quill = quill;
    // fetch the toolbar to add handlers
    const toolbar = quill.getModule('toolbar')

    // add semantic ui icons to html for own buttons
    var fileref = document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/icon.min.css")
    document.getElementsByTagName("head")[0].appendChild(fileref)

    // SSML speak tag
    // --------------
    // style toolbar button with icon
    const speakPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_speak .ql-picker-item'));
    speakPickerItems.forEach(item => item.textContent = item.dataset.value);
    // <i class="comment outline icon" title="Speak As"></i>
    document.querySelector('.ql-ssml_speak .ql-picker-label').innerHTML = '<span class="ql-btn-caption">SPEAK</span>' + document.querySelector('.ql-ssml_speak .ql-picker-label').innerHTML;

    function ssml_speak_handler(value) {
      // get current selected text as range
      var text = quill.getText(0).replace(/\n/, '');

      if (!text.startsWith("<speak>") && !text.endsWith("</speak>")) {
        let updateText = '<speak zapr:textnorm-lang="' + value + '">' + text + '</speak> ';
        quill.setText(updateText);
        stringUtil.formatEditorXML(quill);
      }
    }
    // add tag handler to quill toolbar
    toolbar.addHandler('ssml_speak', ssml_speak_handler.bind(this));


    // SSML say-as tag
    // ---------------
    // load texts for dropdown items
    const sayasPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_sayas .ql-picker-item'));
    sayasPickerItems.forEach(item => item.textContent = item.dataset.value);
    // style toolbar button with icon and keep dropdown values
    // <i class="keyboard outline icon" title="Interpret As"></i>
    document.querySelector('.ql-ssml_sayas .ql-picker-label').innerHTML = '<span class="ql-btn-caption">SAY</span>' + document.querySelector('.ql-ssml_sayas .ql-picker-label').innerHTML;

    function ssml_sayas_handler(value) {
      // get current selected text as range
      var range = quill.getSelection();
      // only if range is currently selected
      if (range) {
        // only if it is a range and not a position
        if (range.length > 0) {
          // add tag at the end of the selected range
          range = this.cleanSelection(quill, range);
          this.quill.insertText(range.index + range.length, '</say-as>')
          // add tag at the beginning of the selected range
          this.quill.insertText(range.index, ' <say-as interpret-as="' + value + '">')
          // set cursor position to the end of new tag
          this.quill.setSelection(range.index + range.length + value.length + 34);
          stringUtil.formatEditorXML(quill);
        }
      }
    }
    // add tag handler to quill toolbar
    toolbar.addHandler('ssml_sayas', ssml_sayas_handler.bind(this));

    // SSML say-as (date) tag
    // ----------------------
    // load texts for dropdown items
    const datePickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_date .ql-picker-item'));
    datePickerItems.forEach(item => item.textContent = item.dataset.value);
    // style toolbar button with icon and keep dropdown values
    // <i class="calendar alternate outline icon" title="Date"></i>
    document.querySelector('.ql-ssml_date .ql-picker-label').innerHTML = '<span class="ql-btn-caption">DATE</span>' + document.querySelector('.ql-ssml_date .ql-picker-label').innerHTML;

    function ssml_date_handler(value) {
      // get current selected text as range
      var range = quill.getSelection();
      // only if range is currently selected
      if (range) {
        // only if it is a range and not a position
        if (range.length > 0) {
          range = this.cleanSelection(quill, range);
          // add tag at the end of the selected range
          this.quill.insertText(range.index + range.length, '</say-as>')
          // add tag at the beginning of the selected range
          this.quill.insertText(range.index, ' <say-as interpret-as="date" format="' + value + '">')
          // set cursor position to the end of new tag
          this.quill.setSelection(range.index + range.length + value.length + 48);
          stringUtil.formatEditorXML(quill);
        }
      }
    }
    // add tag handler to quill toolbar
    toolbar.addHandler('ssml_date', ssml_date_handler.bind(this));

    // SSML phoneme tag
    // ------------
    // style toolbar button with icon
    // <i class="font icon" title="Phoneme"></i>
    document.querySelector('.ql-ssml_phoneme').innerHTML = '<span class="ql-btn-caption">PHONEMES</span>';
    function ssml_phoneme_handler() {
      // get current selected text as range
      var range = quill.getSelection();
      // only if range is currently selected
      if (range) {
        // only if it is a range and not a position
        if (range.length > 0) {
          range = this.cleanSelection(quill, range);
          // add tag at the end of the selected range
          this.quill.insertText(range.index + range.length, '</phoneme>')
          // add tag at the beginning of the selected range
          this.quill.insertText(range.index, ' <phoneme alphabet="ipa" ph="pɪˈkɑːn">')
          // set cursor position to the end of new tag
          this.quill.setSelection(range.index + range.length + 47);
          stringUtil.formatEditorXML(quill);
        }
      }
    }
    // add tag handler to quill toolbar
    toolbar.addHandler('ssml_phoneme', ssml_phoneme_handler.bind(this));


    // SSML prosody rate tag
    // ----------------------
    // load texts for dropdown items
    const pRatePickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_prosody_rate .ql-picker-item'));
    pRatePickerItems.forEach(item => item.textContent = item.dataset.value);
    // style toolbar button with icon and keep dropdown values
    // <i class="forward icon" title="Prosody Rate"></i>
    document.querySelector('.ql-ssml_prosody_rate .ql-picker-label').innerHTML = '<span class="ql-btn-caption">SPEED</span>' + document.querySelector('.ql-ssml_prosody_rate .ql-picker-label').innerHTML;

    function ssml_prosody_rate_handler(value) {
      // get current selected text as range
      var range = quill.getSelection();
      // only if range is currently selected
      if (range) {
        // only if it is a range and not a position
        if (range.length > 0) {
          range = this.cleanSelection(quill, range);
          // add tag at the end of the selected range
          this.quill.insertText(range.index + range.length, '</prosody>')
          // add tag at the beginning of the selected range
          this.quill.insertText(range.index, ' <prosody rate="' + value + '">')
          // set cursor position to the end of new tag
          this.quill.setSelection(range.index + range.length + value.length + 48);
          stringUtil.formatEditorXML(quill);
        }
      }
    }
    // add tag handler to quill toolbar
    toolbar.addHandler('ssml_prosody_rate', ssml_prosody_rate_handler.bind(this));

    // ssml_break
    // SSML BREAK tag
    // ----------------------
    // load texts for dropdown items
    const breakPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_break .ql-picker-item'));
    breakPickerItems.forEach(item => item.textContent = item.dataset.value);
    // style toolbar button with icon and keep dropdown values
    // <i class="forward icon" title="Prosody Rate"></i>
    document.querySelector('.ql-ssml_break .ql-picker-label').innerHTML = '<span class="ql-btn-caption">BREAK</span>' + document.querySelector('.ql-ssml_break .ql-picker-label').innerHTML;

    function ssml_break_handler(value) {
      // get current selected text as range
      var range = quill.getSelection();
      // only if range is currently selected
      if (range) {
        // add tag at the end of the selected range
        this.quill.insertText(range.index, `<break strength="${value}"/>`);
        // set cursor position to the end of new tag
        this.quill.setSelection(range.index + value.length + 21);
        stringUtil.formatEditorXML(quill);
      }
    }
    // add tag handler to quill toolbar
    toolbar.addHandler('ssml_break', ssml_break_handler.bind(this));
  }
}

const onTextChange = (quill) => {
  return (delta, oldDelta, source) => {
    setTimeout(() => {
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
          document.getElementById("editor").classList.add("invaildSSML");
        } else {
          document.getElementById("editor").classList.remove("invaildSSML");
        }
      } else {
        document.getElementById("editor").classList.add("invaildSSML");
      }
    }, 1000);
  }
}

module.exports = {
  RichVoiceEditor,
  onTextChange
};