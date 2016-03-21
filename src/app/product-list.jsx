import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import AddShopping from 'material-ui/lib/svg-icons/action/add-shopping-cart';
import Unknown from 'material-ui/lib/svg-icons/action/help';
import Avatar from 'material-ui/lib/avatar';
import Divider from 'material-ui/lib/divider';
import Subheader from 'material-ui/lib/Subheader';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productsToBuy: props.products.filter(p => p.next),
      allOthers: props.products.filter(p => !p.next)
    };
  }
  
  componentWillMount() { }
  
  render() {
    var toItem = function(product) {
      
      return <ListItem key={product.id}
                leftAvatar={<Avatar icon={<Unknown />} />}
                rightIcon={<AddShopping />}
                primaryText={product.name}
                secondaryText={product.lastBuy ? product.lastBuy.toString() : '-'} />;
    };
    
    return <div>
        <List>
          <Subheader>Bientôt à court!</Subheader>
          {this.state.productsToBuy.map(toItem)}
        </List>
        <Divider />
        <List>
          {this.state.allOthers.map(toItem)}
        </List>
      </div>;
  }
}