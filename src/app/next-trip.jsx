import React from 'react';

export default class NextTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: props.products
    };
  }
  
  render() {
    return <div className="next-trip">
        Next trip.
      </div>
  }
}