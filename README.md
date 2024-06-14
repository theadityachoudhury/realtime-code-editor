
# Realtime Collaborative Code Editor With Version Management

A Realtime Collaborative Code Editor with Version Management is an advanced web-based tool designed to facilitate seamless collaboration among multiple users in real-time. It allows developers to write, edit, and review code collectively from different locations, enhancing productivity and teamwork. This platform integrates powerful version management features to track changes, maintain a history of revisions, and manage different versions of the code efficiently.




## Key Features

- Real-time Collaboration
- Version Management
- User Management
- Syntax highlighting and code completion
- Cloud based and scalable
- In built online code compiler


## Authors

- [@theadityachoudhury](https://www.github.com/theadityachoudhury)


## Tech Stack

**Client:** React, Vite, TailwindCSS, Typescript, Vercel, Socket.io

**Server:** Node, Express, Typescript, MongoDB, Socket.io


## Demo

**Frontend**:- https://editor.adityachoudhury.com

**Backend**:- https://backend.editor.adityachoudhury.com


## Deployment

To deploy this project run

**To Install Packages**
```bash
  npm install
```

**To run the app**
```bash
npm run server
```



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

**For Frontend**

`VITE_BACKEND_URL` - Backend URL

`VITE_FRONTEND_URL` - Frontend URL

`VITE_APP_NAME` - App Name


**For Backend**

`APP_NAME` - App Name

`FRONTEND_URL` - Frontend Link

`BACKEND_URL` - Backend Link

`DB` - Database URL

`DB_APP_NAME` - Database cluster name

`DB_USER` - Database username

`DB_PASS` - Database password

`REQUEST_TIMEOUT` - After how much time the DB should stop request after getting a timeout

`PORT` - The port in which the app will run

`JWT_SECRET` - Hashing key for the access token

`JWT_REFRESH_TOKEN_SECRET` - Hashing key for the refresh token

`SMTP_HOST` - Email host address

`SMTP_PORT` - Email server port number

`SMTP_USER` - Email Id

`SMTP_PASS` - Email Id password

`SMTP_SENDER_NAME` - Name in which emails will be sent