let router

module.exports = async function(req, res) {
	if (!router) {
		const { getRouter } = require('stremio-addon-sdk')
		const addonInterface = await require('./index')
		router = getRouter(addonInterface)
	}
	router(req, res, function() {
		res.statusCode = 404
		res.end()
	})
}
