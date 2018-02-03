module.exports = subclass => 
  class FinInterface extends subclass {

    constructor() {
      super();
      this._injectModel('FinModel');
    }

    _setApiConfig(config) {
      this.FinModel.setConfig(config);
    }

    _getApiConfig() {
      return this.FinModel.getConfig();
    }

    _getContainer(path, allowCached=false) {
      return this.FinModel.get(path, allowCached);
    }

    _getCwd() {
      return this.FinModel.getCwd();
    }

    _getCwdUrl() {
      return this.FinModel.getCwdUrl();
    }

    _setCwd(cwd) {
      this.FinModel.setCwd(cwd);
    }

    _getDefinedBy(path) {
      return this.FinModel.getDefinedBy(path);
    }

    _getContainerAuthorizations(path) {
      return this.FinModel.getContainerAuthorizations(path);
    }

  }