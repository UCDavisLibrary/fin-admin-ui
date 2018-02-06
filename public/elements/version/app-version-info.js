import {Element as PolymerElement} from "@polymer/polymer/polymer-element"
import template from "./app-version-info.html"

import FinInterface from "../interfaces/FinInterface"

const HAS_VERSION_LABEL = 'http://fedora.info/definitions/v4/repository#hasVersionLabel';
const CREATED = 'http://fedora.info/definitions/v4/repository#created';

export default class AppVersionInfo extends Mixin(PolymerElement)
  .with(EventInterface, FinInterface) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      path : {
        type : String,
        value : '',
        observer : '_onPathChange'
      },
      versions : {
        type : Array,
        value : () => []
      }
    }
  }

  async _onPathChange() {
    if( !this.path ) return;
    let versions = await this._getContainerVersions(this.path);

    versions = versions.payload
      .filter(version => version[HAS_VERSION_LABEL])
      .map(version => {
        return {
          created : version[CREATED][0]['@value'],
          label : version[HAS_VERSION_LABEL][0]['@value']
        }
      });

    if( !versions.length ) {
      versions.push({
        label : 'None'
      })
    }

    this.versions = versions;
    console.log(this.versions);
  }


}

customElements.define('app-version-info', AppVersionInfo);