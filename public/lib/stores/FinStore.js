const {BaseStore} = require('@ucd-lib/cork-app-utils');

class FinStore extends BaseStore {

  constructor() {
    super();

    this.data = {
      cwd : '/',
      byPath : {},
      definedBy : {}
    };
    this.events = {
      CONTAINER_UPDATE : 'container-update',
      CWD_UPDATE : 'cwd-update'
    };
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

  setCwd(cwd) {
    this.cwd = cwd;
    this.emit(this.events.CWD_UPDATE, cwd);
  }

  getCwd() {
    return this.cwd;
  }

  getDefinedBy(path) {
    return this.data.definedBy[path];
  }

  setDefinedBy(path, definedBy) {
    this.data.definedBy[path] = definedBy;
  }

}

module.exports = new FinStore();