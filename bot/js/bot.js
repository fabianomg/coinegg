"use strict";

const ccxt = require('../../ccxt.js');
const asTable = require('as-table');
const log = require('ololog').configure({locate: false});

require('ansicolor').nice;

let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {

    // instância o objeto poloniex que contem todas funções e etributos
    let poloniex = new ccxt.poloniex({
        'apiKey': 'XB0CNQCW-T5XIA1ZC-2PES4I30-HHZL7XMV',
        'secret': '720b2759863ea9800b0d6f21d615e892895b549d3461775680fa009a49f1b99a0969f5153f7f48523cfed91bc0afac651527ca9122150689a43725e4ee485a7b'

    });
	let coinegg = new ccxt.coinegg({
        'apiKey': '57x2m-w5fh7-1kaje-qz7yb-bccs5-wf77a-wc92k',
        'secret': 'OtJN/-$KT4p-zQjgZ-;X@],-)7~fp-13Itw-E]Svb'

    });
 


    try {

        // pega os mercados de moedas
       
        let maket = await poloniex.fetchMarkets();
		let fetchOrders = await coinegg.fetchOrders('ETH/BTC');
		//let cancelOrder = await coinegg.cancelOrder(fetchOrders[0]['id'],'ETH/BTC');
		
		let balance = await coinegg.fetchBalance();
		var t = 0.2;
		//let orden = await coinegg.createOrder('ETH/BTC','limit','sell',t,0.036);
		console.log(fetchOrders);
		return;


        // variaveis de amarzenamento

        var coins = [];               // variavel que fica com os sinbolos da moedas
        var mercadoBTC = [];     // marzenar o mercado de btc
        var mercadoETH = [];     // marzenar o mercado de eth
        var mercadoUSDT = [];   // marzenar o mercado de usdt
        var mercadoUSDC = [];   // marzenar o mercado de usdc
        var mercadoXMR = [];    // marzenar o mercado de xmr
        var indice = 0;              // indice splice para o array de mercado de moedas
        var buyBookBTC = [];     // amarzena  as ordens de compras do mercado btc
        var sellBookBTC = [];     // amarzena  as ordens de vendas do mercado btc

        // pegar a quantidade de moedas apitas a ser negociadas
        Object.keys(maket).forEach(function (item) {
            //console.log(item + " = " + obj[item]);
            if (maket[item]['active'] !== false) {
                coins.push(maket[item]['symbol']);
            }
        });
        // separa os mercados de moedas em btc, eth, usdt, usdc, xmr
        for (var i = 0; i < coins.length; i++) {


            if (coins[i].indexOf('/BTC') > -1) {
                mercadoBTC.splice(indice, 0, coins[i]);
            }
            if (coins[i].indexOf('/ETH') > -1) {
                mercadoETH.splice(indice, 0, coins[i]);
            }
            if (coins[i].indexOf('/USDT') > -1) {
                mercadoUSDT.splice(indice, 0, coins[i]);
            }
            if (coins[i].indexOf('/USDC') > -1) {
                mercadoUSDC.splice(indice, 0, coins[i]);
            }
            if (coins[i].indexOf('/XMR') > -1) {
                mercadoXMR.splice(indice, 0, coins[i]);
            }

            indice++;

        }
        
        //pegar a ordens do book de compras (buy) e vendas (sell) do mercadoBTC.
       for (var i = 0; i < mercadoBTC.length; i++){
           var book = await poloniex.fetchOrderBook(mercadoBTC[i]);
           sellBookBTC.splice(mercadoBTC[i],0,book.asks[0][0]);
           break;
      
       }
           


        log(poloniex.name.green, 'Market', sellBookBTC);

    } catch (e) {

        if (e instanceof ccxt.DDoSProtection || e.message.includes('ECONNRESET')) {
            log.bright.yellow('[DDoS Protection] ' + e.message);
        } else if (e instanceof ccxt.RequestTimeout) {
            log.bright.yellow('[Request Timeout] ' + e.message);
        } else if (e instanceof ccxt.AuthenticationError) {
            log.bright.yellow('[Authentication Error] ' + e.message);
        } else if (e instanceof ccxt.ExchangeNotAvailable) {
            log.bright.yellow('[Exchange Not Available Error] ' + e.message);
        } else if (e instanceof ccxt.ExchangeError) {
            log.bright.yellow('[Exchange Error] ' + e.message);
        } else if (e instanceof ccxt.NetworkError) {
            log.bright.yellow('[Network Error] ' + e.message);
        } else {
            throw e;
        }
    }

})();