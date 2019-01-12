"use strict";
//node examples\js\balances.js
const ccxt = require('../../ccxt.js')
const asTable = require('as-table')
const log = require('ololog').configure({locate: false})

require('ansicolor').nice

let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

;
(async () => {

    // instantiate the exchange
    let poloniex = new ccxt.poloniex({// ... or new ccxt.gdax ()
        'apiKey': 'XB0CNQCW-T5XIA1ZC-2PES4I30-HHZL7XMV',
        'secret': '720b2759863ea9800b0d6f21d615e892895b549d3461775680fa009a49f1b99a0969f5153f7f48523cfed91bc0afac651527ca9122150689a43725e4ee485a7b'

    })
    let cointiger = new ccxt.cointiger({// ... or new ccxt.gdax ()
        'apiKey': 'd0f61780-154b-4e4f-b2da-c97742aaaa05', // standard
        'secret': 'NjQ0YjllYzFkZDhjZGQyZjRiMzcwNjljYzA5NjYyMzc2ZWE5ZjNjOGVmZDY1YTBkZjNjMzcyZDI4YWM4MzBiMw==',

    })
    let hitbtc = new ccxt.hitbtc({// ... or new ccxt.gdax ()
        'apiKey': 'ca19feb985a83f7b12fb9276d905fb68', // standard
        'secret': '183c72134c1a66e14fbe5fc85257ca59',

    })


    let pCurrence = await poloniex.fetchCurrencies('BTC');

    let balances = await hitbtc.fetchBalance();
    let maket = await hitbtc.fetchMarkets();
  //  log(hitbtc.name.green, 'maket', balances.BTC.free);
    //return;
    var coins = [];
    var phistoricoOrden = [];
    var pOrdenBook = [];


    //let ordemBook = await hitbtc.fetchOrderBook();

    //log(hitbtc.name.green, 'Buy',  Object.keys(ordemBook));
    // return;
    Object.keys(maket).forEach(function (item) {
        //console.log(item + " = " + obj[item]);
        if (maket[item]['active'] !== false) {
            coins.push(maket[item]['symbol']);
        }
    });
//log("'"+coins[0]+"'");
    //return;

    for (var i = 0; i < coins.length; i++) {

        try {

            var trade = await hitbtc.fetchTrades(coins[i]);
            var orden = await hitbtc.fetchOrderBook(coins[i]);
            phistoricoOrden.push(trade);
            pOrdenBook.push(orden);
        } catch (e) {

            if (e instanceof ccxt.DDoSProtection || e.message.includes('ECONNRESET')) {
                log.bright.yellow('[DDoS Protection] ' + e.message)
            } else if (e instanceof ccxt.RequestTimeout) {
                log.bright.yellow('[Request Timeout] ' + e.message)
            } else if (e instanceof ccxt.AuthenticationError) {
                log.bright.yellow('[Authentication Error] ' + e.message)
            } else if (e instanceof ccxt.ExchangeNotAvailable) {
                log.bright.yellow('[Exchange Not Available Error] ' + e.message)
            } else if (e instanceof ccxt.ExchangeError) {
                log.bright.yellow('[Exchange Error] ' + e.message)
            } else if (e instanceof ccxt.NetworkError) {
                log.bright.yellow('[Network Error] ' + e.message)
            } else {
                throw e;
            }
        }


    }

    log(hitbtc.name.green, 'Buy', pOrdenBook);
    //disabled delisted info
    return;
    var ordenAsks = 0;
    var ordenBids = 0;

    for (var i = 0; i < poloniexOrdenBook['bids'].length; i++) {
        var valorBids = parseFloat(poloniexOrdenBook['bids'][i][0]) * parseFloat(poloniexOrdenBook['bids'][i][1]);

        ordenBids = valorBids + ordenBids;
    }

    for (var i = 0; i < poloniexOrdenBook['asks'].length; i++) {
        var valorAsks = parseFloat(poloniexOrdenBook['asks'][i][0]) * parseFloat(poloniexOrdenBook['asks'][i][1]);

        ordenAsks = valorAsks + ordenAsks;
    }

    ////////////////

    var ordenBookbuy = 0;
    var ordenBookSell = 0;
    // output the result
    for (var i = 0; i < poloniexBalance.length; i++) {

        if (poloniexBalance[i]['info']['type'] == 'buy') {
            ordenBookbuy = parseFloat(poloniexBalance[i]['info']['total']) + parseFloat(ordenBookbuy);
        }
        if (poloniexBalance[i]['info']['type'] == 'sell') {
            ordenBookSell = parseFloat(poloniexBalance[i]['info']['total']) + parseFloat(ordenBookSell);
        }

        //log (poloniex.name.green, 'balance', poloniexBalance[i]['info'])
    }

    //total das ultimas 100 ordens de compras
    log('------    Ultimas compras execultadas   --------');
    log(poloniex.name.green, 'Buy', ordenBookbuy);
    //compras execultadas
    log('------    total das ultimas 100 ordens de compras   --------');
    log(poloniex.name.green, 'OrdenBookAsk', ordenAsks);
    //////////////////////////////////////////////////////
    // total das ultimas 100 ordens de vendas
    log('------    Ultimas vendas execultadas   --------');
    log(poloniex.name.red, 'Sell', ordenBookSell);
    //vendas execultadas
    log('------    total das ultimas 100 ordens de vendas   --------');
    log(poloniex.name.red, 'OrdenBookBids', ordenBids);





})()