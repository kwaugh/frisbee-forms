# A site for ordering frisbee merchandise

## To run with docker
Build the image
> docker build -t kwaugh/frisbee-forms .

Run the image
> docker run -p PORT:80 --network NETWORK_NAME --name APP_NAME kwaugh/frisbee-forms

Note that this container expects another container with mongodb to be running on
the same machine on the same docker network. For example:
> docker run --network NETWORK_NAME --name mongodb webhippie/mongodb:latest

After running this application for the first time with name APP_NAME, in the
future it can be started by just running
> docker start APP_NAME
