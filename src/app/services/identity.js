import B from './backendless';
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
        
        localStorage.setItem('nasl-user-token', userData.userToken);
        
        return userData;
    };
    
    let login = function() {
      return B.login(Config.TMPUser)
        .then(saveUserData.bind(this));
    };
    
    // test cookie
    let user = localStorage.getItem('nasl-user'); 
    if(user)
      return B.checkSession(user, Config.TMPUser.login)
                .then(saveUserData.bind(this))
                .catch(login.bind(this));
    else
      return login.call(this); 
  }
}

export default new Identity();