import React from 'react';
import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';

export default class First extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simple: true
    };
  }
  
  handleToggle() {
    this.setState({
      simple: !this.state.simple
    });
  }
  
  render() {
    return <div className='welcome'>
        <h1>Hello!</h1>
        <div>C'est comment ton nom ?<br />
          <TextField />
        </div>
        <div>
          <Toggle
            label="Profil simplifié (sans password)"
            defaultToggled={true}
            toggled={this.state.simple}
            onToggle={this.handleToggle.bind(this)}
          />
        </div>
        <div style={{display: this.state.simple ? 'none' : 'block'}}>
          Email, password
        </div>
        <div> 
          Créer une nouvelle liste, ou rejoindre une liste partagée (textbox pour ref. de la list)
        </div>
        <div>
          [commencer]
        </div>
      </div>;
  }
}