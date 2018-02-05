import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./app-header.html"

import FinInterface from "../interfaces/FinInterface"

export default class AppHeader extends Mixin(PolymerElement)
  .with(EventInterface, FinInterface) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      username : {
        type : String,
        value : ''
      },
      cwd : {
        type : String,
        value : ''
      },
      returnUrl : {
        type : String,
        value : ''
      },
      host : {
        type : String,
        value : ''
      }
    }
  }

  constructor() {
    super();
    this.active = true;
  }

  ready() {
    super.ready();
    this.host = this._getApiConfig().host;
  }

  _onUserUpdate(user) {
    this.username = user.username;
  }

  async _onCwdUpdate(cwd) {
    this.cwd = cwd;

    let config = this._getApiConfig();
    let path = await this._getDefinedBy(cwd);

    this.returnUrl = config.host+config.fcBasePath+path;
  }

  _onConfigUpdate(config) {
    this.host = config.host;
  }

}

customElements.define('app-header', AppHeader);