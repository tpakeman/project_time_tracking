## Project Time Tracking App

This is a small React Webapp to record time spent on various projects.
Time is recorded in hours rounded to the nearest 15 minutes, so 1 hour and 15 minutes would be recorded as 1.25
Time logged can be viewed in the browser or exported to CSV.
It is possible to set up some 'default projects' in the `src/common/constants.js`

---
### Running this locally
This app is designed to be bundled with webpack, but it can be run locally using webpack-dev-server.
* Run `yarn install` to install the required dependencies
* Create a `dist` folder which contains an `index.html` file
  * I have included a working sample in the root directory here
* Run `yarn start` and navigate to `localhost:8080` in your browser


### Features
* Prevent running two timers at once
* Edit the name of an existing project
* Add time manually
* Make responsive

### Bugs
* Working across midnight will count the values in both days
* Password needs to be fetched from backend
* Login Modal is not centred