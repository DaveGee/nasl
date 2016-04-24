import React from 'react';
import Avatar from 'material-ui/Avatar';
import {Card, CardHeader} from 'material-ui/Card';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    var avatar = (this.props.userInfos.name || 'x')[0];
    
    return <Card className='user-profile'>
        <CardHeader
          title={this.props.userInfos.name || 'John Doe'}
          subtitle={this.props.userInfos.email || 'jd@undefined.com'}
          avatar="http://lorempixel.com/100/100/people/"
        />
      </Card>;
  }
}