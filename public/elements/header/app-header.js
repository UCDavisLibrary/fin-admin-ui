import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./app-header.html"

import FinInterface from "../interfaces/FinInterface"
import "./app-change-cwd"

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
      }
    }
  }

  constructor() {
    super();
    this.active = true;
  }

  _onUserUpdate(user) {
    this.username = user.username;
  }

  _onCdClicked() {
    this.$.cd.value = this._getCwd();
    this.$.cd.show();
  }

  async _onCwdUpdate(cwd) {
    this.cwd = cwd;

    let config = this._getApiConfig();
    let path = await this._getDefinedBy(cwd);

    this.returnUrl = config.host+config.fcBasePath+path;
  }

}

customElements.define('app-header', AppHeader);