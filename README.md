
#### Please note the variable "key" in Workspace.js is just an example.<br> This app requires a payed API key from Microsofts cognitive services <a href="https://azure.microsoft.com/en-gb/services/cognitive-services/computer-vision/">computer vision service.<a/>

If you would just like to view a demo you can do so here https://youtu.be/ssArcIiOV1g

After cloning and downloading run the following commands:

  * yarn add electron electron-builder --dev
  
  * yarn add wait-on concurrently --dev<br>
  yarn add electron-is-dev
  
  * yarn add @rescripts/cli @rescripts/rescript-env --dev
  
  * yarn add electron-builder typescript --dev



## Available Scripts

In the project directory, you can run:

### yarn electron-dev

Runs the app in the development mode.<br>
opens an application window allowing you to use the app with chrome dev tools open. You also have access to react dev tools

### yarn electron-pack

Creates a packages the app into a desktop application.<br>

By default the application is packaged for both mac and windows. Please note however that the app is currently only built to work with Macs.
