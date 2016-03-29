import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import AutoComplete from 'material-ui/lib/auto-complete';
import { addProduct } from './services/product-service';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addingItem: false
    };
  }

  addItem() {
    addProduct(this._autoComplete.state.searchText);
    this.closeDialog();
  }

  openDialogAdd() {
    this.setState({ addingItem: true });
  }

  closeDialog() {
    this.setState({ addingItem: false });
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
        onTouchTap={this.addItem.bind(this) }
        />,
    ];

    return <div> 
      <AppBar title= "Les courses"
        iconElementRight= { buttonAdd }
        />
      <Dialog
        title="Ajouter un truc à la liste"
        actions={actions}
        modal={false}
        open={this.state.addingItem}
        onRequestClose={this.closeDialog.bind(this) }
        >
        <AutoComplete
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