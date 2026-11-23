const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const {pathToFileURL} = require('node:url');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core')); }
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('requestfailed',r=>errors.push(r.url()));
 await page.goto(pathToFileURL(path.resolve('dist/index.html')).href);
 const count=()=>page.locator('.board').count();
 const shots=path.resolve('../shots');fs.mkdirSync(shots,{recursive:true});
 const shot=name=>page.screenshot({path:path.join(shots,name+'.png')});
 assert.equal(await count(),3);await shot('01-shelf-best-fit');
 await page.click('#listed');assert.equal(await count(),4);await shot('02-list-order');
 await page.fill('#stock','1800');await page.fill('#parts','700, 650, 420, 420, 300, 300');
 assert.equal(await count(),0);
 await page.click('#plan');await page.click('#packed');assert.equal(await count(),2);
 await page.click('summary');await shot('03-custom-cut-list');
 await page.fill('#parts','1799');await page.click('#plan');assert.equal(await count(),0);
 await page.fill('#parts','1800');await page.click('#plan');assert.match(await page.locator('.board header').innerText(),/0 mm left/);
 await page.setViewportSize({width:390,height:844});await page.click('#demo');assert.equal(await count(),3);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.click('#listed');assert.equal(await count(),4);assert.deepEqual(errors,[]);
 console.log('PASS: demo, both layouts, custom cuts, kerf rejection, exact fit, mobile layout, browser errors and screenshots');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
