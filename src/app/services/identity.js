import B from '../data/backendless';
import Config from '../../config';

class Identity {
  constructor() {
    
  }
  
  get user() {
    return this._user;
  }
  
  setList(list) {
    this._user.list = list;
  }
  
  auth() {
    return B.login(Config.TMPUser)
      .then(data => this._user = data);
  }
}

export default new Identity();