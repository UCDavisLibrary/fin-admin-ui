import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./fin-editor.html"
import api from "@ucd-lib/fin-node-api";

import ace from 'brace';
import escape from 'escape-html';
import 'brace/mode/turtle';
import 'brace/theme/monokai';

import FinInterface from "./interfaces/FinInterface"

export default class FinEditor extends Mixin(PolymerElement)
  .with(EventInterface, FinInterface) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      hasError : {
        type : Boolean,
        value : false
      },
      returnUrl : {
        type : String,
        value : ''
      },
      returnText: {
        type : String,
        value : ''
      }
    }
  }

  constructor() {
    super();
    this.active = true;
    this.editTimer = -1;
  }

  ready() {
    super.ready();

    this.moveCss('#ace_editor\\.css');
    this.moveCss('#ace-tm');

    var editor = ace.edit(this.$.root);
    editor.renderer.addEventListener("themeLoaded", this.onThemeLoaded.bind(this));
    editor.on('change', (e) => this._onEditorChange(e));
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/turtle");
    this.editor = editor;
  }

  onThemeLoaded(e) {
    var themeId = "#" + e.theme.cssClass;
    this.moveCss(themeId);
  }

  moveCss(id) {
    let ele = document.querySelector(id);
    document.head.removeChild(ele);
    this.shadowRoot.appendChild(ele);
  }

  async _onCwdUpdate(cwd) {
    let config = this._getApiConfig();
    let path = await this._getDefinedBy(cwd);

    this.returnUrl = config.host+config.fcBasePath+path;
    this.returnText = 'Return to '+cwd;
  }

  _onContainerUpdate(e) {
    if( e.state !== 'loaded' ) return;
    this.editor.setValue(e.payload.body);

    this.originalDoc = e.payload.body;
  }

  _onEditorChange(e) {
    if( this.editTimer !== -1 ) clearTimeout(this.editTimer);
    this.editTimer = setTimeout(() => {
      this.editTimer = -1;
      this._renderDiff();
    }, 500);
  }

  async _renderDiff() {
    let currentDoc = this.editor.getValue();
    try {
      this.sparql = await api.transform.diffToSparql(this.originalDoc, currentDoc);
      this.$.diff.innerHTML = escape(this.sparql).replace(/ /g,'&nbsp;').replace(/\n/g, '<br />');
      this.hasError = false;
    } catch(e) {
      this.$.error.innerHTML = e.message;
      this.hasError = true;
    }
  }

  async _save() {
    let {response} = await api.patch({
      path : '/',
      content : this.sparql
    });

    alert(response.statusCode+' '+response.body);
  }
  

}

customElements.define('fin-editor', FinEditor);