import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Unknown from 'material-ui/lib/svg-icons/action/help';
import Avatar from 'material-ui/lib/avatar';
import * as color from 'material-ui/lib/styles/colors';
import moment from 'moment';
import Enums from '../../helpers/enums';
import ProductService from '../../services/product-service';
import CircularProgress from 'material-ui/lib/circular-progress';
import Divider from 'material-ui/lib/divider';
import {getStockIndicator} from '../../business/stock-manager';
import ItemStockIndicator from './item-stock-indicator';

// teal600
const boughtIcon = <FontIcon className="material-icons" color={color.grey400}>check_circle</FontIcon>;
// amber300
const neededIcon = <FontIcon className="material-icons" color={color.amber400}>report_problem</FontIcon>;
const vertIcon = <FontIcon className="material-icons" color={color.grey400}>more_vert</FontIcon>;

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
      loading: false,
        
      needed: props.item.needed,
      lastBuyTime: props.item.lastBuyTime,
      
      menuValue: initialMenuState,
      
      stockIndicator: getStockIndicator(props.item)
    };
  }
  
  switchState() {    
    if(!this.state.needed)
      this.setNeeded();
    else {
      this.setBought();
    }
  }
  
  setBought() {
    let now = ProductService.boughtRecently(this.state.lastBuyTime) ?
      this.state.lastBuyTime :
      new Date().toISOString();
    
    this.setState({ lastBuyTime: now, needed: false, loading: true });
  
    return ProductService.setItemBoughtNotNeeded(this.props.item, now)
      .then(() => this.props.onItemStateChanged())
      .then(() => this.setState({ loading: false }));
  }
  
  setNeeded() {
    this.setState({ needed: true, loading: true });
    
    return ProductService.setItemNeeded(this.props.item)
      .then(() => this.props.onItemStateChanged())
      .then(() => this.setState({ loading: false }));
  }
  
  cancelActions() {
    
    this.setState({
      loading: true,
      needed: false
      //lastBuyTime: null   // ahem...
    });
    
    return ProductService.cancelLastActions(this.props.item)
      .then(previousBuyTime => this.setState({ lastBuyTime: previousBuyTime }))
      .then(() => this.props.onItemStateChanged())
      .then(() => this.setState({ loading: false }));
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
    // sublabel for last buy time
    let lastBuyDate = 'Jamais acheté';
    if (this.state.lastBuyTime) {
      if(ProductService.boughtRecently(this.state.lastBuyTime))
        lastBuyDate = 'Acheté: ' + moment(this.state.lastBuyTime).fromNow();
      else
        lastBuyDate = 'Acheté: ' + moment(this.state.lastBuyTime).format('Do MMM.'); 
    }

    // icon on the right (that opens the menu)
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
    
    // cancel action
    let cancelAction = this.state.needed || ProductService.boughtRecently(this.state.lastBuyTime);
    
    // menu on the right
    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}
          onChange={this.menuChanged.bind(this)}
          value={this.state.menuValue}
          multiple={false}>
        <MenuItem value={Enums.ItemState.Needed} primaryText="Il en faut absolument" leftIcon={neededIcon} />
        <MenuItem value={Enums.ItemState.Bought} primaryText="J'en ai acheté" leftIcon={boughtIcon} />
        <Divider />
        {cancelAction ? <MenuItem value={Enums.ItemState.None} primaryText="Annuler les dernières actions" /> : null}
        <MenuItem primaryText="Fermer" />
      </IconMenu>
    );
    
    let glow = this.state.stockIndicator !== null && this.state.stockIndicator < 0.05 ? 
                { animation: 'glow 3s ease-in-out infinite' } : {};

    return <ListItem key={this.props.item.product.id}
                     leftAvatar={this.state.loading ? <CircularProgress size={0.6}/> : 
                                                      <Avatar style={glow} src={this.props.item.product.image} />}
                     rightIconButton={rightIconMenu}
                     primaryText={<div className="item-title">
                                    {this.props.item.product.name}
                                    <ItemStockIndicator reserve={this.state.stockIndicator} />
                                  </div>}
                     secondaryText={lastBuyDate}
                     onTouchTap={this.switchState.bind(this)}
                     style={{ color: this.state.needed ? color.grey900 : color.grey600 }}
                     className="stock-item" />;
  }
}