# Warning: This app is under development

## React && Flask : Covid-19 pandemic focus in Thailand

- App run in 2 parts --> backend service & client service:

  - Get Mapbox API key from [mapbox](https://www.mapbox.com/) then go to `'client/src/components/Map.jsx'` find variable `mapboxgl.accessToken = '' `and assign value.

  - Assign proxy server in `client/package.json` to deal with backend container:

    - `"proxy": "http://backend:5000",`

  - Build & run app:

    - `docker-compose up -d --build`

  - Run app:

    - `docker-compose up -d`

  - Stop app:
    - `docker-compose down`

## Note:

TODO: document : use NodeJS as proxy server.
![Model](https://github.com/Suzanoo/thai-covid-react-flask/blob/main/client/src/public/img/img1.png)
