membership and entry api

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

`npm install`

`node server`

#todo

- ~User model
- ~User controller~
- User Auth
- ~Org model~
- Org controller
- Status model
- Status controller
- Event model
- Event controller
- Attend model
- Attend controller
- Regex for URL and Handle in model and routes
- Error Middleware
