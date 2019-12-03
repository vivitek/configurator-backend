# Web server

[![Build Status](https://travis-ci.com/vivitek/backend.svg?branch=master)](https://travis-ci.com/vivitek/backend)


## the all-knowing service for configurating your router

---

## Functionalities
 - Users can register their account
 - Users can add routers to their account
 - Users can view connected devices
 - Users can create configurations for services
 - Users can upload configurations to designated router

---

## Features

- [ ] User creation
- - [ ] create a user
- - [ ] sign in a user
- - [ ] basic user fonctionnalities (password reset etc...)
- [ ] Router association
- - [ ] create a router (i.e insert his id and link it to the current user's account)
- - [ ] allow or deny user connection based on user's input
- - [ ] see the router logs
- [ ] Configurations creation
- - [ ] determine which services are allowed to pass through
- - [ ] determine how much bandwith to allocate to each service

---

## Architecture

- Adopted structure is to be monolithic (classic monorepo), waiting for a refactoring to switch over to microservices

---

## Authentication

- Local (passport)

---

## Data Models

- User
- - email
- - password
- - firsName
- - lasName
- - telephoneNumber
- - [router]

- Router
- - name
- - url (from balena.io)
- - config

- Config
- - name
- - [service]

- Service
- - displayName
- - name
- - bandwidth