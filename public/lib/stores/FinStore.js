const {BaseStore} = require('@ucd-lib/cork-app-utils');
const api = require('@ucd-lib/fin-node-api');

class FinStore extends BaseStore {

  constructor() {
    super();

    this.storage = new LocalStorage();
    
    // patch in a listener for config changes
    this._patchConfigSettings();

    this.data = {
      user : null,
      cwd : '/',
      byPath : {},
      definedBy : {}
    };

    this.events = {
      CONTAINER_UPDATE : 'container-update',
      USER_UPDATE : 'user-update',
      CWD_UPDATE : 'cwd-update'
    };

    // see if we have stored values on load
    let cwd = this.storage.getItem('cwd');
    if( cwd ) this.setCwd(cwd);

    let config = this.storage.getItem('config');
    if( config ) api.setConfig(JSON.parse(config));
  }

  _patchConfigSettings() {
    let orgSetConfig = api.setConfig;

    api.setConfig = (config) => {
      if( config.jwt && api.getConfig().jwt !== config.jwt ) {
        this._setUser(config.jwt);
      }
      orgSetConfig(config);
      config = api.getConfig();
      this.storage.setItem('config', JSON.stringify(api.getConfig()));
    }
  }

  /**
   * @method logout
   * @description remove config and jwt for localStorage
   */
  logout() {
    this.storage.removeItem('config');
    this.storage.removeItem('jwt');
  }

  /**
   * @method _setUser
   * @description called when the api.config() is set and the jwt token
   * was set.  Parses jwt token for user information
   * @private
   */
  _setUser(jwt) {
    this.data.user = JSON.parse(atob(jwt.split('.')[1]));
    this.emit(this.events.USER_UPDATE, this.data.user);
  }

  /**
   * @method getUser
   * @description return current user information
   */
  getUser() {
    return this.data.user;
  }

  getContainer(path) {
    return this.data.byPath[path];
  }

  setContainerLoading(path, request) {
    this._setContainerState({request, path, state: this.STATE.LOADING});
  }

  setContainerLoaded(path, payload) {
    this._setContainerState({payload, path, state: this.STATE.LOADED});
  }

  setContainerError(path, error) {
    this._setContainerState({error, path, state: this.STATE.ERROR});
  }

  _setContainerState(state) {
    this.data.byPath[state.path] = state;
    this.emit(this.events.CONTAINER_UPDATE, state);
  }

  /**
   * @method setCwd
   * @description set and save the current working directory
   */
  setCwd(cwd) {
    this.data.cwd = cwd;
    this.storage.setItem('cwd', cwd);
    this.emit(this.events.CWD_UPDATE, cwd);
  }

  /**
   * @method getCwd
   * @description get the current working directory
   */
  getCwd() {
    return this.data.cwd;
  }

  getCwdUrl() {
    let config = api.getConfig()
    return config.host+config.fcBasePath+this.getCwd();
  }

  /**
   * @method getDefinedBy
   * @description return the cached value of a containers definedBy value
   * 
   * @param {String} path container path
   * 
   * @returns {String}
   */
  getDefinedBy(path) {
    return this.data.definedBy[path];
  }

  /**
   * @method setDefinedBy
   * @description set the cache for a containers definedBy value
   * 
   * @param {String} path container path
   * @param {String} definedBy path container is definedBy (may be path itself)
   */
  setDefinedBy(path, definedBy) {
    this.data.definedBy[path] = definedBy;
  }

}

class LocalStorage {

  constructor() {
    this.supported = false;
    if( typeof window !== 'undefined' && window.localStorage ) {
      this.supported = true;
    }
  }

  getItem(key) {
    if( !this.supported ) return null;
    return window.localStorage.getItem(key);
  }

  setItem(key, value) {
    if( !this.supported ) return;
    window.localStorage.setItem(key, value);
  }

  removeItem(key) {
    if( !this.supported ) return;
    window.localStorage.removeItem(key);
  }

}

module.exports = new FinStore();