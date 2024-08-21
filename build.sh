#!/bin/bash

# Build docker
docker rm task-management -f
docker build . --no-cache -t task-management
docker run -d -p 5015:80 --name task-management task-management