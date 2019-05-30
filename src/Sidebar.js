import React, { Component } from "react";

import FileBrowser from "./FileBrowser";

class Sidebar extends Component {
  state = {
    showPopup: false,
    newFolderName: "",
    popupType: "",
    moveImages: false
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

  showPopup = e => {
    const type = e.target.id;
    if (e.target.id === this.state.popupType) {
      this.setState({
        showPopup: !this.state.showPopup
      });
    } else if (this.state.showPopup === true) {
      this.setState({
        popupType: type
      });
    } else {
      this.setState({
        showPopup: !this.state.showPopup,
        popupType: type
      });
    }
    if (this.state.moveImages) {
      this.setState({
        moveImages: false
      });
    }
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
        showPopup: false,
        newFolderName: ""
      });
    } else {
      alert("Must have a name");
    }
  };

  removeFolder = () => {
    this.props.removeFolder();
    this.setState({
      showPopup: false
    });
  };

  deleteImages = () => {
    this.props.deleteImages();
    {
      this.setState({
        showPopup: false
      });
    }
  };

  moveImagesTrue = () => {
    this.setState({
      moveImages: true
    });
  };

  moveImagesFalse = () => {
    this.setState({
      moveImages: false
    });
  };

  moveImages = (e) => 
  {
    this.moveImagesFalse()
    this.setState({
      showPopup: false
    })
    this.props.moveSelectedImages(e)
  }

  renderPopup = () => {
    const { popupType } = this.state;
    if (popupType === "createFolder") {
      return (
        <div className="popupDiv">
          <form id="showPopup">
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
            <br/>
            <input  style={{marginTop: "0.3rem", WebkitUserSelect: "none"}} className="export" onClick={this.addFolder} type="submit" />
          </form>
        </div>
      );
    } else if (popupType === "deleteFolder") {
      return (
        <div className="popupDiv">
          <p className="buttonInfo">
            Delete this folder?(Images will be returned to the parent
            folder)
          </p>
          <button className="export" onClick={this.removeFolder}>
            Delete
          </button>
          <button className="export" onClick={this.showPopup}>
            Cancel
          </button>
        </div>
      );
    } else if (popupType === "deleteImage") {
      return (
        <div className="popupDiv">
          <p className="buttonInfo">Remove selected images?</p>
          <button className="export" onClick={this.deleteImages}>
            Remove
          </button>
          <button className="export" onClick={this.showPopup}>
            Cancel
          </button>
        </div>
      );
    } else if(popupType === "moveImage"){
      return (
        <div className="popupDiv">
          <p className="buttonInfo">Click move and then on a folder to move selected images</p>
          {!this.state.moveImages ? (
            <button className="export" onClick={this.moveImagesTrue}>
              Move
            </button>
          ) : (
            <button
              className="highlightExport"
              onClick={this.moveImagesFalse}
            >
              Cancel Move
            </button>
          )}
        </div>
      );
    }
  };

  selectAll = () =>
  {
    const nonSelectedImages = this.props.images.filter(image => image.image !== this.props.selectedImage.image)
    if (nonSelectedImages.length > 0) {
      this.props.highlightAllImages(nonSelectedImages);
    };
  }

  render() {
    return (
      <div className="sidebar">
        <h4 id="scrollBarTitle">Image Viewer</h4>
        <button
          style={{ marginBottom: "0.2rem" }}
          className="export"
          onClick={this.props.export}
        >
          Export
        </button>
        <FileBrowser
          moveSelectedImages={this.props.moveSelectedImages}
          changeSelectedFolder={this.props.changeSelectedFolder}
          selectedFolder={this.props.selectedFolder}
          virtualFolders={this.props.virtualFolders}
          openFolder={this.props.openFolder}
          images={this.props.unfiltered}
          moveImages={this.moveImages}
          moveImagesVal={this.state.moveImages}
        />
        <div className="sideBarButtons">
          <button className="sidebarButton" onClick={this.showPopup}>
            <img
              id="createFolder"
              className="sidebarButtonImage"
              src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/sidebarButtons/create_images_folder.jpg"
            />
          </button>
          {this.props.selectedFolder.folderId !== 0 ? (
            <button className="sidebarButton" onClick={this.showPopup}>
              <img
                id="deleteFolder"
                className="sidebarButtonImage"
                src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/sidebarButtons/delete_folder.jpg"
              />
            </button>
          ) : (
            <button className="sidebarButton">
              <img
                id="deleteFolder"
                className="sidebarButtonImageFalse"
                src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/sidebarButtons/delete_folder.jpg"
              />
            </button>
          )}
          <button className="sidebarButton" onClick={this.showPopup}>
            <img
              id="deleteImage"
              className="sidebarButtonImage"
              src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/sidebarButtons/delete_Image.jpg"
            />
          </button>
          <button className="sidebarButton" onClick={this.showPopup}>
            <img
              id="moveImage"
              className="sidebarButtonImage"
              src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/sidebarButtons/move_image.jpg"
            />
          </button>
        </div>

        {this.state.showPopup ? this.renderPopup() : null}

        <input
          id="tagSearch"
          type="search"
          placeholder="Search by content"
          onChange={this.props.updateSearchTerm}
          value={this.props.searchTerm}
        
        />
        <div>
          <button
            style={{ marginBottom: "0.2rem" }}
            className="export"
            onClick={this.selectAll}
          >
            Select all
          </button>
        </div>
        <div id="imageRailBorder">
          <div id="imageRail">{this.mapImages()}</div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
