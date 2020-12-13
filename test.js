const puppeteer = require('puppeteer');
var mysql = require('mysql');

// var pool = mysql.createPool({
//     host: '9.138.200.140',
//     user: 'root',
//     password: 'a42ba2d1e5@A',
//     database: 'PromotionDouyin'
// });
// if (process.env.NODE_ENV != 'production') {
var pool = mysql.createPool({
    host: 'db',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'students'
});
// }
const createTB = () => {
    return new Promise((res, rej) => {
        pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT NOT NULL AUTO_INCREMENT,
                date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                v0 INT NOT NULL,
                v1 INT NOT NULL,
                v2 INT NOT NULL,
                v3 INT NOT NULL,
                v4 INT NOT NULL,
                v5 INT NOT NULL,
                v6 INT NOT NULL,
                v7 INT NOT NULL,
                v8 INT NOT NULL,
                v9 INT NOT NULL,
                v10 INT NOT NULL,
                v11 INT NOT NULL,
                v12 INT NOT NULL,
                v13 INT NOT NULL,
                PRIMARY KEY (id)
            );
        `, (error, results, fields) => {
            console.log(error)
            console.log(results)
            res(results)
        })
    })
}
const writeDB = (v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13) => {
    return new Promise((res, rej) => {
        pool.query(`insert into votes (v0,v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
            [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13],
            function (error, results, fields) {
                if (error) {
                    console.log(error)
                    rej(error)
                }
                // console.log('The solution is: ', results);
                res(results)
            });
    })
}
const getVote = () => {
    return new Promise((res, rej) => {
        pool.query(`SELECT * FROM students.votes order by id desc limit 1;`,
            function (error, results, fields) {
                if (error) {
                    console.log(error)
                    rej(error)
                }
                // console.log('The solution is: ', results);
                res(results)
            });
    })
}
let delay = 1
const getCookie = async () => {
    console.log(new Date())
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // headless: false,
        ignoreDefaultArgs: ['--enable-automation']
    });
    const page = await browser.newPage();
    page.setViewport({
        width: 1200,
        height: 1000
    })
    let noChange = false
    page.on('response', async (response) => {
        try {
            if (/newappmsgvote/.test(response.url())) {
                let text = await response.text()
                let m = text.match(/voteInfo = (.+);/)
                let students = JSON.parse(m[1]).vote_subject[0].options
                console.log(students)
                await createTB()
                let last = await getVote()
                let votes = students.map(n => n.cnt)
                noChange = false
                if (last.length) {
                    noChange = votes.every((n, i) => n == last[0]['v' + i])
                }
                console.log('noChange', noChange)
                if (!noChange) {
                    await writeDB(...votes)
                }
            }
        } catch (error) {
            console.log('error', error)
        }
    });
    try {
        await page.goto('https://mp.weixin.qq.com/s/Rt6OUra7yu5IwcRTgKbrag');
    } catch (error) {

    }
    // await page.evaluateOnNewDocument(() => {
    //     const newProto = navigator.__proto__;
    //     delete newProto.webdriver;
    //     navigator.__proto__ = newProto;
    // });
    // await page.evaluate(() => {
    //     Object.defineProperty(navigator, 'webdriver', { get: () => false })
    // }, 7);
    // await page.click('body > div.header.header-new > div > div > a')
    // await page.click('#div_qrcode > div.login-code > ul > li:nth-child(2) > a')
    // await page.type('#js-phone-login > form > div:nth-child(1) > input[type=text]', '18021529227')
    // await page.type('#js-phone-login > form > div:nth-child(2) > input', 'feiguamm3')
    // await page.click('#js-phone-login > a.btn-login.js-account-logon')

    // const dragBlock = await page.waitForSelector('#nc_1_n1z');
    // const bounding_box = await dragBlock.boundingBox();
    // const end = await page.waitForSelector('.nc-lang-cnt');
    // const endinfo = await end.boundingBox();

    // await page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
    // await page.mouse.down();
    // for (var i = 0; i < endinfo.width; i += 1) {
    //     await page.mouse.move(bounding_box.x + i, bounding_box.y + bounding_box.height / 2);
    //     i += Math.floor(Math.random() * 6)
    // }
    // await page.mouse.up();
    // await page.waitForTimeout(2000);
    // await page.click('#js-phone-login > a.btn-login.js-account-logon')
    // await page.waitForTimeout(5000);

    // let cookies = await page._client.send('Network.getAllCookies');
    // console.log('dy.feigua.cn', cookies)
    // await writeDB('33333')
    // cookies = await page.cookies('feigua.cn')
    // console.log('.feigua.cn', cookies)
    // await writeDB(JSON.stringify(cookies.cookies))
    // console.log('success')
    // await page.waitForTimeout(300000);
    // await page.screenshot({ path: 'example.png' });
    await browser.close();
    setTimeout(getCookie, 2 * 1000)
    // if (!noChange) {
    //     delay = 1
    // } else {
    //     delay *= 2
    //     setTimeout(getCookie, 10 * 1000 * delay)
    // }
}
getCookie()
