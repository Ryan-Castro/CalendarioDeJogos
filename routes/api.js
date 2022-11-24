const express = require('express');
const router = express.Router()
const puppeteer = require('puppeteer');
const fs = require("fs")
const date = new Date

async function getPromotions(ano){
    

    async function getgames(page, selector){
        const promotions = await page.$$eval(selector, links => links.map(link => link.innerText))
        return promotions
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://jogorama.com.br/jogos/lancados-em-${ano}/`);

    const games = await getgames(page, '#colunacentral .lista a')
    let itens

    function getGamesFile(){
        let promiseGet = new Promise(function (resolve, reject){
            fs.readFile(`./files/gamesOf${ano}.txt`, 'UTF8', async (error, data)=>{
                if(error){throw error}
                itens = await JSON.parse(data)
                if(itens)(
                    setTimeout(()=>{resolve()},4000)
                )
            })
        })
        return promiseGet
    }


    function metch(game){
        let promoseMetch = new Promise(function (resolve, reject){
            if(itens[game]){   
                resolve()  
            } else {
                itens[game] = {}
                fs.writeFile(`./files/gamesOf${ano}.txt`, JSON.stringify(itens), (error)=>{
                    if(error){throw error}
                    setTimeout(()=>{ 
                        resolve()
                        itens = ""
                    },4000)
                })
            }
        })
        return promoseMetch
    }

    games.map(async game=>{
        
        await getGamesFile()
        await metch(game)
       
    })
    fs.readFile(`./files/gamesOf${ano}.txt`, 'UTF8', async (error, data)=>{
            itens = await JSON.parse(data)
            itens["update"] = date.toISOString().substring(0, 10)
            fs.writeFile(`./files/gamesOf${ano}.txt`, JSON.stringify(itens), (error)=>{})
        })

    await browser.close();
    return itens
}









router.get("/promotions/:ano", async(req, res)=>{
    
    if(fs.existsSync(`./files/gamesOf${req.params.ano}.txt`)){
        fs.readFile(`./files/gamesOf${req.params.ano}.txt`, 'UTF8', async (error, data)=>{
            itens = await JSON.parse(data)
            res.send(itens)
            if(itens["update"] != date.toISOString().substring(0, 10)){
                await getPromotions(req.params.ano)
            }
        })
        
    } else {
        res.send({"error": "ainda não existe"})
        fs.writeFile(`./files/gamesOf${req.params.ano}.txt`, "{}", (error)=>{
            if(error){
                throw error
            }else{
                console.log("item criado com sucesso")
                setTimeout(async () => {
                    await getPromotions(req.params.ano)
                }, 2000);
            }
        })
    }
    
})

router.get("/searchDate/:name", async(req, res)=>{

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.google.com.br/search?q=data de lançamento de ${req.params.name}`);
    const searchDate = await page.evaluate(()=>{
        return document.querySelector(".Z0LcW").innerText
    }).catch(async (error)=>{
        return "data não encontrada" 
    })



    res.send({  "stats": "foi porra",
                "jogo": `${searchDate}`                
})
    await browser.close();
})

module.exports = router
