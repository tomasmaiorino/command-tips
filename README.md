Command Tips is an application where the user can easily find those commands the they knows that exist, or even used already but it can't remember its syntax.
This application contains within two applications:
1 - server (node application) for the backend service.
2 - cliente (react application) for the frontend.

## Used Technologies

** 1. Node version 8.6**

** 2. Mongo Latest**

** 3. React 16.2.0**

** 4. Webpack 4.4.0** 

## Usage locally

###### Pre-requirements

Node 8.6
Mongo DB

##### Running 

Download the source code from [link github](https://github.com/tomasmaiorino/command-tips).
# Backend.
### Configuring server application.
```$
cd server 
```
```$
npm install
```
###### Running unit tests.
Access the follwing folder: server/tests
```$
mocha *.js
```  
###### Running integration tests.
Access the follwing folder: server/tests/it
```$
mocha *.js
```  
# Frontend.
### Configuring client application.
```$
cd client
```
```$
npm install
```

####  Running the application (Locally).
1 - Start either the mongo db or the mongo container.
2 - Access the server folder and start the server application.
```$
npm start
```
3 - Access the client folder and start the client application.
```$
npm start
```

####  Building the frontend to deploy.
3 - Access the client folder.
```$
npm run-script build
```