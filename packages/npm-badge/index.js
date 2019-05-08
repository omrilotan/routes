const paraphrase = require('paraphrase');
const phrase = paraphrase(/\{{([^{}]*)}}/gm);
const template = require('./lib/template');
const downloads = require('./lib/downloads');
const { toHumanString } = require('human-readable-numbers');

const START_POINT = 46;
const M_SIZE = 8;

module.exports = async({query}, response, next) => {
	try {
		const { name } = query;
		const weekly = await downloads(name);
		const text = `${name} - ${toHumanString(weekly)} weekly downloads`;
		const width = START_POINT + M_SIZE * text.length;
		const result = phrase(await template(), { text, width });

		response
			.status(200)
			.type('image/svg+xml')
			.send(result);
	} catch (error) {
		next(error);
	}
};
