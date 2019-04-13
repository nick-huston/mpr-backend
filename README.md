# Make Papa RICH Backend
mySQL communicator for Make Papa Rich

## Requirements
* [npm](https://www.npmjs.com/)
* [yarn](https://yarnpkg.com/)
* [mysql](https://mysql.com/)
* [nodemon](https://nodemon.io/)

## Running
To run the project locally, a mysql-server instance must be running on the host system with a database named "MakePapaRich" and a table named "users", before any customization.
To begin running the project, run the following commands:
```sh
git clone https://github.com/nick-huston/mpr-backend
cd mpr-backend
yarn
nodemon index.js
```
This will have nodemon begin listening on `localhost:4000`.
