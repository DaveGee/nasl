import B from './backendless';
import Config from '../../config';
import Cookies from '../helpers/cookies';

class Security {
  constructor() {
    
  }
  
  get user() {
    return this._user;
  }
  
  auth() {
    //TODO: replace this by real user auth
    
    let saveUserData = function(userData) {
      //TODO: map another structure of user (backendless => custom for this app ?)
        // {
        //   userId: userData["objectId"],
        //   userToken: userData['user-token'],
        //   name: userData['name'],
        //   email: userData['email'],
        //   listRef: userData['listRef']
        // }
        this._user = userData;
        
        Cookies.setItem("nasl-user-token", userData.userToken, Infinity, '/');
        
        return userData;
    };
    
    let login = function() {
      return B.login(Config.TMPUser)
        .then(saveUserData.bind(this));
    };
    
    // test cookie 
    if(Cookies.hasItem('nasl-user-token'))
      return B.checkSession(Cookies.getItem('nasl-user-token'), Config.TMPUser.login)
                .then(saveUserData.bind(this))
                .catch(login.bind(this));
    else
      return login.call(this); 
  }
}

export default new Security();