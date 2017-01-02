/**
 *  網站 marieclaire
 *  文章來源 http://www.marieclaire.com.tw/love-sex/astrology/
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

let links =[];
function getList() {
    let url = 'http://www.marieclaire.com.tw/channel/ajax_load_more';
    request({
        url: url,
        method: 'POST',
        formData: {
            nowRow: 0,
            addRow: 100,
            tree: 'love-sex',
            cate: 'astrology'
        }
    }, function(e,r,b) {
        let $ = cheerio.load(b);
        let link_tags = $('.title a');
        for(let i=0; i<link_tags.length; i++) {
            links.push('http://www.marieclaire.com.tw/' + $(link_tags[i]).attr('href'));
        }

        loadPage(links);
    });
}
getList();

function loadPage(links) {
    let end = links.length;
    let time = 400;
    let i = 0;
    let refreshIntervalId = setInterval(function() {
        let url = links[i];
        request({
            url: url,
            method: 'GET',
        }, function(e,r,b) {
            let $ = cheerio.load(b);
            let title_html = $('.breadcrumb');
            let content_html = $('.content_carousel .article p');
            let content = '';
            for(let i=0; i<content_html.length; i++) {
                content += $(content_html[i]).text();
            }
            let title = $(title_html).text();
            console.log('load:' + title);
            db.serialize(function() {
                db.run('insert into article(url, title, content) VALUES (?,?,?)',[url, title, content]);
            });
        });

        i++;
        if(i >= end) clearInterval(refreshIntervalId);
    }, time);
}
