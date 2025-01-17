# MedHack Hospital Spider Node.js Module

CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Folder Structure
 * Configuration
 * Testing
 * Troubleshooting
 * API Endpoints
 * Contributing

INTRODUCTION
------------
This directory contains the node module with utility functions for parsing and converting data in this repo as well as
raw hospital pricing records into the appropriate, standardized format

FOLDER STRUCTURE
----------------

`./database` (sequelize ORM )contains our database configs and model definitions, seeders and migration folders,

`./services` contains helper modules to help convert formats or fetch data to feed to the api (index.js)

`./reactui` might contain a react app that consumes our endpoint for easier and better visualization during development paginations.....

`index.js` contains our api endpoints

`package.json` defines our dependencies

CONFIGURATION
-------------

To test the endpoints you must have node installed.

In the root of this folder, from your favorite cli 
run `npm install` or `yarn install` to install app dependencies defined in package.json.
After that run `node index.js` , `yarn start` or `npm start` to start the dev server (express js) 
configured to run on port 3007 during development ie `http://localhost:3007/`
**NOTE:** Remember to check README_database.md to configure your **database** connections

TESTING
-------
Currently we're testing on importing csv file(s) in relation to our institutions table(data in the spreadsheet) into the
database, some files are not properly formatted and others can't import completely, other's are missing the required 
values or even a matching hospital rId and we need help with that.

To help test, go to `http://localhost:3007/api/load-data-from-csv` , make sure to have your database configured and your
institutions table loaded. This endpoint is meant to process files in our `rawCSVs` folder so only file 
`hospital_Zuckerberg San Francisco General Hospital and Trauma Center.csv` will be processed, after success you will get 
a message output `'Data.Saved.........'` . You can test with other files and move each to a folder accordingly, ie if 
processed, processed but not complete, and so on.


TROUBLESHOOTING
---------------



API ENDPOINTS
-------------
###Below are the endpoints to test
##### homepage url = http://localhost:3007

. `/` home

. `/api/csv-files `// returns all available csv files in ./rawCSVs folder

. `/api/csvdata/:id`  // given the filename as the param in this request 
returns json data of the csv file name give as the url param

. `/api/data/local-spread-sheets` // returns all available spreadsheet files in
 the ./rawXlsxs folder
 
. `/api/data/local-xlsl-file/:id` //given the right name as the param (:id) 
it will return json data of the given file

 . `/api/data/google-spread-sheets` // should list all available spreadsheets 
 to be used with /api/data/google-spread-sheets/:id (where each spreadsheet 
 id should be used with this endpoint)
 
 .`/api/data/google-spread-sheets/:id` // returns data from google drive api 
 services if spreadsheet and id and credentials are well configured (check 
 app dir client_secret.json, client_email: 'Value to share'). 
 This `/api/data/google-spread-sheets` should be the reference to use for
 end point = `/api/data/google-spread-sheets/:id`.
 
 ### Database related endpoints
 
 #### To test these endpoints you must have mysql running in your local server on port 
 127.0.0.1, with username root, and password not set (edit later for user custom values)
 also make sure you have the database by name as defined in database key in `./database/config/config.json`
 in our case database_development for dev env. 
 ##And head to the api endpoints to test and decide from here..
 
 .`/api/update-script` updates the database tables with the structure(s) defined in the models folder
 
 .`/api/update/google-spreadsheets-hospital-services` given the right object, this endpoint should insert
 or patch the services table
 
 .`/api/update/institutions` given the right object this endpoint should insert or patch the
 institutions table
 
 For developers see .nodejsModule/index.js in root dir for endpoint and maybe helpful comments