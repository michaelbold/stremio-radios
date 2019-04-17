const needle = require('needle')
const m3u = require('m3u8-parsed')
const meta = require('./meta')
const config = require('../config')
const base64 = require('../utils/base64')
const cache = require('../utils/cache')

const streams = {}

function toStream(obj, i) {
	return {
		title: 'Stream #' + (i+1),
		url: obj.uri
	}
}

module.exports = {
	handler: args => {
		const cached = cache.get('streams', args.id)
		if (cached)
			return Promise.resolve({ streams: cached, cacheMaxAge: config.cacheTime })
		const data = base64.decode(args.id)
		const url = 'http://yp.shoutcast.com/sbin/tunein-station.m3u?id=' + data.stationId
		return needle('get', url).then(resp => {
			const body = (resp || {}).body || ''
			if (body.length) {
				const playlist = m3u(body)
				if (playlist && playlist.segments && playlist.segments.length) {
					const result = playlist.segments.map(toStream)
					streams[args.id] = result
					cache.set('streams', args.id, streams[args.id])
					return { streams: result, cacheMaxAge: config.cacheTime }
				} else
					return Promise.reject(new Error('Playlist empty for: ' + data.stationId))
			} else
				return Promise.reject(new Error('Could not get stream for: ' + data.stationId))
		})
	}
}
