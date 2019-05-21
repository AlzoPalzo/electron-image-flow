import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
          <div id="header">
            <input
              type="file"
              webkitdirectory="true"
              onChange={this.props.onDirChange}
            />
          </div>
        );
    }
}

export default Header;
