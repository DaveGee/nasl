import React from 'react';
import Identity from '../../services/identity';

export default class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      listName: Identity.User.list.humanRef,
      listId: Identity.User.list.objetId
    };
  }
  
  render() {
    return <div className='current-list'>
        {this.state.listName}<br />
        {this.state.listId}
      </div>;
  }
}