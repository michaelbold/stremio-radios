const needle = require('needle')
const package = require('./package')
const config = require('./config')
const catalog = require('./resources/catalog')
const meta = require('./resources/meta')
const stream = require('./resources/stream')

const manifest = {
    id: 'org.radios',
    version: package.version,
    logo: 'https://www.shareicon.net/data/128x128/2016/08/04/806702_music_512x512.png',
    name: 'Radios',
    description: 'Over 93.000 radio stations from SHOUTcast.',
    resources: ['catalog', 'meta', 'stream'],
    types: ['movie', 'other'],
    idPrefixes: ['radios:'],
    catalogs: []
}

const cat = {
  id: 'radios',
  name: 'Radios',
  type: 'other',
  extra: [
    { name: 'search' },
    { name: 'skip' }
  ]
}

// get genres and initiate add-on

module.exports = catalog.getGenres().then(genres => {

  cat.genres = genres
  cat.extra.push({ name: 'genre' })
  manifest.catalogs.push(cat)

  const { addonBuilder }  = require('stremio-addon-sdk')

  const addon = new addonBuilder(manifest)

  addon.defineCatalogHandler(catalog.handler)

  addon.defineMetaHandler(meta.handler)

  addon.defineStreamHandler(stream.handler)

  return addon.getInterface()

})
