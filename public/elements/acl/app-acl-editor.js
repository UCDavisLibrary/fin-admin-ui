import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./app-acl-editor.html"

import FinInterface from "../interfaces/FinInterface"

export default class AppAclEditor extends Mixin(PolymerElement)
  .with(EventInterface, FinInterface) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      aclDefinedAt : {
        type : String,
        value : ''
      },
      authContainers : {
        type : Array,
        value : () => []
      },
      visible : {
        type : Boolean,
        value : false,
        observer : '_onVisibleChange'
      }
    }
  }

  constructor() {
    super();
    this.active = true;
  }

  _onVisibleChange() {
    if( !this.visible ) return;
    this.edit();
  }

  async edit() {
    let auth = await this._getContainerAuthorizations(this._getCwd());
    auth = auth.payload;

    this.reset();

    this.render(auth);
  }

  reset() {
    this.$.username.value = '';
    this.$.createRead.checked = false;
    this.$.createWrite.checked = false;
  }

  render(auth) {
    this.aclDefinedAt = auth.definedAt;

    let authContainers = [];
    for( let key in auth.authorizations ) {
      authContainers.push({
        name : key,
        permissions : this._createPermissionsArray(auth.authorizations[key])
      });
    }

    this.authContainers = authContainers;
  }

  async _delete(e) {
    let index = parseInt(e.currentTarget.getAttribute('index'));
    let path = this.authContainers[index].name;

    if( !confirm('Are you sure you want to remove authorization at: '+path) ) return;

    await this._removeContainer(path);
    let auth = await this._getContainerAuthorizations(this._getCwd(), false);
    auth = auth.payload;
    this.render(auth);
  }

  async _create() {
    let agent = this.$.username.value;
    let modes = [];

    if( this.$.createRead.checked ) modes.push('http://www.w3.org/ns/auth/acl#Read');
    if( this.$.createWrite.checked ) modes.push('http://www.w3.org/ns/auth/acl#Write');

    let options = {
      agent, modes,
      path : this._getCwd()
    }

    if( !options.agent || !modes.length ) {
      return alert('Please provide a username and at least on permission');
    }

    await this._addContainerAuthorization(options);

    this.reset();
    let auth = await this._getContainerAuthorizations(this._getCwd(), false);
    auth = auth.payload;
    this.render(auth);
  }

}

customElements.define('app-acl-editor', AppAclEditor);