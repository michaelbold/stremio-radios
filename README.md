# Stremio Add-on for Radios

Stremio Add-on for Radios based on the [SHOUTcast Radio Directory API](http://wiki.winamp.com/wiki/SHOUTcast_Radio_Directory_API).

The directory contains over 93.000 radio stations.


## Features

- Top Radio Catalog
- Filter Catalog by Genre
- Pagination of Catalog
- Searching Catalog
- Streaming Radio Stations


## Running this add-on locally

```
npm i
npm start
```


## Using remotely in Stremio

Go to the Add-ons page, then click "Community Add-ons", scroll down to "Radios", press "Install"


## Understanding the code

- `index.js` defines the manifest and runs the add-on.

- `config.js` configuration file

- `/resource` includes files for different resource types: `catalog.js`, `meta.js` and `stream.js`, each have a `module.exports.handler` which is called on every request from the Stremio Add-on SDK.

- `/utils` includes `cache.js` (in-memory) and `base64.js` (used to generate `meta.id`).
