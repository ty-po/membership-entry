#membership and entry api

node + express


#Setup

AWS Ubuntu 14.04 instance

`curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -`

`sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`

`echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list`

`sudo apt-get update`

`sudo apt-get install -y nodejs git vim build-essential mongodb-org=3.0.3`

`sudo service mongod start`

`cd membership-entry`

`sudo chown -R $(whoami) ~/.npm`

`npm install`

`npm start`

#todo

- unit testing
- ~~Event model~~
- Event controller
- ~~Attend model~~
- Attend controller <-- the biggie; parsing, dupe handling etc
- Regex for `url` and `handle` in model and routes
- Error Middleware
- `/m/` route on individual orgs and users for membership filtering
- Load Saving
- ~~nginx Front~~
- ~~User model~~
- ~~User controller~~
- ~~User Auth~~
- ~~Org model~~
- ~~Org controller~~
- ~~Status model~~
- ~~Status controller~~
- ~~ssl(self signed)~~
