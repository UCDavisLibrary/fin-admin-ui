const {BaseModel} = require('@ucd-lib/cork-app-utils');
const FinService = require('../services/FinService');
const FinStore = require('../stores/FinStore');
const api = require('@ucd-lib/fin-node-api');

class FinModel extends BaseModel {

  constructor() {
    super();

    this.store = FinStore;
    this.service = FinService;
      
    this.register('FinModel');
  }

  setConfig(config) {
    api.setConfig(config);
  }

  getConfig() {
    return api.getConfig();
  }

  setCwd(cwd) {
    this.store.setCwd(cwd);
  }

  getCwd() {
    return this.store.getCwd();
  }

  getCwdUrl() {
    return this.store.getCwdUrl();
  }

  async get(path, allowCached=false) {
    path = await this.getDefinedBy(path);

    if( allowCached ) {
      let container = this.store.getContainer(path);
      if( container && container.state === this.store.STATE.LOADED ) {
        return container;
      }
    }

    await this.service.get(path);
    return this.store.getContainer(path);
  }

  /**
   * @method getDefinedBy
   * @description preform a http HEAD request to see if this path has a
   * definedBy link header set, if so return the definedBy path otherwise
   * return the given path
   * 
   * @param {String} path fcrepo path
   * 
   * @return {Promise} resolves to path
   */
  async getDefinedBy(path) {
    if( this.store.getDefinedBy(path) ) {
      return this.store.getDefinedBy(path);
    }

    let {response} = await api.head({path});
    let headers = api.parseLinkHeader(response.headers.link || '');

    if( headers.describedby ) {
      return headers.describedby[0].url.split(api.getConfig().fcBasePath)[1];
    }

    return path;
  }
  
  async getContainerAuthorizations(path) {
    return api.acl.authorizations({path});
  }

}

module.exports = new FinModel();