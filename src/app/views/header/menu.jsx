import React from 'react';
import LeftNav from 'material-ui/Drawer';
import User from './user';
import CurrentList from './current-list';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
    };
  }
  
  render() {
    return <LeftNav {...this.props}
          docked={false}
          width={350}
        >
        <div className='left-nav'>
          <User userInfos={this.props.userInfos} />
          <CurrentList {...this.props}  
            errorMessage={null} />
        </div>
      </LeftNav>;
  }
}