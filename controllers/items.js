var fs = require('fs');
var itemsFile = "lists.json";

if (!fs.existsSync(itemsFile)){
    fs.writeFileSync(itemsFile, JSON.stringify({next_id: 1, items: []}));
}
var data = JSON.parse(fs.readFileSync(itemsFile));
//var next_id = data.next_id;
//var items = data.items;

// GET /items
exports.list = function(req, res){
    console.log(data);
    // res.json([{
    //   text: 'Example TODOLIST',
    //   isDone: false
    // }]);
    res.json(data.items);
};

// POST /items
exports.create = function(req, res){
    var newTodo = req.body;
    newTodo.done = (newTodo.done === "true")? true: false;
    newTodo.id = data.next_id;
    data.next_id++;
    data.items.push(newTodo);
    fs.writeFileSync(itemsFile, JSON.stringify(data));
    res.json(newTodo);
    console.log(data);
};

// PUT /items/:id
exports.update = function(req, res){
    var newTodoId = parseInt(req.param('id'));
    var newTodo = req.body;
    newTodo.done = (newTodo.done === "true")? true: false;
    newTodo.id = newTodoId;
    data.items.forEach(function(element, idx, array){
        if (element.id === this.id && element.done !== this.done){
            element.done = this.done;
            array.splice(idx, 1);
            array.splice(0, 0, element);
        }
    }, newTodo);
    fs.writeFileSync(itemsFile, JSON.stringify(data));
    res.json(newTodo);
    console.log(data);
};

// PUT /items/:id/reposition/:new_position
exports.reposition = function(req, res){
    var repTodoId = parseInt(req.param('id'));
    var newPosition = data.items.length - parseInt(req.param('new_position')) - 1;
    data.items.forEach(function(element, idx, array){
        if (element.id === this.id && idx !== this.newIdx){
            array.splice(idx, 1);
            array.splice(this.newIdx, 0, element);
        }
    }, {id: repTodoId, newIdx: newPosition});
    fs.writeFileSync(itemsFile, JSON.stringify(data));
    res.json({id: repTodoId, newIdx: newPosition});
    console.log(data);
};

// DELETE /items/:id
exports.delete = function(req, res){
    var delTodoId = parseInt(req.param('id'));
    data.items = data.items.filter(function(element){
        return (element.id !== delTodoId);
    });
    fs.writeFileSync(itemsFile, JSON.stringify(data));
    res.json(data.items);
    console.log(data);
};
