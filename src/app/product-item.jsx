
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

export default class ProductItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
      action: []
    };
  }

  handleChange(event, value) {
    if(value.length === 2 && this.state.action.some(a => a === 'boughtSome'))
      this.setState({ action: ['needed']});
    else if(value.length === 2)
      this.setState({ action : ['boughtSome']});
    else   
      this.setState({ action: value });
  }

  render() {
    let lastBuyDate = this.state.product.lastBuy ? 'Dernier achat: ' + this.state.product.lastBuy.format('Do MMM.') : 'Jamais acheté';

    let iconButtonElement = (
      <IconButton touch={true}>
        <MoreVertIcon />
      </IconButton>
    );

    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}
                onChange={this.handleChange.bind(this)}
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
                     secondaryText={lastBuyDate} />;
  }
}