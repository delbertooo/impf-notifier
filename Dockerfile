FROM cypress/browsers:node12.18.3-chrome83-ff77


WORKDIR /app
COPY package*.json /app/
RUN npm install --no-optional --only=prod
RUN $(npm bin)/cypress verify
COPY cypress/integration /app/cypress/integration
COPY cypress/plugins /app/cypress/plugins
COPY cypress/support /app/cypress/support
COPY index.js cypress.json /app/

ENTRYPOINT [ "npm", "start" ]