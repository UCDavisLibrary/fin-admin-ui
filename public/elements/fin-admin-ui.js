import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./fin-admin-ui.html"

import "../lib"
import FinInterface from "./interfaces/FinInterface"

import "./fin-editor"

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
    this._setApiConfig({
      host: 'http://localhost:3000',
      jwt : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpybWVyeiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTY5OTc3NjksImV4cCI6MTUxNzA4NDE2OSwiaXNzIjoibGlicmFyeS51Y2RhdmlzLmVkdSJ9.dLfeYQP5c_8ir8-aq8wyTLOa5YuAf8sOBSwRs6_cdvQ'
    });

    this.init();
  }

  async init() {
    let container = await this._getContainer('/');
    console.log(container.payload.body);
  }



}

customElements.define('fin-admin-ui', FinAdminUi);