import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
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

  openDialogAdd() {
    this.setState({ addingItem: true });
  }

  closeDialog() {
    this.setState({ addingItem: false });
  }
  
  handleAddItem(selected) {
    this.props.onAddItem(selected || this._autoComplete.state.searchText);
    this.closeDialog();
  }
  
  handleMenu(open) {
    this.setState({ menuOpen: open });
    if(open)
      this._poll = setInterval(this.props.onRefreshUsers, 1000);
    else if(this._poll)
      clearInterval(this._poll);
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
        onTouchTap={this.handleAddItem.bind(this) }
        />,
    ];

    return <div> 
      <AppBar title="Les courses"
        iconElementRight={ buttonAdd }
        onLeftIconButtonTouchTap={this.handleMenu.bind(this, true)}
        />
      <Menu open={this.state.menuOpen}
            onRequestChange={this.handleMenu.bind(this)} 
            userInfos={this.props.userInfos}
            onJoinList={this.props.onJoinList}
            otherListUsers={this.props.otherListUsers}
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
          onNewRequest={this.handleAddItem.bind(this)}
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