import React, { Component } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import EditingBar from "./EditingBar";

class Workspace extends Component {
  state = {
    dir: "",
    files: [],
    images: [],
    virtualFolders: [
      { name: "main", folderId: 0, folderLocation: 0, open: true, depth: 0 }
    ],
    selectedFolder: {},
    selectedImage: null,
    highlightedImages: [],
    zoom: 0,
    searchTerm: "",
    folderUniqueId: 1
  };


  onDirChange = e => {
    if (e.target.files.length > 0) {
      const fs = require("fs");
      const dir = e.target.files[0].path;

      this.setState({
        dir: dir
      });

      fs.readdir(dir, (err, files) => {
        if (err) throw err;
        let newFiles = files.filter(file => !this.state.files.includes(file));
        this.setState(
          {
            files: newFiles,
            selectedFolder: this.state.virtualFolders[0]
          },
          () => {
            this.identifyImages();
          }
        );
      });
    }
  };

  identifyImages = () => {
    const { dir, files } = this.state;

    var path = require("path");
    let images = [];

    if (files.length > 0) {
      const filepaths = files.map(file => "file:///" + dir + "/" + file);
      images = filepaths.filter(
        filepath =>
          path.extname(filepath).toLowerCase() === ".jpg" || path.extname(filepath).toLowerCase() === ".jpeg"
      );
    }
    images.forEach(image => {
      this.tagImage(image);
    });
  };n

  tagImage = image => {
    const fs = require("fs");
    const imageUrl = image.split("file:///")[1];
    let contents = fs.readFileSync(imageUrl);
    if (contents.length > 4000000) {
      this.resize(image);
    } else this.fetchTags(image, contents);
  };

  resize = (image, dataUri = image) => {
    let img = new Image();
    img.onload = e => {
      let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

      const newWidth = img.width / 2;
      const newHeight = img.height / 2;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const newDataUri = canvas.toDataURL("image/jpeg", 1.0);

      const byteChars = atob(newDataUri.split(",")[1]);

      const charAry = new Array(byteChars.length);

      const byteArr = new Uint8Array(charAry);

      if (byteArr.length > 4000000) {
        this.resize(image, newDataUri);
      } else {
        for (let i = 0; i < byteArr.length; i++) {
          byteArr[i] = byteChars.charCodeAt(i);
        }
        this.fetchTags(image, byteArr);
      }
    };
    img.src = dataUri;
  };

  fetchTags = (image, imageData) => {
    const URL =
      "https://uksouth.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Tags&language=en";
    const key = "14bf7567e9eb4b11bb6050f4db8a7f8f";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": key
      },
      body: imageData
    };
    fetch(URL, options)
      .then(resp => resp.json())
      .then(tagsContainer => {
        let tags = [];
        if (tagsContainer.tags) {
          tags = tagsContainer.tags
            .filter(tag => tag.confidence > 0.75)
            .map(tag => tag.name);
        } else {
          tags = ["untaggable"];
        }
        const newImage = { image: image, tags: tags, folderLocation: 0 };
        this.state.selectedImage
          ? this.setState({
              images: [...this.state.images, newImage]
            })
          : this.setState({
              images: [...this.state.images, newImage],
              selectedImage: newImage
            });
      });
  };

  changeSelectedImage = image => {
    this.setState({
      selectedImage: image
    });
  };

  changeZoom = zoom => {
    this.setState({
      zoom: zoom
    });
  };

  updateSearchTerm = e => {
    this.setState({
      searchTerm: e.target.value
    });
  };

  filterImages = () => {
    let newImages = [];
    if (this.state.images) {
      newImages = this.state.images.filter(
        image =>
          image.tags.includes(this.state.searchTerm.toLowerCase()) &&
          image.folderLocation === this.state.selectedFolder.folderId
      );
    }
    console.log(this.state.selectedFolder);
    if (newImages.length > 0) {
      return newImages;
    } else {
      return this.state.images.filter(
        image => image.folderLocation === this.state.selectedFolder.folderId
      );
    }
  };

  highlightImage = image => {
    if (this.state.selectedImage.image !== image.image) {
      if (this.state.highlightedImages.includes(image)) {
        this.setState({
          highlightedImages: this.state.highlightedImages.filter(
            img => img !== image
          )
        });
      } else {
        this.setState({
          highlightedImages: [...this.state.highlightedImages, image]
        });
      }
    }
  };

  resetHighlighted = () => {
    this.setState({
      highlightedImages: []
    });
  };

  getDepth = () => {
    let parents = [this.state.selectedFolder];
    let aFolder = this.state.selectedFolder;
    let main = false;
    while (main === false) {
      if (aFolder.folderId === 0) {
        main = true;
        break
      }
      aFolder = this.state.virtualFolders.find(
        folder => folder.folderId === aFolder.folderLocation
      );
      if (aFolder) {
        parents = [...parents, aFolder];
      }
    }
    return parents.length;
  };

  addFolder = name => {
    const { highlightedImages, selectedImage, images } = this.state;
    let highNames = [];
    let filteredImages = [];
    if (highlightedImages.length > 0) {
      highNames = highlightedImages.map(image => image.image);
      filteredImages = images.filter(
        image =>
          highNames.includes(image.image) || image.image === selectedImage.image
      );
    } else {
      filteredImages = [selectedImage];
    }
    const depth = this.getDepth()
    const newFolder = {
      name: name,
      folderId: this.state.folderUniqueId,
      folderLocation: selectedImage.folderLocation,
      open: true,
      depth: depth,
    };
    const parent = this.state.virtualFolders.find(folder => folder.folderId === selectedImage.folderLocation)
    if(!parent.open){this.openFolder(parent.folderId)}
    filteredImages.forEach(
      image => (image.folderLocation = this.state.folderUniqueId)
    );

    this.setState({
      virtualFolders: [...this.state.virtualFolders, newFolder],
      selectedFolder: newFolder,
      folderUniqueId: this.state.folderUniqueId + 1
    });
  };

  changeSelectedFolder = id => {
    const newSelectedFolder = this.state.virtualFolders.find(
      folder => folder.folderId === id
    );

    this.setState(
      {
        selectedFolder: newSelectedFolder
      },
      () => {}
    );
  };

  openFolder = (id) =>
  {
    const targetFolder = this.state.virtualFolders.find(folder => folder.folderId === id)
    const filterFolders = this.state.virtualFolders.filter(folder => folder !== targetFolder)
    targetFolder.open = !targetFolder.open
    this.setState({
      virtualFolders: [...filterFolders, targetFolder]
    })
  }

  createFilePath = (file, folders = []) =>
  {
    let fileFolder = this.state.virtualFolders.find(folder => file.folderLocation === folder.folderId)
    folders.unshift(fileFolder.name)
    if (fileFolder.folderId === 0){
      const jointFolders = this.state.dir + '/' + folders.join("/");
      return jointFolders
    }
    else{
      return this.createFilePath(fileFolder, folders)
    }

  }

  export = () =>
  {
    const {images, dir} = this.state

    const fs = require('fs')

    for (let i = 0; i < images.length; i++) {
        const imageDir = images[i].image.split('///')[1]
        const splitImageDir = imageDir.split('/')
        const imageName = splitImageDir[splitImageDir.length - 1]
        const newImageFilePath = this.createFilePath(images[i])
        const finalLoc = newImageFilePath + '/' + imageName

        if(fs.existsSync(newImageFilePath))
        {
          fs.copyFileSync(imageDir, finalLoc)
        }
        else{
          fs.mkdirSync(newImageFilePath, {recursive: true})
          fs.copyFileSync(imageDir, finalLoc);
        }
    }  
  }

  render() {
    const {
      dir,
      images,
      virtualFolders,
      selectedImage,
      zoom,
      selectedFolder,
      highlightedImages
    } = this.state;
    return (
      <div>
        <Header onDirChange={this.onDirChange} />
        {dir !== "" && images.length > 0 ? (
          <div>
            <Sidebar
              searchTerm={this.props.searchTerm}
              updateSearchTerm={this.updateSearchTerm}
              images={this.filterImages()}
              dir={dir}
              virtualFolders={virtualFolders}
              changeSelectedImage={this.changeSelectedImage}
              selectedImage={selectedImage}
              selectedFolder={selectedFolder}
              changeSelectedFolder={this.changeSelectedFolder}
              highlightedImages={highlightedImages}
              highlightImage={this.highlightImage}
              resetHighlighted={this.resetHighlighted}
              addFolder={this.addFolder}
              openFolder={this.openFolder}
              unfiltered={this.state.images}
              export={this.export}
            />
            <img
              id="selectedImage"
              className={"selectedImage" + zoom}
              src={selectedImage.image}
              alt={selectedImage.tags[0]}
            />
            <EditingBar
              changeZoom={this.changeZoom}
              zoom={this.state.zoom}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Workspace;
