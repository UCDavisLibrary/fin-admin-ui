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

  async get(path, allowCached=false) {
    if( allowCached ) {
      let container = this.store.getContainer(path);
      if( container && container.state === this.store.STATE.LOADED ) {
        return container;
      }
    }

    await this.service.get(path);
    return this.store.getContainer(path);
  }

}

module.exports = new FinModel();