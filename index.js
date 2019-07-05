// const parse = require('csv-parse/lib/sync'); // 특정파일 로드
// const fs = require('fs');
const xlsx = require('xlsx');
const axios = require('axios'); // ajax 라이브러리
const cheerio = require('cheerio'); // html 파싱
const add_to_sheet = require('./add_to_sheet');

/* csv 파일 파싱
const csv = fs.readFileSync('./csv/data.csv'); // 형식이 버퍼로 되어있음
//console.log(csv.toString('utf-8')); // 버퍼형식의 인코딩을 utf-8 문자 형식으로 변환
const records = parse(csv.toString('utf-8')); // 문자열을 2차원 배열로 변환
records.forEach((r, i) => {
    console.log(i, r); // r[0] : 영화제목, r[1] : 영화링크
});
*/


// 엑셀 파싱
const workbook = xlsx.readFile('xlsx/data.xlsx');
// console.log(workbook);
// console.log(Object.keys(workbook.Sheets)); // 엑셀시트 목록(탭) 가져오기
const ws = workbook.Sheets.영화목록;
// console.log(workbook.Sheets.영화목록);

const records = xlsx.utils.sheet_to_json(ws); // 엑셀시트 내용을 json 형태로 변환
// const records = xlsx.utils.sheet_to_json(ws, { header: 'A'});
// records.shift(); // 배열의 첫번째 건너뛰기
// console.log(ws['!ref']); // 엑셀쉬트의 A1:B2.. 블록범위
// ws['!ref'] = ws['!ref'].split(':').map((v, i) => {
//     if (i === 0 ) {
//         return 'A2';
//     }
//     return v;
// }).join(':');
// ws['!ref'] = 'A2:B11';
// const records = xlsx.utils.sheet_to_json(ws, { header: 'A'});
// // console.log(workbook.SheetNames);
// // for (const name of workbook.SheetNames) {
// //     const ws = workbook.Sheets[name];
// //     // 시트별로 따로 코딩
// // }
// console.log(records);

// records.forEach((r, i) => {
//     console.log(i, r.제목, r.링크);
// });

// for (const [i, r] of records.entries()) {
//     console.log(i, r.제목, r.링크);
// }


/* axios + cheerio 크롤링 */
const crawler = async () => {
    add_to_sheet(ws, 'C1', 's', '평점');
    for (const [i, r] of records.entries()) { // 결과가 순서를 보장하도록 개선, 속도가 느림
        const response = await axios.get(r.링크);
        if (response.status === 200) { // 응답이 성공한 경우
            const html = response.data;
            // console.log(html);
            const $ = cheerio.load(html); // cheerio를 통해 태그를 찾을 수 있음
            const text = $('.score.score_left .star_score').text();
            console.log(r.제목, '평점', text.trim());
            const newCell = 'C' + (i + 2);
            add_to_sheet(ws, newCell, 'n', parseFloat(text.trim()));
        }
    }
    xlsx.writeFile(workbook, 'xlsx/result.xlsx');
    // await Promise.all(records.map(async (r) => { // 결과의 순서를 보장하지 않음, 속도가 빠름
    //     const response = await axios.get(r.링크);
    //     if (response.status === 200) { // 응답이 성공한 경우
    //         const html = response.data;
    //         // console.log(html);
    //         const $ = cheerio.load(html); // cheerio를 통해 태그를 찾을 수 있음
    //         const text = $('.score.score_left .star_score').text();
    //         console.log(r.제목, '평점', text.trim());
    //     }
    // }));
};

crawler();
