/**
 * Created by i on 8/18/15.
 */
var hbs = require('hbs');

hbs.registerHelper('list',function(items,options){
    var out = "<div>";
    for(var i = 0, l = items.length;i<l;i++){
        out += "<div>" + options.fn(items[i]) + "</div>";
    }
    return out + "</div>";
});