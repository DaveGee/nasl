import React from 'react';
import LeftNav from 'material-ui/lib/left-nav';

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
        
      </LeftNav>;
  }
}