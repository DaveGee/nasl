import B from './backendless';
import Config from '../../config';

class Security {
  constructor() {
    
  }
  
  get user() {
    return this._user;
  }
  
  auth() {
    //TODO: replace this by real user auth    
    return B.login(Config.TMPUser)
      .then(userData => {
        //TODO: map another structure of user (backendless => custom for this app ?)
        this._user = userData;
        return userData;
      });
  }
}

export default new Security();