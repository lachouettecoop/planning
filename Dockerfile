# Build the static application from source
FROM node:12.10-alpine AS builder

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

# Create the production lightweight image to serve static content
FROM pierrezemb/gostatic:latest AS serve
COPY --from=builder /app/build /srv/http

ENTRYPOINT [ "./goStatic" ]
CMD [ "-fallback", "/index.html" ]