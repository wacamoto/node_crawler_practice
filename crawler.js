/**
 *  網站 唐立淇占星
 *  文章來源 http://www.astroinfo.com.tw/
 */

let fs = require("fs");
let sqlite3 = require("sqlite3").verbose();
let request = require("request");
let cheerio = require("cheerio");

let db = new sqlite3.Database('./sqlite.db');
db.serialize(function() {
    let sql = `
        create table if not exists article
        (
            url text,
            title text,
            time text,
            content text
        )
    `
    db.run(sql);
});

let start = 0;
let end = 1000;
let time = 400;
let articles = ["temp"];

let i = start;
let refreshIntervalId = setInterval(function() {

    let id = i;
    let url = 'http://www.astroinfo.com.tw/node/' + i;
    request({
        url: url,
        method: 'GET'
    }, function(e,r,b) {
        let $ = cheerio.load(b);
        let title_html = $('.page-title');
        let time_html = $('.field-name-field-star-article-showdate');
        let content_html = $('.field-type-text-with-summary');

        let title = $(title_html[0]).text();
        let time = $(time_html[0]).text();
        let content = $(content_html[0]).text();

        if(title == undefined || title == '找不到網頁') return;
        console.log('get id' + id + ':' + title);

        db.serialize(function() {
            db.run('insert into article(url, title, time, content) VALUES (?,?,?,?)',[url, title, time, content]);
        });
    });

    i++;
    if(i >= end) clearInterval(refreshIntervalId);
}, time);



module.exports = {};
