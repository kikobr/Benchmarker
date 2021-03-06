// ignore "(node:6982) ExperimentalWarning: The fs.promises API is experimental" warnings
process.removeAllListeners('warning');

const puppeteer = require('puppeteer');
const argv = require('minimist')(process.argv.slice(2));
const fs = require("fs");
const openExplorer = require('open-file-explorer');
var start = process.hrtime();

var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + "s " + (false ? elapsed.toFixed(precision) + "and ms - " : "") + note); // print message + time
    start = process.hrtime(); // reset the timer
}

let isHeadless = argv.headless ? true : false;
let isDesktop = argv.desktop || ((!argv.desktop && argv.mobile) ? false : true);
let isMobile = argv.mobile || false;
let folder = argv.folder || `${__dirname}/screenshots`;
let log = argv.log ? true : false;
let isShowingLists = argv.showLists ? true : false;
let isSettingList = argv.setList ? true : false;
let help = (argv.help || argv.h) ? true : false;


// check if folder exists. if not, create it.
try {
    if (!fs.existsSync(`${folder}`)) {
        fs.mkdirSync(folder);
    }
}
catch(e) {
    console.log("If this folder wasn't created, try creating it manually.", e)
}

let desktopDimensions = {
    width: 1440,
    height: 900
}
let mobileDimensions = {
    width: 375,
    height: 667
}
let viewports = [];
if(isDesktop) viewports.push(desktopDimensions);
if(isMobile) viewports.push(mobileDimensions);

let lists = require("./lists");

// use an explicit --search parameter, or the first string parameter or defaults to a mocked one
let search = argv.search || (argv._.length ? argv._[0] : null);
let queries = [];
if(search){
    search
        .replace(/, /g, ",")
        .split(",").forEach((query) => queries.push(query));
}
// let regexList = /\$\{(.*?)\}/;
let regexList = /\[\[(.*?)\]\]/;


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


let goToSiteAndPrint = async function(page, query, search){
    // await page.setUserAgent('UA-TEST');
    // await page.setUserAgent(`unique-${query}`);
    await page.setDefaultTimeout(0);
    await page.setViewport({
        width: viewports[0].width,
        height: viewports[0].height,
        deviceScaleFactor: 1,
    }),
    await page.goto(`https://google.com/search?q=${query}`);

    await Promise.all([
        page.click("#search #rso > [class=g] a"),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    // await page.setRequestInterception(true);
    // page.on('request', request => {
    //     if (request.isNavigationRequest() && request.redirectChain().length)
    //         request.abort();
    //     else
    //         request.continue();
    // });

    await page.evaluate(() => {
        // remove hardcoded heights
        document.querySelectorAll("[style*=height]").forEach((el)=> el.style.height = null);
    });

    // gera screenshots para cada variação de tela selecionada
    await asyncForEach(viewports, async (viewport) => {
        await Promise.all([
            console.log(`screenshot ${query} ${viewport.width}`),
            viewport.width != viewports[0].width ? page.setViewport({
                width: viewport.width,
                height: viewport.height,
                deviceScaleFactor: 1,
            }) : true,
            viewport.width != viewports[0].width ? page.reload() : false,
            viewport.width != viewports[0].width ? page.waitForNavigation({ waitUntil: 'networkidle2' }) : false,
            page.screenshot({
                path: `${folder}/${query}-${viewport.width}.png`,
                fullPage: true
            }),
        ])
    });
}

let runSearch = async () => {

    const args = isHeadless ? ["--proxy-server='direct://'", '--proxy-bypass-list=*'] : [];
    const browser = await puppeteer.launch({ headless: isHeadless, args: args });
    const page = await browser.newPage();
    if(isHeadless){
        // https://github.com/puppeteer/puppeteer/issues/1718#issuecomment-425618798
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    }

    await asyncForEach(queries, async (query) => {

        // Se o termo inputado contém um valor dinâmico, gera um array para cada permutação
        if(query.match(regexList)) {
            console.log(`dynamic query: ${query}`);
            let list = query.match(regexList)[1];
            if (!lists[list]){
                return console.log(`List [[${list}]] was not found. Check if you created it successfully inside lists.js or if this list is typed correctly.`)
            }
            // pega a lista dinâmica e permuta as variações
            await asyncForEach(lists[list], async (item) => {
                let newQuery = query.replace(regexList, item);
                await goToSiteAndPrint(page, newQuery, search);
            });
        } // Caso contrário, só printa o site
        else {
            await goToSiteAndPrint(page, query, search);
        }

    });

    elapsed_time("finished");
    await browser.close();
};

if(log) {
    console.log(process.execPath);
    console.log(__dirname);
}
if(help) {
    console.log(`
    The parameters you can use after benchmarker are: \n
        "text": search inputed text \n
        "[[ciaEn]]": search inputed text, injects list \n
        --search "text": search inputed text \n
        --folder ~/Desktop/screenshots: customizes screenshot folder \n
        --showLists: show lists.js folder to customize lists \n
        --setList "name=value 1, value 2, value 3": create a new list \n
        --desktop: screenshots in desktop viewport \n
        --mobile: screenshots in mobile viewport \n
        --headless: run browser in background
    `)
}
else if(isShowingLists) {
    console.log("Opening lists folder. Edit lists.js and then use them between brackets inside your search queries.");
    openExplorer(__dirname, err => {
        if(err) {
            console.log(`Error opening lists folder`, err);
        }
        else {
            //Do Something
        }
    });
}
else if (isSettingList){
    let newList = argv.setList;
    let newListName = newList.split("=")[0];
    let newListValues = newList.split("=")[1].replace(/, /g,",").split(",");

    let listsCopy = JSON.parse(JSON.stringify(lists));
    listsCopy[newListName] = newListValues;

    try {
        fs.writeFile(`${__dirname}/lists.js`, `module.exports = ${JSON.stringify(listsCopy, null, "\t")}`, (err, data)=>{
            console.log("Lists.js updated successfully.");
        });
    } catch (error) {
        console.log("Error writing to Lists.js. Try editing it manually.");
        console.log(error);
        openExplorer(__dirname, err => {});
    }
}
else if(search) {
    runSearch();
}
else console.log(`You are not searching for anything yet. Try something like 'benchmarker "baggage information [[ciaEn]]"'`);
