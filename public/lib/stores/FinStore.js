const {BaseStore} = require('@ucd-lib/cork-app-utils');

class FinStore extends BaseStore {

  constructor() {
    super();

    this.data = {
      byPath : {}
    };
    this.events = {
      CONTAINER_UPDATE : 'container-update' 
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

}

module.exports = new FinStore();