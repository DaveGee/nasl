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
import {setItemNeeded, setItemBoughtNotNeeded, boughtRecently} from './services/product-service';
import Divider from 'material-ui/lib/divider';

const boughtIcon = <FontIcon className="material-icons" color={teal600}>check_circle</FontIcon>;
const neededIcon = <FontIcon className="material-icons" color={red600}>report_problem</FontIcon>;
const vertIcon = <FontIcon className="material-icons" color={grey400}>more_vert</FontIcon>;

export default class ProductItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
      itemState: props.shopStatus || { productId: props.product.objectId }
    };
  }
  
  switchState(event) {
    
    // nothing --> needed --> bought(-needed) --> needed(+bought) --> bought ...
    
    if(!this.state.itemState.needed) {
      
      this.setState({ itemState: Object.assign({ needed: true }, this.state.itemState)});
      setItemNeeded(this.state.itemState)
        .then(state => this.setState({ itemState: state }));
        
    } else {
      
      this.setState({ itemState: { lastBuyTime: new Date().toISOString() }});
      setItemBoughtNotNeeded(this.state.itemState)
        .then(state => this.setState({ itemState: state }));
    }
  }

  render() {
    let lastBuyDate = this.state.itemState.lastBuyTime ? 'Dernier achat: ' + moment(this.state.itemState.lastBuyTime).format('Do MMM.') : 'Jamais acheté';

    let icon = vertIcon;
    if (this.state.itemState.needed)
      icon = neededIcon;
    else if (boughtRecently(this.state.itemState.lastBuyTime))
      icon = boughtIcon;

    let iconButtonElement = (
      <IconButton touch={true}>
        {icon}
      </IconButton>
    );

    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem primaryText="J'en ai acheté" leftIcon={boughtIcon} />
        <MenuItem primaryText="Il en faut absolument" leftIcon={neededIcon} />
        <Divider />
        <MenuItem primaryText="Annuler les dernières actions" />
      </IconMenu>
    );

    return <ListItem key={this.state.product.id}
                     leftAvatar={<Avatar src={this.state.product.image} />}
                     rightIconButton={rightIconMenu}
                     primaryText={this.state.product.name}
                     secondaryText={lastBuyDate}
                     onTouchTap={this.switchState.bind(this)} />;
  }
}