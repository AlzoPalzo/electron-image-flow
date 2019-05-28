import React, { Component } from "react";

class FileBrowser extends Component {
  getChildren = target => {
    let children = this.props.virtualFolders.filter(
      folder =>
        folder.folderLocation === target.folderId && folder.folderId !== 0
    );
    return children.sort((a, b) => {
      var aName = a.name.toLowerCase();
      var bName = b.name.toLowerCase();
      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }
      return 0;
    });
  };

  handleFolderClick = e => {
    const folderId = parseInt(e.target.id.split("folder")[1]);
    this.props.changeSelectedFolder(folderId);
    this.props.openFolder(folderId);
  };
  handleClick = e => {
    const folderId = parseInt(e.target.id.split("folder")[1]);
    this.props.changeSelectedFolder(folderId);
  };

  handleMoveImages = (e) =>
  {
    this.props.moveImages(e)
  }

  getNumImages = folder => {
    if (this.props.images.length > 0) {
      const images = this.props.images.filter(
        image => image.folderLocation === folder.folderId
      );
      return images.length;
    }
  };

  renderFolder = folder => {
    const leftPad = 0.5 * folder.depth;
    const dynamicStyling = { paddingLeft: leftPad + "rem" };
    return (
      <div key={folder.folderId}>
        <div
          className={
            this.props.selectedFolder.folderId === folder.folderId
              ? "folderContainer selectedFolder"
              : "folderContainer"
          }
          id={"image-folder" + folder.folderId}
          onClick={this.props.moveImagesVal ? this.handleMoveImages : this.handleClick}
          key={folder.folderId}
        >
          <p id={"count-folder" + folder.folderId} className="imageCount">
            {"(" + this.getNumImages(folder) + ")"}
          </p>
          <img
            style={dynamicStyling}
            onClick={this.props.moveImagesVal ? this.handleMoveImages : this.handleFolderClick}
            src={
              folder.open
                ? "file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/Folder_icon_open.png"
                : "file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/Folder_icon.png"
            }
            alt="folder icon"
            id={"image-folder" + folder.folderId}
            className="folderIcon"
          />
          <p id={"text-folder" + folder.folderId} className="folderText">
            {folder.name}
          </p>
        </div>
      </div>
    );
  };

  renderChildren = children => {
    let structuredFolders = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const renderedChild = this.renderFolder(child);
      const grandChildren = this.getChildren(child);

      structuredFolders.push(renderedChild);

      if (child.open && grandChildren.length > 0) {
        structuredFolders = [
          ...structuredFolders,
          ...this.renderChildren(grandChildren)
        ];
      }
    }
    return structuredFolders;
  };

  renderFolders = () => {
    const { virtualFolders } = this.props;

    const main = virtualFolders.find(folder => folder.folderId === 0);
    const children = this.getChildren(main);

    if (main.open && children.length > 0) {
      return [this.renderFolder(main), ...this.renderChildren(children)];
    } else {
      return this.renderFolder(main);
    }
  };

  render() {
    return (
      <div id="fileBrowser">
        <div id="fileBrowserRail">{this.renderFolders()}</div>
      </div>
    );
  }
}

export default FileBrowser;
