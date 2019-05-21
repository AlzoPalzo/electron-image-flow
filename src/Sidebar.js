import React, { Component } from 'react';

class Sidebar extends Component {

    mapImages = () => 
    {
        return this.props.images.map(image => 
            <div id={image + '-div'} key={image} className="tileContainer">
                <img src={image} id={image + '-img}'} key={image} alt={image} className="tileImage"/>
            </div>)
    }

    render() {
        return (
          <div className="sidebar">
            <h4 id="scrollBarTitle">Image Viewer</h4>
            <input
              id="tagSearch"
              type="search"
              placeholder="Search by content"
            />
            <div id="imageRail">{this.mapImages()}</div>
          </div>
        );
    }
}

export default Sidebar;
