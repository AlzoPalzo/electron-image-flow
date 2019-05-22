import React, { Component } from "react";

class FileBrowser extends Component {
  getChildren = () => {
    return this.props.virtualFolders.filter(
      folder => folder.folderLocation === this.props.selectedFolder.folderId
    );
  };

  renderFolders = () => {
    const { selectedFolder } = this.props;
    if (selectedFolder.folderId === 0) {
      const childFolders = this.getChildren().filter(
        folder => folder.name !== "main"
      );
      return (
        <div>
          <div
            className="folderContainer selectedFolder"
            onClick={this.props.changeSelectedFolder}
            id={"-folder0"}
          >
            <img
              id="image-folder0"
              className="folderIcon"
              alt="folder icon"
              src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/Folder_icon.png"
            />
            <p id="text-folder0" className="folderText">
              Main
            </p>
          </div>
          {childFolders.length > 0 ? (
            <div className="childFolders">
              {childFolders.map(folder => (
                <div
                  onClick={this.props.changeSelectedFolder}
                  key={"folder" + folder.folderId}
                  id={"-folder" + folder.folderId}
                  className="childFolderContainer"
                >
                  <img
                    id={"image-folder" + folder.folderId}
                    className="folderIcon"
                    alt="folder icon"
                    src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/Folder_icon.png"
                  />
                  <p
                    id={"text-folder" + folder.folderId}
                    className="folderText"
                  >
                    {folder.name}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
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
