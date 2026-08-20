const puppeteer = require('puppeteer');
const path = require('path');
(async ()=>{
  try{
    const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    const htmlPath = path.resolve(__dirname, '..', 'component-tree.html');
    const fileUrl = 'file://' + htmlPath.replace(/\\\\/g, '/');
    await page.goto(fileUrl, {waitUntil: 'networkidle0'});
    const pdfPath = path.resolve(__dirname, '..', 'component-tree.pdf');
    await page.pdf({path: pdfPath, format: 'A4', printBackground: true});
    await browser.close();
    console.log('PDF generated at:', pdfPath);
  }catch(err){
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
})();
