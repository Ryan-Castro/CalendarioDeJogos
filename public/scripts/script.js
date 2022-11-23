document.addEventListener('DOMContentLoaded', ()=>{
    updatePromotions()
})

let gamesOnServer

function $(element){
    return document.querySelector(element)
}

function updatePromotions(){

    fetch('http://localhost:3000/api/promotions/2019').then(res=>{
        return res.json()
    }).then(json => {
        
    })
}

function showNavBar(){
    $("nav").style.marginLeft = "0vw"
    $("#layerOfNavBar").style.visibility = "visible"
}

function hideNavBar(){
    $("nav").style.marginLeft = "-41vw"
    $("#layerOfNavBar").style.visibility = "hidden"

}