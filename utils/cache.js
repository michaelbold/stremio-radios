const config = require('../config')

const cache = {}

module.exports = {
	set: (type, id, data) => {
		cache[type] = cache[type] || {}
		cache[type][id] = data
		const cacheTime = id.startsWith('search:') ? config.searchCacheTime : config.cacheTime
		setTimeout(() => {
			delete cache[type][id]
		}, cacheTime)
	},
	get: (type, id) => {
		return (cache[type] || {})[id]
	}
}
