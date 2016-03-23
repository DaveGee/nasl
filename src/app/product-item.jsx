
import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import BoughtIcon from 'material-ui/lib/svg-icons/action/done';
import NeededIcon from 'material-ui/lib/svg-icons/alert/error-outline';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Unknown from 'material-ui/lib/svg-icons/action/help';
import Avatar from 'material-ui/lib/avatar';

const BOUGHT = 'boughtSome', NEEDED = 'needed';

export default class ProductItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
      action: []
    };
  }
  
  justBoughtSome() {
    return this.state.action.some(a => a === BOUGHT);
  }
  
  needed() {
    return this.state.action.some(a => a === NEEDED);
  }

  handleChange(event, value) {
    if(value.length === 2 && this.justBoughtSome())
      this.setState({ action: [NEEDED]});
    else if(value.length === 2)
      this.setState({ action : [BOUGHT]});
    else   
      this.setState({ action: value });
  }
  
  switchState(event) {
    if(this.justBoughtSome())
      this.setState({ action: [] });
    else if(this.needed())
      this.setState({ action: [BOUGHT] });
    else
      this.setState({ action: [NEEDED] });
  }

  render() {
    let lastBuyDate = this.state.product.lastBuy ? 'Dernier achat: ' + this.state.product.lastBuy.format('Do MMM.') : 'Jamais acheté';

    let icon = <MoreVertIcon />;
    if (this.state.action.some(a => a === NEEDED))
      icon = <NeededIcon />;
    else if (this.state.action.some(a => a === BOUGHT))
      icon = <BoughtIcon />;

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
        <MenuItem value="boughtSome" primaryText="J'en ai acheté c'est bon" leftIcon={<BoughtIcon />} />
        <MenuItem value="needed" primaryText="Il en faut absolument" leftIcon={<NeededIcon />} />
      </IconMenu>
    );

    return <ListItem key={this.state.product.id}
                     leftAvatar={<Avatar icon={<Unknown />} />}
                     rightIconButton={rightIconMenu}
                     primaryText={this.state.product.name}
                     secondaryText={lastBuyDate}
                     onTouchTap={this.switchState.bind(this)} />;
  }
}