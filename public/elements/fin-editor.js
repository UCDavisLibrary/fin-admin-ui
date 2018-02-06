import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./fin-editor.html"
import api from "@ucd-lib/fin-node-api";

import ace from 'brace';
import escape from 'escape-html';
import 'brace/mode/turtle';
import 'brace/theme/monokai';

import FinInterface from "./interfaces/FinInterface"
import "./version/app-version-info"

export default class FinEditor extends Mixin(PolymerElement)
  .with(EventInterface, FinInterface) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      visible : {
        type : Boolean,
        value : false,
        observer : '_onVisibleChange'
      },
      hasError : {
        type : Boolean,
        value : false
      },
      aclDefinedAt : {
        type : String,
        value : ''
      },
      cwd : {
        type : String,
        value : ''
      },
      user : {
        type : Object,
        value : null
      },
      permissions : {
        type : Array,
        value : () => []
      },
      showEdit : {
        type : Boolean,
        value : false
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

  _onVisibleChange() {
    if( !this.visible ) return;
    window.dispatchEvent(new Event('resize'))
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

  _onUserUpdate(user) {
    this.user = user;
  }

  _onContainerUpdate(e) {
    if( e.state !== 'loaded' ) return;
    this.editor.setValue(e.payload.body);

    this.originalDoc = e.payload.body;
  }

  _onCwdUpdate(cwd) {
    this.cwd = cwd;
    this._getContainer(cwd);
    this._updateAuthorization();
  }

  _onAuthorizationUpdate(e) {
    if( e.id !== this._getCwd() ) return;
    this._updateAuthorization();
  }

  async _updateAuthorization() {
    let auth = await this._getContainerAuthorizations(this._getCwd());
    auth = auth.payload;
    this.aclDefinedAt = auth.definedAt;

    this.permissions = this._createPermissionsArray(auth.authorization);
  }

  _createPermissionsArray(authorization) {
    let permissions = [];
    for( let key in authorization ) {

      let permission = {
        name : key,
        read : authorization[key]['http://www.w3.org/ns/auth/acl#Read'] ? true : false,
        write : authorization[key]['http://www.w3.org/ns/auth/acl#Write'] ? true : false
      }

      if( permission.name === 'http://xmlns.com/foaf/0.1/Agent' ) {
        permission.name = 'Public';
      }

      permissions.push(permission);
    }

    return permissions;
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
      path : this._getCwd(),
      content : this.sparql
    });

    alert(response.statusCode+' '+response.body);
  }

  _toggleEdit() {
    this.showEdit = !this.showEdit;
  }

}

customElements.define('fin-editor', FinEditor);