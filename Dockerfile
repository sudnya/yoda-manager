FROM python:3.9

RUN apt-get -yq update && apt-get install -yqq npm

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

WORKDIR /app/yoda_manager/frontend
COPY ./yoda_manager/frontend/package.json /app/yoda_manager/frontend/package.json
RUN npm install
# Install material-ui
RUN npm install @material-ui/core@next && \
    npm install @emotion/react && \
    npm install @emotion/styled

RUN npm install @material-ui/icons@next
RUN npm install @material-ui/styles@next

# Install react router
RUN npm install react-router-dom

# Install environment
RUN npm install env-cmd

COPY . /app

RUN chmod a+x /app/scripts/start-dev.sh

WORKDIR /app
ENTRYPOINT ["/app/scripts/start-dev.sh"]