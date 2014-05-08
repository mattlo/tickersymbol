#! /usr/bin/env node
var tickerSymbol = process.argv.slice(2);

console.log('');

try {
	if (tickerSymbol.length === 0) {
		throw new Error('You must provide a stock symbol');
	}
	
	if (tickerSymbol.length > 1) {
		throw new Error('You must only have one stock symbol input');
	}
} catch (e) {
	console.log('[error] ' + e.message);
}

console.log('');