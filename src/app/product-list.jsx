import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import AddShopping from 'material-ui/lib/svg-icons/action/add-shopping-cart';
import Unknown from 'material-ui/lib/svg-icons/action/help';
import Avatar from 'material-ui/lib/avatar';
import EmptyList from './empty-list';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: props.products
    };
  }
  
  componentWillMount() { }
  
  render() {
    var items = this.state.products.map(function(product) {
      
      return <ListItem
                leftAvatar={<Avatar icon={<Unknown />} />}
                rightIcon={<AddShopping />}
                primaryText={product}
                secondaryText="01/01/1970" />;
    });
    
    return this.state.products.length ? 
      <List>{items}</List> : <EmptyList />;
  }
}