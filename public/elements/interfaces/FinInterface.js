module.exports = subclass => 
  class FinInterface extends subclass {

    constructor() {
      super();
      this._injectModel('FinModel');
    }

    _setApiConfig(config) {
      this.FinModel.setConfig(config);
    }

    _getContainer(path, allowCached=false) {
      return this.FinModel.get(path, allowCached);
    }

  }