import React, { Component } from 'react';


class EditingBar extends Component {
  handleZoomClick = n => {
    let newZoom = this.props.zoom;

    n === 0 ? (newZoom = 0) : n === 1 ? (newZoom += 1) : (newZoom -= 1);

    if (newZoom < -6) {
      newZoom = -6;
    } else if (newZoom > 6) {
      newZoom = 6;
    }

    this.props.changeZoom(newZoom);
  };
  render() {
    const { zoom } = this.props;
    return (
      <div className="editingBar">
        {zoom !== 6 ? (
          <button
            onClick={() => this.handleZoomClick(1)}
            className="editingButton"
          >
            +
          </button>
        ) : (
          <button className="editingButtonShaded">+</button>
        )}
        {zoom ? (
        <button
          onClick={() => this.handleZoomClick(0)}
          className="editingButton"
        >
          0
        </button>
        ) : (<button className="editingButtonShaded">0</button>)}
        {zoom !== -6 ? (
          <button
            onClick={() => this.handleZoomClick(-1)}
            className="editingButton"
          >
            -
          </button>
        ) : (
          <button className="editingButtonShaded">-</button>
        )}
      </div>
    );
  }
}

export default EditingBar;
