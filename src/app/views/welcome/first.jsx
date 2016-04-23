import React from 'react';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/toggle';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Identity from '../../services/identity';
import config from '../../../config';
import B from '../../data/backendless';

const spaced = {
  margin: '20px 0'
};
                         
const login = <div key='login'>
      <TextField hintText="Email" floatingLabelText="Email" fullWidth={true} /><br />
      <TextField hintText="Mot-de-passe" floatingLabelText="Mot-de-passe" type="password" fullWidth={true} />
    </div>;

export default class First extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simple: true,
      join: false,
      message: props.message
    };
    
    Identity.clearToken();
  }
  
  handleToggle(stateVal) {
    var state = {};
    state[stateVal] = !this.state[stateVal];
    this.setState(state);
  }
  
  handleConnect() {
    Identity.Cache.Username = this._emailCtrl.input.value;
    Identity.Cache.Name = this._nameCtrl.input.value;
    
    //TODO: no registering here.. account must have been created before
    //TODO: handle join list
    //TODO: handle private mode (with password...)
    
    return Identity.auth(Identity.Cache.Username, config.anonymousPassword)
              .then(() => Identity.updateName(Identity.Cache.Name))
              .then(() => this.props.onConnect())
              .catch(res => this.setState({ message: 'Err: ' + res }));
  }
  
  render() {
    
    var secret = <TextField hintText="Entrer le code secret" 
                         floatingLabelText="Entrer le code secret" 
                         fullWidth={true}
                         defaultValue={''}
                         ref={(c) => this._listCtrl = c} 
                         key='secret' />;
    
    return <div className='welcome-screen'>
        {this.state.message ? <div className='error'>{this.state.message}<Divider /></div> : ''}
        <h1>Hello!</h1>
        Pour continuer on a besoin au moins d'un nom et d'une adresse email
        <TextField 
          hintText="Ton nom de scène" 
          floatingLabelText="Ton nom" 
          fullWidth={true} 
          ref={(c) => this._nameCtrl = c}
          onChange
          defaultValue={Identity.Cache.Name} />
        <TextField
          hintText="Adresse email"
          floatingLabelText="Ton email"
          fullWidth={true}
          ref={(c) => this._emailCtrl = c}
          defaultValue={Identity.Cache.Username}
          />
        <Toggle
          style={spaced}
          disabled={true}
          label={this.state.simple ? 'Accès simplifié' : 'Login'}
          toggled={this.state.simple}
          onToggle={this.handleToggle.bind(this, 'simple')}
        />
        {this.state.simple ? '' : login}
        <Toggle
          style={spaced}
          label={this.state.join ? 'Rejoindre une liste existante' : 'Créer une nouvelle liste'}
          toggled={this.state.join}
          onToggle={this.handleToggle.bind(this, 'join')}
          />
        {this.state.join ? secret : '' }
        <Divider />
        <RaisedButton
          style={spaced}
          label="Commencer!" 
          primary={true} 
          onTouchEnd={() => this.handleConnect()} 
          fullWidth={true} />
      </div>;
  }
}