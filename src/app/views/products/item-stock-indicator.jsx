import React from 'react';
import * as color from 'material-ui/styles/colors';

const gradient = [
  color.deepOrange900,
  color.deepOrange800,
  color.deepOrange700,
  color.deepOrange600,
  color.deepOrange500,
  color.deepOrange400,
  color.deepOrange300,
  color.deepOrange200,
  color.deepOrange100,
  color.deepOrange50,
  color.teal50,
  color.teal100,
  color.teal200,
  color.teal300,
  color.teal400,
  color.teal500,
  color.teal600,
  color.teal700,
  color.teal800,
  color.teal900
];

export default class ItemStockIndicator extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      reserve: props.reserve    // 0=no more, 1 = a lot
    };
  }
  
  getColor() {
    //0..1 => 0..gradient.length
    if (this.state.reserve === null) return 'transparent';
    return gradient[Math.floor(this.state.reserve * (gradient.length-1))];
  }
  
  render() {
    const defaultStyle = {
      height: '3px',
      backgroundColor: this.getColor(),
      width: `${5 + this.state.reserve * 95}%`
    };
    
    return <div style={defaultStyle}>
      </div>
  }
};