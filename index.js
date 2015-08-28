var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var items = require('./controllers/items');

/*
 * 把public資料夾下的所有東西expose出來給app，當Browser要找靜態檔案的時候，
 * 會先從此資料夾底下開始找（所以我們把index.html放在這底下）
 */

app.use(express.static('./public'));

app.use(bodyParser());

app.get('/items', items.list);

app.post('/items', items.create);

app.put('/items/:id', items.update);

app.put('/items/:id/reposition/:new_position', items.reposition);

app.delete('/items/:id', items.delete);

app.listen(5000, function(){ console.log('Express server started at port 5000'); });
