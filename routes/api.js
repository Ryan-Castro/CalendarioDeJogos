const express = require('express');
const router = express.Router()
const puppeteer = require('puppeteer');

async function getPromotions(){
    

    async function loadMore(page,selector){
        const moreButton = await page.$(selector)
        if(moreButton){
            
            console.log("more")
            await moreButton.click()
            await page.waitForSelector(selector, {timeout: 5000}).catch(()=>{console.log("timeout")})
            await loadMore(page, selector)
        }
    }

    async function autoScroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
    
                    if(totalHeight >= scrollHeight - window.innerHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }
    

    async function getgame(page, selector){
        const promotions = await page.$$eval(selector, links => links.map(link => link.innerText))
        return promotions
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://store.steampowered.com/specials');
    await autoScroll(page)

    await loadMore(page, ".saleitembrowser_ShowContentsButton_3d9cK")
    const promotions = await getgame(page, '.salepreviewwidgets_SaleItemBrowserRow_y9MSd .salepreviewwidgets_TitleCtn_1F4bc a')
    

    await browser.close();
    return promotions
}

router.get("/promotions", (req, res)=>{

    res.send(getPromotions())
})

module.exports = router
