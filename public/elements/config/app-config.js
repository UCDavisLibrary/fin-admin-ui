import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./app-config.html"

import FinInterface from "../interfaces/FinInterface"

export default class AppConfig extends Mixin(PolymerElement)
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
      isAdmin : {
        type : Boolean,
        value : false
      },
      expires : {
        type : String,
        value : ''
      },
      issued : {
        type : String,
        value : ''
      }
    }
  }

  constructor() {
    super();
    this.active = true;
  }

  get host() {
    return this.$.host.value.replace(/\/$/, '');
  }

  set host(value) {
    this.$.host.value = value;
  }

  get fcBasePath() {
    return this.$.fcBasePath.value;
  }

  set fcBasePath(value) {
    this.$.fcBasePath.value = value;
  }

  get jwt() {
    return this.$.jwt.value;
  }

  set jwt(value) {
    this.$.jwt.value = value;
  }


  _onConfigUpdate(e) {
    this.host = e.host || '';
    this.fcBasePath = e.fcBasePath || '';
    this.jwt = e.jwt || '';
  }

  _onUserUpdate(e) {
    this.username = e.username || '';
    this.isAdmin = e.admin || false;
    this.expires = new Date(e.exp*1000).toISOString();
    this.issued = new Date(e.iat*1000).toISOString();
  }

  _save() {
    this._setApiConfig({
      host : this.host,
      fcBasePath : this.fcBasePath,
      jwt : this.jwt
    });
  }

  _login() {
    if( !this.host ) return alert('You must provide a Fin host');

    let authUrl = new URL(this.host+'/auth/cas/login');
    authUrl.searchParams.set('cliRedirectUrl', window.location.href);
    authUrl.searchParams.set('provideJwt', 'true');
    authUrl.searchParams.set('force', 'true');
    window.location = authUrl.href;
  }

}

customElements.define('app-config', AppConfig);