import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import "@polymer/iron-pages/iron-pages"
import template from "./fin-admin-ui.html"

import "../lib"
import FinInterface from "./interfaces/FinInterface"

import "./fin-editor"
import "./app-change-cwd"
import "./header/app-header"
import "./config/app-config"
import "./acl/app-acl-editor"

export default class FinAdminUi extends Mixin(PolymerElement)
  .with(EventInterface, FinInterface) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      view : {
        type : String,
        value : 'editor'
      },
      showBack : {
        type : Boolean,
        value : false
      }
    }
  }

  constructor() {
    super();
    this.active = true;

    // parse config from url
    let jwt = this._getParameterByName('token');
    if( !jwt ) jwt = this._getParameterByName('jwt');
    let fcUrl = this._getParameterByName('fcUrl');
    let config = {};

    if( jwt ) config.jwt = jwt;
    if( fcUrl ) {
      fcUrl = new URL(fcUrl);
      let cwd = fcUrl.pathname.replace(this._getApiConfig().fcBasePath, '');
  
      this._setCwd(cwd);
      config.host = fcUrl.protocol+'//'+fcUrl.host;
    }

    this._setApiConfig(config);

    let hash = window.location.hash.replace('#','');
    window.history.pushState({}, 'Fin Editor', '/#'+hash);

    // clear the url
    window.addEventListener('hashchange', (e) => this._onHashChange());
    this._onHashChange();
  }

  _onHashChange() {
    this.view = window.location.hash.replace('#', '') || 'editor';

    if( this.view === 'cd' ) {
      this.$.cd.value = this._getCwd();
      this.$.cd.search();
    }

    this.showBack = (this.view !== 'editor');
  }

  _getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

}

customElements.define('fin-admin-ui', FinAdminUi);