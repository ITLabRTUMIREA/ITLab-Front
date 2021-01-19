FROM nginx

COPY fillConfig.sh /scripts/fillConfig.sh
RUN chmod +x /scripts/fillConfig.sh
EXPOSE 9001

RUN mkdir /app

COPY /ITLab-Front /app

COPY nginx.conf /etc/nginx/nginx.conf

CMD /scripts/fillConfig.sh > /app/config.json && cat /app/config.json && nginx