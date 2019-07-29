FROM ubuntu:latest
RUN apt-get -y update
RUN apt-get -y install apache2
COPY ./dist /var/www/html
EXPOSE 80
CMD apachectl -D FOREGROUND