const express = require('express');
const router = express.Router()
const puppeteer = require('puppeteer');
const fs = require("fs")

async function getPromotions(){
    

    async function getgames(page, selector){
        const promotions = await page.$$eval(selector, links => links.map(link => link.innerText))
        return promotions
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://jogorama.com.br/jogos/lancados-em-2022/');

    const games = await getgames(page, '#colunacentral .lista a')
    let itens
    games.forEach((game)=>{
        fs.readFile("./files/gamesOf2022.txt", 'UTF8', async (error, data)=>{
            if(error){throw error}
            itens =  await JSON.parse(data);
            if(itens[game]){
                
            } else {
                itens[game] = "{}"
                fs.writeFile("./files/gamesOf2022.txt", JSON.stringify(itens), (error)=>{
                    if(error){throw error}
                })
            }
        })
    })

    await browser.close();
    return itens
}

router.get("/promotions", async(req, res)=>{

    res.send(await getPromotions())
})

module.exports = router
