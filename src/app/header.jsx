import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import AutoComplete from 'material-ui/lib/auto-complete';
import ProductService from './services/product-service';
import Menu from './menu';


const dialogStyle = {
  width: '100%',
  maxWidth: 'none'
};

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addingItem: false,
      menuOpen: false,
    };
  }

  addItem(selected) {
    ProductService.addProduct(selected)
      .then(p => this.props.onProductSelected(p));
    this.closeDialog();
  }

  openDialogAdd() {
    this.setState({ addingItem: true });
  }

  closeDialog() {
    this.setState({ addingItem: false });
  }
  
  handleRequest(selected) {
    this.addItem(selected);
  }
  
  handleDialogOk() {
    this.addItem(this._autoComplete.state.searchText);
  }
  
  handleMenu(open) {
    this.setState({ menuOpen: open });
  }

  render() {

    const buttonAdd = <IconButton touch={true}
      onTouchTap={this.openDialogAdd.bind(this) }
      iconClassName="material-icons">add
    </IconButton>;

    const actions = [
      <FlatButton
        label="Annuler"
        secondary={true}
        onTouchTap={this.closeDialog.bind(this) }
        />,
      <FlatButton
        label="Ajouter"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleDialogOk.bind(this) }
        />,
    ];

    return <div> 
      <AppBar title="Les courses"
        iconElementRight={ buttonAdd }
        onLeftIconButtonTouchTap={this.handleMenu.bind(this, true)}
        />
      <Menu open={this.state.menuOpen}
            onRequestChange={this.handleMenu.bind(this)} 
            />
      <Dialog
        title="Ajouter un truc à la liste"
        actions={actions}
        modal={false}
        open={this.state.addingItem}
        onRequestClose={this.closeDialog.bind(this) }
        contentStyle={dialogStyle}
        >
        <AutoComplete
          onNewRequest={this.handleRequest.bind(this)}
          maxSearchResults={5}
          hintText="De quoi avez-vous besoin ?"
          dataSource={this.props.products }
          filter={AutoComplete.fuzzyFilter}
          ref={(c) => {
            this._autoComplete = c;
            if (c) c.focus();
          } }
          />
      </Dialog>
    </div >;
  }
}