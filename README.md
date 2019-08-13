# A site for ordering frisbee merchandise

## To run with docker
> docker-compose up -d
or
> docker-compose up --build -d

The above will build a container for the blog web app as well as a container for
a mongo instance. To restore a backup of the mongo database, make sure that a
file named backup.tgz is in the db directory when building the image.
