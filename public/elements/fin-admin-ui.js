import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./fin-admin-ui.html"

import "../lib"
import FinInterface from "./interfaces/FinInterface"

import "./fin-editor"
import "./header/app-header"

export default class FinAdminUi extends Mixin(PolymerElement)
  .with(EventInterface, FinInterface) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      
    }
  }

  constructor() {
    super();
    this.active = true;

    // parse config from url
    let jwt = this._getParameterByName('token');
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

    // clear the url
    window.history.pushState({}, 'Fin Editor', '/');
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