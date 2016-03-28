import B from './backendless';
import Config from '../../config';

class Security {
  constructor() {
    
  }
  
  auth() {
    //TODO: replace this by real user auth    
    return B.login(Config.TMPUser);
  }
}

export default new Security();