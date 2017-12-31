# verboze-web
All web related components of Verboze. Including public website, api, and dashboard.

## Installation & Setup
#### Settting up python
Clone the project and create a clean virtual environment with python3 (I recommend taking a look at [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/install.html))

Make sure your virtual env is activated, then install the python packages:
```sh
$ pip install -r requirements.txt
```
#### Setting up postgres
Install postgres either through brew:
```sh
$ brew install postgresql
$ brew services start postgresql
```
Or through [Postgres.app](https://postgresapp.com/)
Enter postgres interactive shell:
```sh
$ psql
psql (9.6.4, server 9.6.5)
Type "help" for help.

ymusleh=#
```
Create a user to access db (replace name with desired username):
```sh
ymusleh=# CREATE USER name;
```
Create database (replace db_name with desired name, and name should be same as previously defined username):
```sh
ymusleh=# CREATE DATABASE db_name OWNER name;
```
#### Set & source environment variables
Create a shell file to define our secret environment variables:
```
# secrets.sh

export SECRET_KEY='##############' # Get django key from Yusuf
export DB_NAME='name' # name of your psql db
export DB_USER='db_name' # name of your psql user
export DB_PASS='' # password is blank by default if not set
```
Then we simply source this file:
```sh
$ source secrets.sh
```
#### Migrate database
```sh
$ python manage.py migrate
```
#### Setting up react and webpack
Make sure you have `node` and `npm` installed, open a terminal tab and navigate to root directory that has `package.json` and run:
```sh
$ npm install
```
This will install the the node modules we need for react and webpack, since they alot, we do not push them to the repo.
Now whenever we edit react js files, you have to build in order for webpack to create a bundle and that will be loaded to django through the webpack-loader that was installed from the `requirements.txt`:
```sh
$ npm run build
```
In production we have a slightly different config, we run the following command:
```sh
$ npm run build-production
```
> **Note:** We use [Flow](https://flow.org/) (should have been installed through the `package.json`), we use it to add static type checking for the front end code we write. It helps minimize errors and helps with the understanding and expectation of code. Make sure to set it up with your text [editor](https://flow.org/en/docs/editors/).

You can run the following command to see if there are any errors:
```sh
$ npm run flow
```

#### Setting up redis
Install redis and enable auto start
```sh
$ brew install redis
$ ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents
```
Start redis:
```sh
$ brew services start redis
```
Check if everything worked properly, this command should return `PONG`:
```sh
$ redis-cli ping
PONG
```

#### Setting up gunicorn
Gunicorn should have been installed as one of the packages in `requirements.txt`. We use gunicorn as our WSGI HTTP server, instead of the django development server, it will handle all incoming HTTP requests.
> **Note:** For local development we should use the django development server inorder to get reload on code save, verbose output/errors etc:
Run with the following command (port is important):
```sh
$ python manage.py runserver 127.0.0.1:8001
```
Start gunicorn (the port is important):
```sh
$ gunicorn verboze.wsgi --bind=127.0.0.1:8001
[2017-11-02 02:55:47 -0400] [71060] [INFO] Starting gunicorn 19.7.1
[2017-11-02 02:55:47 -0400] [71060] [INFO] Listening at: http://127.0.0.1:8001 (71060)
[2017-11-02 02:55:47 -0400] [71060] [INFO] Using worker: sync
[2017-11-02 02:55:47 -0400] [71063] [INFO] Booting worker with pid: 71063
```

#### Setting up daphne
Daphne should have also been installed from the `requirements.txt`. We use daphne as our websocket protocol server, it will handle all incoming websocket connections.

In a new terminal tab, start daphne (port is also import):
```sh
$ daphne -b 127.0.0.1 -p 8005 verboze.asgi:channel_layer
2017-11-03 08:26:22,831 INFO     Starting server at tcp:port=8005:interface=127.0.0.1, channel layer verboze.asgi:channel_layer.
2017-11-03 08:26:22,831 INFO     HTTP/2 support not enabled (install the http2 and tls Twisted extras)
2017-11-03 08:26:22,831 INFO     Using busy-loop synchronous mode on channel layer
2017-11-03 08:26:22,831 INFO     Listening on endpoint tcp:port=8005:interface=127.0.0.1
```
#### Run django worker
The worker is needed to handle websockets communication.
> **Note:** For local development since we are using the django development server it runs the worker automatically, so we do not need to do anything in this step.
In a new terminal tab, start the worker:
```sh
$ python manage.py runworker
2017-11-03 08:29:46,136 - INFO - runworker - Using single-threaded worker.
2017-11-03 08:29:46,136 - INFO - runworker - Running worker against channel layer default (asgi_redis.core.RedisChannelLayer)
2017-11-03 08:29:46,137 - INFO - worker - Listening on channels http.request, websocket.connect, websocket.disconnect, websocket.receive
```

#### Setting up local.com
Some of the benefits of setting up an actual domain to work on in local development vs using localhost include:

* allowing the use and testing of subdomains
* running multiple django projects and have them communicate with each other
* closer replication of real production environment locally

To set this up, we need to point `local.com`, `www.local.com` and `dashboard.local.com` to `127.0.0.1`.
Open your hosts file (using sudo) with your favorite editor and add the following entries:
```sh
$ sudo emacs /etc/hosts
```
```
127.0.0.1       local.com
127.0.0.1       www.local.com
127.0.0.1       dashboard.local.com
```
Save the file, quit, and run the following command to flush your computer cached dns:
```sh
$ sudo killall -HUP mDNSResponder
```
After that check that it worked, all the domains above should resolve to `127.0.0.1`:
```sh
$ ping local.com
PING local.com (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.045 ms
...

$ ping www.local.com
PING www.local.com (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.044 ms
...

$ ping dashboard.local.com
PING dashboard.local.com (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.050 ms
...
```
Now that they are resolving to `127.0.0.1` we need a way to route incoming requests. Thats where nginx comes in.

#### Setting up nginx
Nginx is a reverse proxy and load balancer, we use it as the layer above our HTTP and websocket servers. It allows us to route HTTP requests to gunicorn and websocket connections to daphne, and at the same time serve our static files.

Install nginx:
```sh
$ brew install nginx
```
After it finished installing, we need to edit the config file located at `/usr/local/etc/nginx/nginx.conf`. Replace the whole contents of the file with the following (replace the places with comments to match your computer):
```
# nnginx.conf

# replace ymusleh with your computer user
user  ymusleh staff;

worker_processes  1;
worker_rlimit_nofile 1024;

error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    upstream app_server {
        server 127.0.0.1:8001 fail_timeout=0;
    }

    server {
        listen 80;
        server_name local.com www.local.com;

        location /static/public_website/ {

            # replace with your path
            root /Users/ymusleh/Documents/verboze/web/public_website/;

            autoindex on;
        }

        location /dashboard/ {
          return 404;
        }

        location / {
            proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;

            # enable when using HTTPS
            # proxy_set_header X-Forwarded-Proto https;

            proxy_set_header Host $http_host;
            # we don't want nginx trying to do something clever with
            # redirects, we set the Host: header above already.
            proxy_redirect off;
            proxy_pass http://app_server;
        }

    }

    server {
        listen 80;
        server_name dashboard.local.com;

        location /stream/ {
            proxy_pass http://127.0.0.1:8005;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        location /static/bundles/ {
            # replace with your path
            alias /Users/ymusleh/Documents/verboze/web/frontend/bundles/;

            autoindex on;
        }

        location / {
            proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;

            # enable when using HTTPS
            # proxy_set_header X-Forwarded-Proto https;

            proxy_set_header Host $http_host;
            # we don't want nginx trying to do something clever with
            # redirects, we set the Host: header above already.
            proxy_redirect off;
            proxy_pass http://app_server/dashboard/;
        }

    }

    include servers/*;
}

```
Save the file. Then we need to run nginx (with sudo since we are using port 80):
```sh
$ sudo nginx
```
> **Note:** If you get an error the following error or something similar:
`nginx: [emerg] open() "/usr/local/Cellar/nginx/1.12.2_1/logs/error.log" failed (2: No such file or directory)`
Simply create that file, and it should solve the problem.

If no errors appear it should be good to go, check if nginx is listening on port 80:
```sh
$ sudo lsof -n -i:80 | grep LISTEN
nginx   70649    root    6u  IPv4 0x8fe23ec14848daeb      0t0  TCP *:http (LISTEN)
nginx   70650 ymusleh    6u  IPv4 0x8fe23ec14848daeb      0t0  TCP *:http (LISTEN)
```
To stop nginx simply:
```sh
$ sudo nginx -s stop
```
If everything went well you should be successfully access `local.com`, `www.local.com` and `dashboard.local.com` in the browser.
If the browser resolved to the actual `www.local.com` and not verboze, you need to clear the browser dns cache.

Happy Hacking!