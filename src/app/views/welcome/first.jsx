import React from 'react';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/toggle';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

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
      message: props.message || '',
      name: props.name || '',
      email: props.email || '',
      invalid: false
    };
  }
  
  toggleSimple() {
    this.setState({
      simple: !this.state.simple  
    });
  }
  
  handleReturn(ev) {
    if(ev.which === 13)
      this.handleConnect();
  }
  
  nameChanged(event) {
    this.setState({
      name: event.target.value,
      invalid: false
    });
  }
  
  emailChanged(event) {
    this.setState({
      email: event.target.value,
      invalid: false
    });
  }
  
  handleReturn(ev) {
    if(ev.which === 13)
      this.handleConnect();
  }
  
  handleConnect() {
    if(!this.state.name || !this.state.email) {
      this.setState({ invalid: true });
      return;
    }
    
    var connectionInfos = {
      name: this.state.name,
      email: this.state.email,
      simpleMode: this.state.simple
    };
    
    this.props.onConnect(connectionInfos);
  }
  
  render() {    
    
    let nameError = !this.state.name && this.state.invalid ? 'Cette info est vraiment nécessaire' : null;
    let emailError = !this.state.email && this.state.invalid ? 'Cette info est vraiment nécessaire' : null;
    
    return <div className='welcome-screen'>
        {this.state.message ? <div className='error'>{this.state.message}<Divider /></div> : ''}
        <h1>Hello!</h1>
        Pour continuer on a besoin au moins d'un nom et d'une adresse email
        <TextField 
          hintText='Ton nom de scène' 
          floatingLabelText='Ton nom' 
          errorText={nameError}
          fullWidth={true} 
          ref={(c) => this._nameCtrl = c}
          value={this.state.name}
          onChange={this.nameChanged.bind(this)}
          onKeyDown={this.handleReturn.bind(this)}
          />
        <TextField
          hintText='Adresse email'
          floatingLabelText='Ton email'
          errorText={emailError}
          fullWidth={true}
          ref={(c) => this._emailCtrl = c}
          value={this.state.email}
          onChange={this.emailChanged.bind(this)}
          onKeyDown={this.handleReturn.bind(this)}
          />
        <Toggle
          style={spaced}
          disabled={true}
          label={this.state.simple ? 'Accès simplifié' : 'Login'}
          toggled={this.state.simple}
          onToggle={() => this.toggleSimple()}
        />
        {this.state.simple ? '' : login}
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