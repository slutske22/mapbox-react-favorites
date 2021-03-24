export const ACCESS_TOKEN =
	'pk.eyJ1IjoiZGFzdWxpdCIsImEiOiJjaXQzYmFjYmkwdWQ5MnBwZzEzZnNub2hhIn0.EDJ-lIfX2FnKhPw3nqHcqg';

export const queryparams = {
	radius: '500',
	limit: '5',
	dedupe: true,
	layers: 'poi_label',
	access_token: ACCESS_TOKEN,
};

export const buildQueryParams = () =>
	Object.keys(queryparams)
		.map((param) => `${param}=${queryparams[param]}`)
		.join('&');
