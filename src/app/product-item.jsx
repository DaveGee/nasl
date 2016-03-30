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
import {setItemState} from './services/product-service';

const boughtIcon = <FontIcon className="material-icons" color={teal600}>check_circle</FontIcon>;
const neededIcon = <FontIcon className="material-icons" color={red600}>report_problem</FontIcon>;
const vertIcon = <FontIcon className="material-icons" color={grey400}>more_vert</FontIcon>;

export default class ProductItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
      action: []
    };
  }
  
  justBoughtSome() {
    return this.state.action.some(a => a === Enums.ItemState.Bought);
  }
  
  needed() {
    return this.state.action.some(a => a === Enums.ItemState.Needed);
  }

  handleChange(event, value) {
    if(value.length === 2 && this.justBoughtSome())
      this.setState({ action: [Enums.ItemState.Needed]});
    else if(value.length === 2)
      this.setState({ action : [Enums.ItemState.Bought]});
    else   
      this.setState({ action: value });
  }
  
  switchState(event) {
    
    setItemState(this.state.product.objectId, Enums.ItemState.Needed);
    
    // if(this.justBoughtSome())
    //   this.setState({ action: [] });
    // else if(this.needed())
    //   this.setState({ action: [Enums.ItemState.Bought] });
    // else
    //   this.setState({ action: [Enums.ItemState.Needed] });
  }

  render() {
    let lastBuyDate = this.state.product.lastBuyTime ? 'Dernier achat: ' + moment(this.state.product.lastBuyTime).format('Do MMM.') : 'Jamais acheté';

    let icon = vertIcon;
    if (this.state.action.some(a => a === Enums.ItemState.Needed))
      icon = neededIcon;
    else if (this.state.action.some(a => a === Enums.ItemState.Bought))
      icon = boughtIcon;

    let iconButtonElement = (
      <IconButton touch={true}>
        {icon}
      </IconButton>
    );

    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}
          onChange={this.handleChange.bind(this) }
          value={this.state.action}
          multiple={true}>
        <MenuItem value="boughtSome" primaryText="J'en ai acheté c'est bon" leftIcon={boughtIcon} />
        <MenuItem value="needed" primaryText="Il en faut absolument" leftIcon={neededIcon} />
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