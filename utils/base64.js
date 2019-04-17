function btoa(str) {
	return Buffer.from(str.toString(), 'binary').toString('base64')
}

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
}

module.exports = {
	encode: (attr) => {
		return 'radios:' + attr.id + '|' + btoa(encodeURIComponent(attr.name))
	},
	decode: (id) => {
		const stationId = id.replace('radios:', '').split('|')[0]
		const stationName = atob(id.split('|')[1])
		return { stationId, stationName }
	}
}
