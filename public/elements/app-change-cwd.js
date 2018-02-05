import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import "@polymer/polymer/lib/elements/dom-repeat"
import template from "./app-change-cwd.html"
import api from "@ucd-lib/fin-node-api"

import FinInterface from "./interfaces/FinInterface"

export default class AppChangeCwd extends Mixin(PolymerElement)
  .with(EventInterface, FinInterface) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      errorMsg : {
        type : String,
        value : ''
      },
      hasError : {
        type : Boolean,
        value : false
      },
      children : {
        type : Array,
        value : () => []
      }
    }
  }

  ready() {
    super.ready();
    // this.parentNode.removeChild(this);
    // document.body.appendChild(this);
    this.timer = -1;
  }

  get value() {
    return this.$.input.value;
  }

  set value(value) {
    this.$.input.value = value;
  }

  _onKeyUp(e) {
    if( e.which === 13 ) {
      return this._setFromInput();
    }

    if( this.timer === -1  ) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = -1;
      this.search();
    }, 100);
  }

  async _setFromInput() {
    let val = this.$.input.value;
    var {tail, path} = await this._parsePath(val);
    this._setCwd(path);
    window.location.hash = '';
  }

  async _onPathClicked(e) {
    this._setCwd(e.currentTarget.innerHTML);
    window.location.hash = '';
  }

  async _parsePath(val) {
    let tail = '';
    let path = '';
    let exists = await this._exists(val);

    if( exists ) {
      path = val;
    } else {
      let parts = val.split('/');

      tail = parts.pop();
      path = parts.join('/');
      if( !path ) path = '/';
    }

    path = await this._getDefinedBy(path);

    return {tail, path};
  }

  async search() {
    let val = this.$.input.value;
    var {tail, path} = await this._parsePath(val);

    var {response} = await api.get({
      path: path,
      headers : {
        accept : api.RDF_FORMATS.JSON_LD
      }
    });

    if( response.statusCode !== 200 ) {
      this.errorMsg = response.statusCode+' '+response.body;
      return this.hasError = true;
    } 
    this.hasError = false;

    let container = this.getContainer(response.body);
    this.children = this.getChildren(container, tail);
  }

  getChildren(container, tail) {
    let config = api.getConfig();
    let baseUrl = config.host+config.fcBasePath;
    let children = container['http://www.w3.org/ns/ldp#contains'];
    if( !children ) return [];
    
    children = children.map(child => child['@id'].replace(baseUrl, ''));

    // if( tail ) {
    //   let re = new RegExp('^'+tail, 'i');
    //   children = children.filter(child => child.split('/').pop().match(re));
    // }

    return children;
  }

  getContainer(body) {
    if( typeof body === 'string') {
      body = JSON.parse(body);
    }

    for( var i = 0; i < body.length; i++ ) {
      if( body[i]['@type'].indexOf('http://www.w3.org/ns/ldp#Container') > -1 ) {
        return body[i];
      }
      if( body[i]['@type'].indexOf('http://fedora.info/definitions/v4/repository#Binary') > -1 ) {
        return body[i];
      }
    }
  }

  async _exists(path) {
    var {response} = await api.head({path});
    if( response.statusCode === 200 ) return true;
    return false;
  }

}

customElements.define('app-change-cwd', AppChangeCwd);