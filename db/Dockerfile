# Docker Image for MongoDB 3.2.21 on RPi3

# This Dockerfile is inspired on the build instructions, by Koen Aerts:
# http://koenaerts.ca/compile-and-install-mongodb-on-raspberry-pi/

# When the docker host is a raspberry pi
# temporarily increase swap space on host with:
# sudo dd if=/dev/zero of=/mytempswapfile bs=1024 count=524288
# sudo chmod 0600 /mytempswapfile
# sudo mkswap /mytempswapfile
# sudo swapon /mytempswapfile
# Do not forget to delete the swap file after you reboot.

FROM webhippie/mongodb:latest

WORKDIR /root
COPY . .

RUN rm /bin/sh && ln -sf /bin/bash /bin/sh
RUN chmod +x start.sh
RUN mkdir -p /data/db

# Expose ports
# - 27017: process
# - 28017: http
EXPOSE 27017

CMD /root/start.sh

# make sure that mongod performs a clean shutdown
# when container is stopped
STOPSIGNAL SIGINT

