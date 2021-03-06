import React from 'react';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import atomicCounter from '../../helpers/counter';

const spaced = {
  margin: '20px 0'
};

const newRef = () => atomicCounter(10000);

export default class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      listName: props.userInfos.list.humanRef || newRef(),
      joinListName: '',
      join: false
    };
  }
  
  handleReturn(ev) {
    if(ev.which === 13)
      this.tryJoin();
  }
  
  changeName(ev) {
    this.setState({
      joinListName: ev.target.value
    });
  }
  
  toggleJoin() {
    this.setState({
      join: !this.state.join
    });
  }
  
  tryJoin() {
    this.props.onJoinList(this.state.joinListName);
  }
  
  render() {
        
    const Share = this.state.join ? null : 
      <div>
        <TextField
           disabled={true}
           value={this.state.listName}
           fullWidth={true}
           floatingLabelText='Code de ma liste'
           />
        {this.props.otherListUsers && this.props.otherListUsers.length > 0 ?
          <List>
            <Subheader>Les personnes qui utilisent ma liste :</Subheader>
            {this.props.otherListUsers.map(c => 
              <ListItem key={c} primaryText={c}
                        leftAvatar={<Avatar src='http://lorempixel.com/100/100/people/' />}
                        /> 
            )}
          </List>
          : null
        }
      </div>;

    var codeError = '';
    const Join = this.state.join ? <div>
        <TextField
          hintText='Code secret de sa liste'
          floatingLabelText='Code secret de sa liste'
          errorText={codeError}
          fullWidth={true}
          value={this.state.joinListName}
          onChange={this.changeName.bind(this)}
          onKeyDown={this.handleReturn.bind(this)}
          />
        <br />
        <RaisedButton 
          secondary={true}
          fullWidth={true}
          label='Rejoindre'
          onTouchEnd={() => this.tryJoin()}
          />
      </div> : null;
    
    const Error = this.props.errorMessage ? <div className='error'>{errorMessage}</div> : null;
    
    return <div className='current-list'>
        {Error}
        <Toggle
          style={spaced}
          label="Rejoindre la liste de quelqu'un"
          toggled={this.state.join}
          onToggle={() => this.toggleJoin()}
          />
        {Join}
        {Share}
      </div>;
  }
}