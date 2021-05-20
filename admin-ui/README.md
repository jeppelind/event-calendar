# Admin UI

ExpressJS server hosting React application with admin user interface for event calendar.

Allows creation/editing/deleting of events in the database. Also some user administration.

## Environmental settings
`PORT` - port to run on

`MONGODB_TEST_URI` - mongodb test server

`MONGODB_URI` - mongodb prod server

`SESSION_SECRET` - Secret used in express-session

`API_URL` - Url to the event API

Build docker image:
`docker build -t event-calendar-admin-ui:latest -t event-calendar-admin-ui:VERSION .`
