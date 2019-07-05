const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringigy/lib/sync');
const fs = require('fs');
const puppeteer = require('puppeteer');

const csv = fs.readFileSync('csv/data.csv');
const records = parse(csv.toString('utf-8')); // 2차원 배열

const crawler = async () => { // async가 있는 곳에 try, catch 를 적용해야한다.
    const result = [];
    try {
        // const browser = await puppeteer.launch({ headless: false }); // 개발환경용으로 브라우저가 보이도록 한다.
        const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === 'production' }); // 배포환경에서만 headless: true
        await Promise.all(records.map(async (r, i) => {
            try {
                const page = await browser.newPage();
                await page.goto(r[1]); // 페이지를 띄운다
                const scoreEl = await page.$('.score.score_left .star_score');
                if (scoreEl) {
                    const text = await page.evaluate(tag => tag.textContent, scoreEl);
                    console.log(r[0], '평점', text.trim());
                    result.push([r[0], r[1], text.trim()]);
                }
                await page.waitFor(3000);
                await page.close();
                const str = stringify(result);
                fs.writeFileSync('csv/result.csv', str);
            } catch (e) {
                console.error(e);
            }
            
        }));      
        await browser.close();
    } catch (e) {
        console.error(e);
    }    
};

crawler();