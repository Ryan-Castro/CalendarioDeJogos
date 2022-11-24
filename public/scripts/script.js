document.addEventListener('DOMContentLoaded', ()=>{
    updatePromotions()
})

let gamesOnServer
let datedGames      =   []
let undetedGames    =   []

function $(element){
    return document.querySelector(element)
}



function updatePromotions(){

    fetch('http://localhost:3000/api/promotions/2017').then(res=>{
        return res.json()
    }).then(json => {
        gamesOnServer = json
        sort(gamesOnServer)
    })
}


function sort(obj){
    Object.keys(obj).forEach(game=>{
        if(obj[game].data){
            datedGames.push({"name": game, "date": obj[game].data})
        } else {
            undetedGames.push(game)
        }
    })

    updateNavbar()
}

function updateNavbar(){
    $("#undetedGamesList").innerHTML = ""
    undetedGames.forEach(game=>{
        $("#undetedGamesList").innerHTML += `<li>${game} <input type="button" onclick="searchDate('${game}')" value="Buscar a data"></li>` 
    })
}

function searchDate(game){
    fetch(`http://localhost:3000/api/searchDate/${game}`).then(res=>{
        return res.json()
    }).then(json => {
        console.log(json.jogo)
    })
}


function showNavBar(){
    $("nav").style.marginLeft = "0vw"
    $("#layerOfNavBar").style.visibility = "visible"
}

function hideNavBar(e){
    if(e.target.id == "layerOfNavBar" || e.target.id == "closeNavbarButton"){
        $("nav").style.marginLeft = "-41vw"
        $("#layerOfNavBar").style.visibility = "hidden"
    }
}

$("#layerOfNavBar").addEventListener("click", hideNavBar)
$("#closeNavbarButton").addEventListener("click", hideNavBar)
