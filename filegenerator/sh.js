const puppeteer = require('puppeteer-core');


const chromePath = process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : '/usr/bin/google-chrome';

function writeArrToFile(filename, arr) {
  var fs = require('fs');
  var stream = fs.createWriteStream(filename);
  stream.once('open', function(fd) {
    arr.map( line => stream.write(line+'\n'));
    stream.end();
  });
}

function extractItems() {
  const extractedElements = document.querySelectorAll('#boxes > div.box');
  const items = [];
  for (let element of extractedElements) {
    items.push(element.innerText);
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  scrollDelay = 1000,
) {
  try {
    await page.waitFor(scrollDelay);
    let previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
    await page.waitFor(scrollDelay);
  } catch (e) {
    console.log('an error happened', e)
  }
}

async function getUrls(page) {
  const imagesSelector = '.rg_di .rg_meta';
  try {
    await page.waitForSelector(imagesSelector);
    const imgsSrc = await page.evaluate((imagesSelector)=> {
      const wrappers = Array.from(document.querySelectorAll(imagesSelector));
      const imgSrcs= wrappers.map( wrap => JSON.parse(wrap.innerText).ou);
      return imgSrcs;
    }, imagesSelector);
    return imgsSrc;
  } catch(e) {
    console.log('Could not get images urls', e)
  }
}

async function setSearchText(page, selector, searchText) {
  try {
    await page.evaluate( (selector, searchText) => {
      const element = document.querySelector(selector);
      element.value = searchText;
    }, selector, searchText)
  } catch (e) {
    console.log('could not set search text', e);
  }
}


(async () => {
  
  const args = process.argv.map(function (val) {
    return val;
  });
  console.log(args)
  if(!args[2]) {
    console.log('Could not get input parameter');
    return;
  }

  const searchText = args[2];

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('https://images.google.com', { waitUntil: 'networkidle2' });

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  const searchSelector = 'input[class]';
  const searchButton = 'div#sbtc button';

  await page.waitFor(searchSelector);
  await setSearchText(page, searchSelector, searchText);
  await page.click(searchButton, { waitUntil: 'networkidle2' });
  await page.waitFor(5000);
  await scrapeInfiniteScrollItems(page, extractItems, 5000);
  const urls = await getUrls(page);
  console.log('Dimensions:', dimensions, urls);

  writeArrToFile(`../url_files/${searchText}_valid.txt`, urls.slice(0,10));
  writeArrToFile(`../url_files/${searchText}.txt`, urls.slice(10,urls.length));

  await browser.close();
})();


