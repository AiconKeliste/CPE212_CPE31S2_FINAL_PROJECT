FROM nginx:alpine
COPY docker.html /usr/share/nginx/html/index.html
COPY docker.js /usr/share/nginx/html/docker.js
EXPOSE 80
