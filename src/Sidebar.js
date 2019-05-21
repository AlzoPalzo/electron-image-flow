import React, { Component } from "react";

class Sidebar extends Component {
  mapImages = () => {
    return this.props.images.map(image => (
      <div
        id={image.image + "-_-_div"}
        key={image.image}
        onClick={this.handleClick}
        className={
          this.props.selectedImage.image === image.image
            ? "titleContainer selected"
            : "tileContainer"
        }
      >
        <img
          src={image.image}
          id={image.image + "-_-_img}"}
          key={image.image}
          alt={image.tags[0]}
          className="tileImage"
        />
      </div>
    ));
  };

  handleClick = e => {
    const targetImage = e.target.id.split("-_-_")[0];
    const newImage = this.props.images.find(
      image => image.image === targetImage
    );
    this.props.changeSelectedImage(newImage);
  };

  render() {
    return (
      <div className="sidebar">
        <h4 id="scrollBarTitle">Image Viewer</h4>
        <input id="tagSearch" type="search" placeholder="Search by content" />
        <div id="imageRail">{this.mapImages()}</div>
      </div>
    );
  }
}

export default Sidebar;
