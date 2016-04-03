import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Unknown from 'material-ui/lib/svg-icons/action/help';
import Avatar from 'material-ui/lib/avatar';
import {grey400, red600, teal600} from 'material-ui/lib/styles/colors';
import moment from 'moment';
import Enums from './helpers/enums';
import ProductService from './services/product-service';
import Divider from 'material-ui/lib/divider';

const boughtIcon = <FontIcon className="material-icons" color={teal600}>check_circle</FontIcon>;
const neededIcon = <FontIcon className="material-icons" color={red600}>report_problem</FontIcon>;
const vertIcon = <FontIcon className="material-icons" color={grey400}>more_vert</FontIcon>;

export default class ProductItem extends React.Component {

  constructor(props) {
    super(props);
    // set right icon menu initial state
    let initialMenuState = null;
    if (props.item.needed)
      initialMenuState = Enums.ItemState.Needed;
    else if (ProductService.boughtRecently(props.item))
      initialMenuState = Enums.ItemState.Bought;
    
    this.state = {      
      needed: props.item.needed,
      lastBuyTime: props.item.lastBuyTime,
      
      menuValue: initialMenuState
    };
  }
  
  switchState() {
    
    // nothing --> needed --> bought(-needed) --> needed(+bought) --> bought ...
    
    if(!this.state.needed)
      this.setNeeded();
    else {
      this.setBought();
    }
  }
  
  setBought() {
    if(!ProductService.boughtRecently(this.state.lastBuyTime)) {
      let now = new Date().toISOString();
      
      this.setState({ lastBuyTime: now });
    
      return ProductService.setItemBoughtNotNeeded(this.props.item, now)
        .then(() => this.props.onItemStateChanged());
    }
    
    return Promise.reject();
  }
  
  setNeeded() {
    this.setState({ needed: true });
    
    return ProductService.setItemNeeded(this.props.item)
      .then(() => this.props.onItemStateChanged());
  }
  
  cancelActions() {
    
    this.setState({
      needed: false,
      lastBuyTime: null   // ahem...
    });
    
    return ProductService.cancelLastActions(this.props.item)
      .then(previousBuyTime => this.setState({ lastBuyTime: previousBuyTime }))
      .then(() => this.props.onItemStateChanged());
  }
  
  menuChanged(event, value) {
    
    if(value === Enums.ItemState.None) {
      this.cancelActions()
        .then(x => this.setState({ menuValue: null }));
      return;
    }
    
    if(value === Enums.ItemState.Needed)
      this.setNeeded()
        .then(x => this.setState({ menuValue: value }));
      
    if(value === Enums.ItemState.Bought)
      this.setBought()
        .then(x => this.setState({ menuValue: value }));
  }

  render() {
    let lastBuyDate = 'Jamais acheté';
    if (this.state.lastBuyTime) {
      if(ProductService.boughtRecently(this.state.lastBuyTime))
        lastBuyDate = 'Acheté: ' + moment(this.state.lastBuyTime).fromNow();
      else
        lastBuyDate = 'Acheté: ' + moment(this.state.lastBuyTime).format('Do MMM.'); 
    }

    let icon = vertIcon;
    if (this.state.needed)
      icon = neededIcon;
    else if (ProductService.boughtRecently(this.state.lastBuyTime))
      icon = boughtIcon;

    let iconButtonElement = (
      <IconButton touch={true}>
        {icon}
      </IconButton>
    );

    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}
          onChange={this.menuChanged.bind(this)}
          value={this.state.menuValue}
          multiple={false}>
        <MenuItem value={Enums.ItemState.Bought} primaryText="J'en ai acheté" leftIcon={boughtIcon} />
        <MenuItem value={Enums.ItemState.Needed} primaryText="Il en faut absolument" leftIcon={neededIcon} />
        <Divider />
        <MenuItem value={Enums.ItemState.None} primaryText="Annuler les dernières actions" />
      </IconMenu>
    );

    return <ListItem key={this.props.item.product.id}
                     leftAvatar={<Avatar src={this.props.item.product.image} />}
                     rightIconButton={rightIconMenu}
                     primaryText={this.props.item.product.name}
                     secondaryText={lastBuyDate}
                     onTouchTap={this.switchState.bind(this)} />;
  }
}