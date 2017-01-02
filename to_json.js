let fs = require("fs");
let bfj = require('bfj');
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
    bfj.write('data/data.json', data, {space: 4});
}
