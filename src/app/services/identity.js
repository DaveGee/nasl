import B from '../data/backendless';
import Config from '../../config';

class IdentityCache {  
  get UserToken() {
    return localStorage.getItem('nasl-user-token');
  }
  set UserToken(value) {
    localStorage.setItem('nasl-user-token', value);
  }
  
  get Name() {
    return localStorage.getItem('nasl-user-name');
  }
  set Name(value) {
    localStorage.setItem('nasl-user-name', value);
  }
  
  get Username() {
    return localStorage.getItem('nasl-user');
  }  
  set Username(value) {
    localStorage.setItem('nasl-user', value);
  }
}

const _cache = new IdentityCache();

class Identity {
  get Cache() {
    return _cache;
  }
  
  get User() {
    return this._user;
  }
  
  clearToken() {
    localStorage.removeItem('nasl-user-token');
  }
  
  updateName(name) {
    if(_cache.Name !== this._user.name)
      B.updateName(_cache.Name)
        .then(() => (this._user.name = _cache.Name));
  }
  
  setList(list) {
    this._user.list = list;
  }
  
  auth(email, password) {
    return B.login({ login: email, password: password || Config.anonymousPassword })
      .then(data => this._user = data);
  }
}

export default new Identity();