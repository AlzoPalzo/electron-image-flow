import React, { Component } from 'react';

class FileBrowser extends Component {
    renderFolders = () =>
    {
        const {selectedFolder, virtualFolders} = this.props
        if (selectedFolder.folderId === 0)
        {
            return <div className='folderContainer'><img className="folderIcon" alt="folder icon" src="file:////Users/flatironschool/ali_flatiron/electron-image-flow/public/Folder_icon.png"/> <p className="folderText">Main</p></div>
        }
    }

    render() {
        return (
            <div id="fileBrowser">
                <div id='fileBrowserRail'>
                    {this.renderFolders()}
                </div>
            </div>
        );
    }
}

export default FileBrowser;
