import React, { Component } from "react";

class FileBrowser extends Component {
  getChildren = () => {
    return this.props.virtualFolders.filter(
      folder => folder.folderLocation === this.props.selectedFolder.folderId
    );
  };

  getParent = () => {
    return this.props.virtualFolders.find(
      folder => folder.folderId === this.props.selectedFolder.folderLocation
    );
  };

  getSiblings = () => {
    return this.props.virtualFolders.filter(
      folder =>
        folder.folderLocation === this.props.selectedFolder.folderLocation &&
        folder.folderId !== 0
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
    } else {
      const children = this.getChildren();
      const parent = this.getParent();
      const siblings = this.getSiblings();

      if (parent.folderId !== 0) {
        return (
          <div>
            <div mainHolder>
              <div
                className="folderContainer"
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
            </div>

            <div
              className="parentContainer"
              onClick={this.props.changeSelectedFolder}
              key={"folder" + parent.folderId}
              id={"-folder" + parent.folderId}
            >
              <img
                id={"image-folder" + parent.folderId}
                className="folderIcon"
                alt="folder icon"
                src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/Folder_icon.png"
              />
            </div>
            <div className="currentFolders">
              {siblings.map(folder => (
                <div
                  onClick={this.props.changeSelectedFolder}
                  key={"folder" + folder.folderId}
                  id={"-folder" + folder.folderId}
                  className={
                    folder.folderId === selectedFolder.folderId
                      ? "folderContainer selectedFolder"
                      : "folderContainer"
                  }
                />
              ))}
            </div>
            {children.length > 0 ? (
              <div className="childFolders">
                {children.map(folder => (
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

      return (
        <div>
          <div
            className="folderContainer "
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
          <div className="currentFolders">
            {siblings.map(folder => (
              <div
                onClick={this.props.changeSelectedFolder}
                key={"folder" + folder.folderId}
                id={"-folder" + folder.folderId}
                className={
                  folder.folderId === selectedFolder.folderId
                    ? "folderContainer selectedFolder"
                    : "folderContainer"
                }
              />
            ))}
          </div>
          {children.map(folder => (
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
