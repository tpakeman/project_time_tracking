# Project Time Tracking App
* This is a small React Webapp to record time spent on various projects.
* Time is recorded in hours rounded to the nearest 15 minutes, so 1 hour and 15 minutes would be recorded as 1.25
* Time logged can be viewed in the browser or exported to CSV.
* It is possible to set up some 'default projects' in the `src/common/constants.js`
* Make sure you add a `.env` file to set a password for the app

---
### Running this locally
This app is designed to be bundled with webpack, but it can be run locally using webpack-dev-server.
* Run `yarn install` to install the required dependencies
* Create a `dist` folder which contains an `index.html` file
  * I have included a working sample in the root directory here
* Run `yarn start` and navigate to `localhost:8080` in your browser

### Deploying to Google App Engine
As this is a static single page app you can easily deploy it to GAE with any runtime
* `app.yaml` takes care of this for you
* Set up a project on Google Cloud and enable billing
  * Disclaimer - this might cost you money...
* Download the Google Cloud SDK
* Run `gcloud app deploy` in the root directory - done!

---
## To Do List
### Features
* Favicon
* Prevent running two timers at once
* Edit the name of an existing project
* Add time manually
* Make responsive + centre login modal
* Save sessions and recover them
* Add daily totals row at bottom of chart
* Show total in both pages

### Bugs
* Working across midnight will count the values in both days
* Clear button sometimes sets display time to 23:59:59 when used on a running timer