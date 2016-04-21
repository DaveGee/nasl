import React from 'react';
import Identity from '../../services/identity';

export default class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      listName: Identity.user.list.humanRef,
      listId: Identity.user.list.objetId
    };
  }
  
  render() {
    return <div>{this.state.listName}<br />{this.state.listId}</div>;
  }
}