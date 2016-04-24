import React from 'react';
import Toggle from 'material-ui/Toggle';

const spaced = {
  margin: '20px 0'
};

export default class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      listName: props.userInfos.list.humanRef
    };
  }
  
  render() {
    
    var Share = <Toggle
          style={spaced}
          label='Partager ma liste de course'
          toggled={!this.state.join && this.state.share}
          onToggle={() => this.toggleShare()}
        />
    
    return <div className='current-list'>
      <Toggle
        style={spaced}
        label="Rejoindre la liste de quelqu'un"
        toggled={this.state.join}
        onToggle={() => this.toggleJoin()}
        />
      {this.state.join ? Join : null}
      {!this.state.join ? Share : null}
      </div>;
  }
}