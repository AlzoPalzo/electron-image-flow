import React, { Component } from "react";

import FileBrowser from "./FileBrowser";

class Sidebar extends Component {
  state = {
    newFolderPopup: false,
    newFolderName: ""
  };

  mapImages = () => {
    if (this.props.images.length > 0) {
      if (
        !this.props.images
          .map(image => image.image)
          .includes(this.props.selectedImage.image)
      ) {
        this.props.changeSelectedImage(this.props.images[0]);
      }
      this.checkHighlighted();
      return this.props.images.map(image => (
        <div
          id={image.image + "-_-_div"}
          key={image.image}
          onClick={this.handleClick}
          className={this.getImageClass(image)}
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
    }
  };

  checkHighlighted = () => {
    if (this.props.highlightedImages.length > 0) {
      const imageNames = this.props.images.map(image => image.image);
      const highNames = this.props.highlightedImages.map(image => image.image);

      for (let i = 0; i < highNames.length; i++) {
        if (!imageNames.includes(highNames[i])) {
          this.props.resetHighlighted();
          break;
        }
      }
    }
  };

  getImageClass = image => {
    if (this.props.selectedImage.image === image.image) {
      return "tileContainer selected";
    } else if (
      this.props.highlightedImages.length > 0 &&
      this.props.highlightedImages
        .map(image => image.image)
        .includes(image.image)
    ) {
      return "tileContainer highlighted";
    } else {
      return "tileContainer";
    }
  };

  handleClick = e => {
    const targetImage = e.target.id.split("-_-_")[0];
    const newImage = this.props.images.find(
      image => image.image === targetImage
    );
    if (e.ctrlKey || e.metaKey) {
      this.props.highlightImage(newImage);
    } else {
      this.props.changeSelectedImage(newImage);
      this.props.resetHighlighted();
    }
  };

  showPopup = () => {
    this.setState({
      newFolderPopup: !this.state.newFolderPopup
    });
  };

  updateFolderName = e => {
    this.setState({
      newFolderName: e.target.value
    });
  };

  addFolder = e => {
    e.preventDefault();
    if (this.state.newFolderName !== "") {
      this.props.addFolder(this.state.newFolderName);
      this.setState({
        newFolderPopup: false,
        newFolderName: ""
      });
    } else {
      alert("Must have a name");
    }
  };

  render() {
    return (
      <div className="sidebar">
        <h4 id="scrollBarTitle">Image Viewer</h4>
        <FileBrowser
          changeSelectedFolder={this.props.changeSelectedFolder}
          selectedFolder={this.props.selectedFolder}
          virtualFolders={this.props.virtualFolders}
        />
        <input
          id="tagSearch"
          type="search"
          placeholder="Search by content"
          onChange={this.props.updateSearchTerm}
          value={this.props.searchTerm}
        />

        {this.state.newFolderPopup ? (
          <div>
            <button onClick={this.showPopup}>Create Folder</button>
            <form id="newFolderPopup">
              <input
                autoFocus
                required
                name="name"
                type="text"
                label="name"
                placeholder="Folder Name"
                id="folderNameInput"
                value={this.props.searchTerm}
                onChange={this.updateFolderName}
              />
              <input
                className="submit"
                onClick={this.addFolder}
                type="submit"
              />
            </form>
          </div>
        ) : (
          <button onClick={this.showPopup}>Create Folder</button>
        )}
        <div id="imageRailBorder">
          <div id="imageRail">{this.mapImages()}</div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
