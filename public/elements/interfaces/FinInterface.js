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

    _getContainerAuthorizations(path, allowCached) {
      return this.FinModel.getContainerAuthorizations(path, allowCached);
    }

    _removeContainer(path) {
      return this.FinModel.removeContainer(path);
    }

    _addContainerAuthorization(options) {
      return this.FinModel.addContainerAuthorizations(options);
    }

    _createPermissionsArray(authorization) {
      let permissions = [];
      for( let key in authorization ) {
  
        let permission = {
          name : key,
          read : authorization[key]['http://www.w3.org/ns/auth/acl#Read'] ? true : false,
          write : authorization[key]['http://www.w3.org/ns/auth/acl#Write'] ? true : false
        }
  
        if( permission.name === 'http://xmlns.com/foaf/0.1/Agent' ) {
          permission.name = 'Public';
        }
  
        permissions.push(permission);
      }
  
      return permissions;
    }

  }