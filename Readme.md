## Scripts in `package.json`

- `npm run client`: Starts the client application located in the `../client` directory.
- `npm run server`: Starts the server using PM2 with the configuration from `pm2.config.json`.
- `npm run server:dev`: Starts the server in development mode with `pm2.config.json` and saves the configuration.
- `npm run server:prod`: Starts the server in production mode with `pm2.config.json` and saves the configuration.
- `npm run server:stop`: Stops the PM2 process named `Backend_Service` and saves the state.
- `npm run server:list`: Lists all PM2 processes.
- `npm run server:logs`: Shows logs for all PM2 processes.
- `npm run server:status`: Displays the status of all PM2 processes.
- `npm run server:reload`: Reloads the PM2 process named `Backend_Service`, updating environment variables, and saves the state.
- `npm run server:restart`: Restarts the PM2 process named `Backend_Service`, updating environment variables, and saves the state.
- `npm run server:delete`: Deletes the PM2 process named `Backend_Service` and saves the state.
- `npm run server:save`: Saves the current PM2 state.
