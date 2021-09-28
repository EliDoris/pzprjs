import fs = require('fs');
import { VercelResponse, VercelRequestQuery } from '@vercel/node';
import { parse_query, pzvdetails } from "./tools"

const pzprdir = 'dist';

const rawpage = fs.readFileSync(pzprdir + '/p.html', 'utf8');
const parts = rawpage.split(/<title>[^<]*<\/title>/i);
const head = parts[0];
const body = parts[1];
const metatmpl = fs.readFileSync(pzprdir + '/meta.template.html', 'utf8');
const callbacktmpl = fs.readFileSync(pzprdir + '/callback.template.html', 'utf8');

function substitute(tmpl: string, vars: Record<string, string>): string {
	for (var key in vars) {
		tmpl = tmpl.replace(new RegExp('%%' + key + '%%', 'g'), vars[key]);
	}
	return tmpl;
}

export function sendPage(res: VercelResponse, query: VercelRequestQuery) {
	var qargs = parse_query(query);

	if (!qargs.pzv) {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
		res.write(head);
		res.write(substitute(callbacktmpl, {}));
		res.end(body);
		return;
	}
	try {
		const p = pzvdetails(qargs.pzv);
		var size = "";
		if (!isNaN(p.cols) && !isNaN(p.rows)) {
			size = "" + p.rows + "×" + p.cols;
		}
		var title = p.title;
		var desc = 'Solve a ' + p.title + ' puzzle';
		if (size) {
			title = size + ' ' + title;
			desc += ', size ' + size;
		}
		desc += '.';
		var vars: Record<string, string> = {
			'CANONICAL_URL': 'https://puzz.link/p?' + qargs.pzv,
			'TITLE': title,
			'DESCRIPTION': desc,
			'PREVIEW_IMG': 'https://puzz.link/pv?frame=5&' + qargs.pzv,
			'PZV': qargs.pzv
		};
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
		res.write(head);
		res.write(substitute(metatmpl, vars));
		res.write(substitute(callbacktmpl, vars));
		res.end(body);
	} catch(err) {
		console.log('caught error', err, 'sending raw page');
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
		res.end(rawpage);
	}
}
