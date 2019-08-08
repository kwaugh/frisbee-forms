# A site for ordering frisbee merchandise

## To run with docker
> docker-compose up

The above will build a container for the frisbee-forms web app as well as a container for
a mongo instance. To restore a backup of the mongo database:

> docker cp $PATH_TO_BACKUP frisbee-forms_mongo_1:/root
> docker exec -it $MONGO_CONTAINER_ID bash
> tar -xzvf $BACKUP_NAME
> mongorestore $BACKUP_NAME
