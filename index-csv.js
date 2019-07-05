const parse = require('csv-parse/lib/sync'); // 특정파일 로드
const fs = require('fs');

/* csv 파일 파싱 */
const csv = fs.readFileSync('./csv/data.csv'); // 형식이 버퍼로 되어있음
// console.log(csv.toString('utf-8')); // 버퍼형식의 인코딩을 utf-8 문자 형식으로 변환
const records = parse(csv.toString('utf-8')); // 문자열을 2차원 배열로 변환
records.forEach((r, i) => {
    console.log(i, r); // r[0] : 영화제목, r[1] : 영화링크
});


