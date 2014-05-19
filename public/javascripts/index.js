(function(){
    "use strict";

    // 插入 <ul> 之 <li> 樣板
    var tmpl = '<li><input type="text" placeholder="New Task..."><span></span></li>',
        connected = $('ul.connected'),      // 三個 <ul>
        placeholder = $('#placeholder'),  // 三個 <ul> 的容器
        addButton = $('#add'),
        mainUL = $('ul.main'),              // main <ul>
        deleteUL = $('ul.delete'),          // delete <ul>
        doneUL = $('ul.done');              // done <ul>

    // make an <li> element with specified text
    var makeItem = function (text){
        var li = $(tmpl);
        if (text){
            li.find('input').val(text);
            li.find('span').text(text);
        }
        return li;
    };

    $.get("/items", {}, function(data, status){
        $.each(data, function(){
            var li = makeItem(this.text);
            if (this.done){
                li.addClass("is-done");
            }
            li.attr('title', this.id);
            li.prependTo(mainUL);
        });
    });
    

    mainUL.sortable({
        start: function(event, ui){
            placeholder.addClass('is-dragging');
        },
        stop: function(event, ui){
            placeholder.removeClass('is-dragging');
            var reqURL = '/items/' + ui.item.attr('title') + '/reposition/' + ui.item.index();
            console.log(reqURL);
            $.ajax({
                type: 'PUT',
                url: reqURL,
                success: function(data, status){
                    console.log(data);
                    console.log(status);
                }
            });
        },
        connectWith: "ul.connected",
        tolerance: "pointer"
    });

    deleteUL.sortable({
        receive: function(event, ui){
            console.log(ui.item.attr('title'));
            $.ajax({
                type: 'DELETE',
                url: '/items/' + ui.item.attr('title'),
                success: function(data, status){
                    console.log(status);
                }
            });
            ui.item.remove();
        },
        connectWith: "ul.connected",
        tolerance: "pointer"
    });

    doneUL.sortable({
        receive: function(event, ui){
            ui.item.addClass("is-done").appendTo(mainUL);
            $.ajax({
                type: 'PUT',
                url: '/items/' + ui.item.attr('title'),
                data: {done: true},
                success: function(data, status){
                    console.log(status);
                }
            });
        },
        connectWith: "ul.connected",
        tolerance: "pointer"
    });

    // event handlers
    addButton.click(function(){
        var li = $(".is-editing");
        if (li.length === 0){
            var li = makeItem().addClass('is-editing').prependTo(mainUL);
        }
        li.find('input').focus();
    });

    mainUL.on('keypress', 'input', function(e){
        var li;

        // when Enter is pressed, e.which === 13
        if (e.which === 13){
            // "this" is the <input>
            li = $(this).parents('li');
            if (li.find('input').val() === ""){
                return;
            }
            var txt = li.find('input').val();
            li.find('span').text(txt);
            li.removeClass('is-editing');

            $.ajax({
                type: 'POST',
                url: '/items',
                data: {done: false, text: txt},
                context: li,
                success: function(data, status){
                    console.log(data);
                    $(this).attr('title', data.id);
                },
                dataType: 'json'
            });
        }
    });
    
    function save(){
        var data = [];
        mainUL.find('li').each(function(){
            if ($(this).hasClass("is-editing")){
                return;
            }

            if ($(this).hasClass("is-done")){
                data.push({done: true,
                    text: $(this).find('span').text()});
            }
            else {
                data.push({done: false,
                    text: $(this).find('span').text()});
            }
        });
    }
}());

