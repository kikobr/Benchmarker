const puppeteer = require('puppeteer');
const fullPageScreenshot = require("puppeteer-full-page-screenshot").default;

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

console.log(fullPageScreenshot)

const terms = [
    "azul linhas",
    // "latam linhas aéreas",
    // "gol linhas aéreas",
    // "british airways"
];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
    });

    // await page.setUserAgent('UA-TEST');
    await page.setUserAgent('uniqueKiko1');

    await asyncForEach(terms, async (term) => {
        await page.goto('https://google.com');
        await page.type('input[name="q"]', term);
        await page.click('[name="btnI"]');
        // tentar pegar primeiro resultado
        await page.waitForNavigation({
            waitUntil: 'networkidle2'
        });

        await asyncForEach([1440, 375], async (size) => {
            await page.setViewport({
                width: size,
                height: 900,
                deviceScaleFactor: 1
            });
            await page.reload({ waitUntil: "networkidle2" });

            // await fullPageScreenshot(page, { path: `screenshots/${term} ${size}.png` });

            // await page.screenshot({
            //     path: `screenshots/${term} ${size}.png`,
            //     fullPage: true
            // });

            const bodyHandle = await page.$('html');
            const { width, height } = await bodyHandle.boundingBox();
            console.log(width, height);
            await page.evaluate((width, height) => {
                document.querySelector('body').style.height = `auto`;
            });
            const screenshot = await page.screenshot({
                clip: {
                    x: 0,
                    y: 0,
                    width,
                    height
                },
                type: 'png',
                path: `screenshots/${term} ${size}.png`,
            });
            await bodyHandle.dispose();

        });
    })

    await browser.close();
})();
