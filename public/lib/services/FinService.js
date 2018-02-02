const {BaseService} = require('@ucd-lib/cork-app-utils');
const FinStore = require('../stores/FinStore');
const api = require('@ucd-lib/fin-node-api');

class FinService extends BaseService {

  constructor() {
    super();
    this.store = FinStore;
  }

  /**
   * @method get
   * @description wrapper around api.get()
   * 
   * @param {String} path path to container
   * @param {Boolean} serverManaged should the server managed properties be fetched?
   * 
   * @returns {Promise} resolves when store is finished updating request response.
   */
  get(path, serverManaged=false) {
    let options = {path};

    if( !serverManaged ) {
      options.headers = {
        Prefer : api.GET_PREFER.REPRESENTATION_OMIT_SERVER_MANAGED
      }
    }

    return this._apiRequestHelper({
      apiCall : api.get(options),
      onLoading : promise => this.store.setContainerLoading(path, promise),
      onLoad : payload => this.store.setContainerLoaded(path, payload),
      onError : error => this.store.setContainerLoading(path, error)
    });
  }

  _apiRequestHelper(options) {
    let promise = new Promise(async (resolve, reject) => {
      try {
        let {response} = await options.apiCall;
        if( api.isSuccess(response) ) {
          options.onLoad(response);
          resolve(response);
        } else {
          options.onError(response);
          reject(response);
        }
      } catch(e) {
        options.onError(e);
        reject(e);
      }
    });
    options.onLoading(promise);
    return promise;
  }

}

module.exports = new FinService();