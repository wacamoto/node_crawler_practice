let fs = require("fs");
let json2csv = require('json2csv');
let sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database('./sqlite.db');
let data = [];

db.each('select * from article', gen_json, complete);
function gen_json(err, row) {
    data.push({
        title: row.title,
        time: row.time,
        content: row.content,
        url: row.url
    });
}
function complete() {
    let fields = ['title', 'time', 'content', 'url'];
    let csv = json2csv({ data: data, fields: fields });
    console.log(csv);
    fs.writeFile('data/data.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
}
