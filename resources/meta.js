const needle = require('needle')
const config = require('../config')
const base64 = require('../utils/base64')
const cache = require('../utils/cache')

function toMeta(obj) {
	const logo = obj.attributes.logo || null
	const genres = []
	for (let i = 0; obj.attributes['genre' + (i || '')]; i++)
		genres.push(obj.attributes['genre' + (i || '')])
	return {
		id: base64.encode(obj.attributes),
		name: obj.attributes.name,
		posterShape: 'square',
		poster: logo,
		logo: logo,
		background: logo,
		type: 'movie',
		genres
	}
}

function findMeta(items, id) {
	return new Promise((resolve, reject) => {
		const results = items.filter(item => item.attributes.id == id)
		if (results[0])
			resolve(toMeta(results[0]))
		else
			reject(new Error('Could not identify meta for: ' + id))
	})
}

module.exports = {
	handler: args => {
		const cached = cache.get('metas', args.id)
		if (cached)
			return Promise.resolve({ meta: cached, cacheMaxAge: config.cacheTime })
		const data = base64.decode(args.id)
		const url = config.endpoint + '/legacy/stationsearch?k=' + config.key + '&search=' + data.stationName + '&limit=10'
		return needle('get', url).then(resp => {
				return findMeta(((resp || {}).body || {}).children || [], data.stationId)
			}).then(meta => {
				cache.set('metas', args.id, meta)
				return { meta, cacheMaxAge: config.cacheTime }
			})
	},
	toMeta
}
