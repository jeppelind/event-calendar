# Event Calendar #

Project mono repo.

Moderated calendar showing upcoming events.

Live version found at https://evenemangskalendern.com (with Swedish data).

Android app found at: https://play.google.com/store/apps/details?id=com.jeppelind.evenemangskalendern

## Structure ##
The project is divided into several parts intended to run as micro services.

### API ###
A NodeJS Express server providing a endpoint that uses GraphQL to fetch data from MongoDB.

### Client UI ###
A React app hosted in Express.

### Admin UI ###
A React/Redux app hosted in Express. Allows editing of data through the API.

## About ##
The different services are designed to be run in a Kubernetes environment, with Client and Admin being reachable through an ingress.

## App ##
The native-app directory contains the mobile app version, written in React-Native. It also contains a small backend endpoint intended to run in the same k8s environment as the API, providing the app with data.
