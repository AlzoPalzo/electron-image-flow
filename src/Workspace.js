import React, { Component } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { contentTracing } from "electron";

class Workspace extends Component {
  state = {
    dir: "",
    files: [],
    images: [],
    virtual_folders: [],
    selectedImage: null
  };

  onDirChange = e => {
    const fs = require("fs");
    const dir = e.target.files[0].path;

    this.setState({
      dir: dir
    });

    fs.readdir(dir, (err, files) => {
      if (err) throw err;
      this.setState(
        {
          files: files
        },
        () => {
          this.identifyImages();
        }
      );
    });
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
    // let sizeOf = require("image-size");
    // debugger
    let contents = fs.readFileSync(imageUrl);
    if (contents.length > 4000000) {
      let img = new Image();
      img.onLoad = e => {
        let canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");

        
      };
      img.src = image;
    } else this.fetchTags(image, contents);
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

        this.state.selectedImage
          ? this.setState({
              images: [...this.state.images, { image: image, tags: tags }]
            })
          : this.setState({
              images: [...this.state.images, { image: image, tags: tags }],
              selectedImage: { image: image, tags: tags }
            });
      });
  };

  render() {
    const { dir, images, virtual_folders } = this.state;
    return (
      <div>
        <Header onDirChange={this.onDirChange} />
        {/* {dir !== "" && images.length > 0 ? (
          <div>
            <Sidebar
              images={images}
              dir={dir}
              virtual_folders={virtual_folders}
            />
          </div>
        ) : null} */}
      </div>
    );
  }
}

export default Workspace;
