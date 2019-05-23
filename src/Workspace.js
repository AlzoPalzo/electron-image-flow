import React, { Component } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import EditingBar from "./EditingBar";

class Workspace extends Component {
  state = {
    dir: "",
    files: [],
    images: [],
    virtualFolders: [{ name: "main", folderId: 0, folderLocation: 0 }],
    selectedFolder: { name: "main", folderId: 0, folderLocation: 0 },
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
            files: newFiles
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
          path.extname(filepath) === ".jpg" || path.extname === ".jpeg"
      );
    }
    images.forEach(image => {
      this.tagImage(image);
    });
  };

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
        console.log(tagsContainer);
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
              images: [
                ...this.state.images,
                newImage
              ]
            })
          : this.setState({
              images: [
                ...this.state.images,
                newImage
              ],
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
    console.log(this.state.selectedFolder)
    console.log(newImages)
    if (newImages.length > 0) {
      return newImages;
    } else {
      return this.state.images.filter(image => image.folderLocation === this.state.selectedFolder.folderId);
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
    const newFolder = {
      name: name,
      folderId: this.state.folderUniqueId,
      folderLocation: selectedImage.folderLocation
    };
    filteredImages.forEach(
      image => (image.folderLocation = this.state.folderUniqueId)
    );

    this.setState({
      virtualFolders: [...this.state.virtualFolders, newFolder],
      selectedFolder: newFolder,
      folderUniqueId: this.state.folderUniqueId + 1
    });
  };

  changeSelectedFolder = e =>
  {
    const targetFolderId = parseInt(e.target.id.split('folder')[1])
    const newSelectedFolder = this.state.virtualFolders.find(folder => folder.folderId === targetFolderId)

    this.setState({
      selectedFolder: newSelectedFolder
    },() => {})
    
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
            />
            <img
              id="selectedImage"
              className={"selectedImage" + zoom}
              src={selectedImage.image}
              alt={selectedImage.tags[0]}
            />
            <EditingBar changeZoom={this.changeZoom} zoom={this.state.zoom} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Workspace;
