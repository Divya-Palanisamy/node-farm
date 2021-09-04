const fs = require('fs');
const http = require('http');
const url = require('url');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const error = fs.readFileSync(`${__dirname}/templates/template-error.html`,'utf-8');


const replaceTemplate = (temp, prod) => {
    let op = temp.replace(/{%PRODUCTNAME%}/g, prod.productName);
    op = op.replace(/{%IMAGE%}/g, prod.image);
    op = op.replace(/{%FROM%}/g, prod.from);
    op = op.replace(/{%NUTRIENTS%}/g, prod.nutrients);
    op = op.replace(/{%PRICE%}/g, prod.price);
    op = op.replace(/{%DESCRIPTION%}/g, prod.description);
    op = op.replace(/{%QUANTITY%}/g, prod.quantity);
    op = op.replace(/{%ID%}/g, prod.id);

    if (!prod.organic) {
        op = op.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }

    return op;
}


const server = http.createServer((req, res) => {
    const {query, pathname}  = url.parse(req.url, true);
 
    if (pathname === '/' || pathname === '/overview') {

        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardsHtml = dataObject.map((ele) => replaceTemplate(card, ele)).join('');
        const op = overview.replace('{%CARD%}', cardsHtml);
        res.end(op);

    } else if (pathname === '/product') {

        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const prod = dataObject[query.id];
        const op = replaceTemplate(product, prod);
        res.end(op);

    } else if (pathname === '/api') {

        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

    } else {

        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end(error);
        
    }
});

server.listen(3000);