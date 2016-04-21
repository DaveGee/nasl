import React from 'react';
import Identity from '../../services/identity';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return <div>{Identity.user.name}</div>;
  }
}