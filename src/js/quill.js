const editor = require('./editor'),
  form = require("./form");

const getToolBarOptions = () => {
  return {
    container: [
      [{
        'ssml_speak': ["eng", "hin"]
      }],
      [{
        'ssml_sayas': ['characters', 'cardinal', 'ordinal', 'digits', 'fraction', 'unit', 'time', 'telephone']
      }]
      , // Add this.
      [{
        'ssml_date': ['mdy', 'dmy', 'ymd', 'md', 'dm', 'ym', 'my', 'd', 'm', 'y', 'yyyymmdd']
      }], // Add this.
      [{
        'ssml_prosody_rate': ['0.8', '0.9', '1.0', '1.1', '1.2']
      }],
      [{
        'ssml_break': ['medium', 'strong']
      }],
      ['ssml_phoneme'] // Add this.
      
    ],
    handlers: {
      'ssml_speak': function () { }, // Add this.
      'ssml_sayas': function () { }, // Add this.
      'ssml_date': function () { }, // Add this.
      'ssml_phoneme': function () { }, // Add this.
      'ssml_prosody_rate': function () { }, // Add this
      'ssml_break': function () { }
    }
  }
}
window.quillInstance = null;

export const registerEditor = () => {
  Quill.register({
    'modules/rich-voice-editor': editor.RichVoiceEditor // Add this.
  })
  window.quillInstance = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: getToolBarOptions(),
      'rich-voice-editor': true // Add this.
    },
    placeholder: 'Type your utterance here'
  });

  // Validate on input
  window.quillInstance.on('text-change', form.onTextChange(window.quillInstance));
}

