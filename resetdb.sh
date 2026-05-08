#!/bin/bash
sudo systemctl stop postgresql
sudo systemctl start postgresql
sudo -u postgres psql -c "DROP DATABASE IF EXISTS event_app_dev;"
sudo -u postgres psql -c "DROP USER IF EXISTS eventapp;"
sudo -u postgres psql -c "CREATE USER eventapp WITH PASSWORD 'devpass';"
sudo -u postgres psql -c "CREATE DATABASE event_app_dev OWNER eventapp;"
npx prisma migrate deploy
npx prisma studio