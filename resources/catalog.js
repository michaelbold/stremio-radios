const needle = require('needle')
const config = require('../config')
const toMeta = require('./meta').toMeta
const cache = require('../utils/cache')

let top500 = []
const perPage = 70

function request(query, skip, limit) {
  return new Promise((resolve, reject) => {

    let url = config.endpoint + '/legacy/'

    if (query.search)
      url += 'stationsearch?search=' + encodeURIComponent(query.search)
    else if (query.id == 'top')
      url += 'Top500?'
    else
      url += 'genresearch?genre=' + encodeURIComponent(query.id)

    url += '&limit=' + skip + ',' + limit + '&k=' + config.key

    needle('get', url).then(resp => {
      results = (((resp || {}).body || {}).children || []).filter(item => item.name == 'station')
      if (results.length)
        resolve(results.map(toMeta))
      else
        reject(new Error('Catalog request failed: ' + JSON.stringify(query)))
    }).catch(err => {
      reject(err)
    })

  })
}

module.exports = {
  handler: args => {
    const id = args.extra.search ? 'search:' + args.extra.search : (args.extra.genre || 'top')
    const skip = parseInt(args.extra.skip || 0)
    const cached = cache.get('catalogs', id)
    if (cached)
      return Promise.resolve({ metas: cached.slice(skip, perPage + skip), cacheMaxAge: config.cacheTime })
    const limit = args.extra.search ? 20 : 500
    return request({ id, search: args.extra.search }, skip, limit).then(metas => {
        cache.set('catalogs', id, metas)
        const cacheMaxAge = config[args.extra.search ? 'searchCacheTime' : 'cacheTime']
        return { metas: metas.slice(skip, perPage + skip), cacheMaxAge }
      })
  },
  getGenres: () => {
    return needle('get', config.endpoint + '/genre/primary?k=' + config.key + '&f=json').then(resp => {
        // god almighty.. who approved this json catastrophe?
        const genres = ((((((resp || {}).body || {}).response || {}).data || {}).genrelist || {}).genre || []).map(genre => {
          return genre.name
        })
        if (!genres.length)
          console.error(new Error('Could not get genres'))
        return genres
      })
  }
}
