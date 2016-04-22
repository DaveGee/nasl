import React from 'react';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/toggle';
import RaisedButton from 'material-ui/RaisedButton';

export default class First extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simple: true,
      join: false
    };
  }
  
  handleToggle(stateVal) {
    var state = {};
    state[stateVal] = !this.state[stateVal];
    this.setState(state);
  }
  
  handleConnect() {
    console.log('connect');
  }
  
  render() {
    return <div className='welcome'>
        <h1>Hello!</h1>
        <TextField hintText="Quel est ton nom ?" floatingLabelText="Quel est ton nom ?" />
        <Toggle
          label="Profil simplifié (sans password)"
          toggled={this.state.simple}
          onToggle={this.handleToggle.bind(this, 'simple')}
        />
        <div style={{display: this.state.simple ? 'none' : 'block'}}>
          <TextField hintText="Email" floatingLabelText="Email" /><br />
          <TextField hintText="Mot-de-passe" floatingLabelText="Mot-de-passe" type="password" />
        </div>
        <Toggle
          label="Rejoindre une liste existante?"
          toggled={this.state.join}
          onToggle={this.handleToggle.bind(this, 'join')}
          />
        <div style={{display: this.state.join ? 'block' : 'none'}}>
          <TextField hintText="Entrer le code secret" floatingLabelText="Entrer le code secret" />
        </div>
        <RaisedButton label="Commencer!" primary={true} onTouchEnd={() => this.handleConnect()} />
      </div>;
  }
}