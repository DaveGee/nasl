import React from 'react';
import Avatar from 'material-ui/Avatar';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    var avatar = (this.props.userInfos.name || 'x')[0];
    
    return <div className='user-profile'>
      <Avatar>{avatar}</Avatar>
        <h1>{this.props.userInfos.name || 'John Doe'}</h1>
        <div>
          {this.props.userInfos.email || 'jd@undefined.com'}
        </div>
      </div>;
  }
}