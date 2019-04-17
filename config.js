
const day = 86400000
const hour = 3600000

module.exports = {
	endpoint: 'http://api.shoutcast.com',
	key: process.env.SHOUTCAST_KEY,
	cacheTime: day,
	searchCacheTime: 3 * hour
}
