#! /usr/bin/env node
var tickerSymbol = process.argv.slice(2),
	http = require('http');

try {
	var req;
	
	if (tickerSymbol.length === 0) {
		throw new Error('You must provide a stock symbol');
	}
	
	if (tickerSymbol.length > 1) {
		throw new Error('You must only have one stock symbol input');
	}
	
	req = http.request({
		host: 'query.yahooapis.com',
		path: '/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20=%22' + tickerSymbol[0] + '%22&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env'
	}, function (response) {
		var rawData = '';
		
		response.on('data', function(chunk) {
			rawData += chunk;
		});

		response.on('end', function() {
			try {
				// parse as JSON
				var data = JSON.parse(rawData).query.results.quote;

				if (data.StockExchange === null) {
					throw new Error('"' + tickerSymbol[0] + '" is not a valid ticker symbol');
				}

				console.log('');
				console.log('Name:        ' + data.Name);
				console.log('Exchange:    ' + (data.StockExchange).replace(/NM$/, '').toUpperCase());
				console.log('Last Trade:  ' + data.LastTradeDate + ' ' + data.LastTradeTime);
				console.log('Price:       ' + data.LastTradePriceOnly);
				console.log('Change:      ' + data.Change);
				console.log('Change %:    ' + data.ChangeinPercent);
				console.log();
				console.log('Day Open     ' + data.Open);
				console.log('Day High     ' + data.DaysHigh);
				console.log('Day Low      ' + data.DaysLow);
				console.log('Volume:      ' + data.Volume);
				console.log('Day Avg Vol: ' + data.AverageDailyVolume);
				console.log('Year High:   ' + data.YearHigh);
				console.log('Year Low:    ' + data.YearLow);
				console.log('Market Cap:  ' + data.MarketCapitalization);
				console.log('');
			} catch (e) {
				console.log('[error] ' + e.message);
			}
		});
	});
	
	req.on('error', function(e) {
		console.log('[error] Internet Connection Issue; ' + e.message);
	});
	
	req.end();
} catch (e) {
	console.log('[error] ' + e.message);
}