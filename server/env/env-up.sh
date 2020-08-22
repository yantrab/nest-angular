#!/bin/sh

sudo docker pull mongo
sudo mkdir -p /mongodata
sudo docker run -it -v /data/db:/mongodata --name mongodb -d mongo