document.addEventListener('DOMContentLoaded', ()=>{
    updateCalendar(year)
})

let gamesOnServer
let datedGames      =   [];
let undetedGames    =   [];
let findYear 

function $(element){
    return document.querySelector(element)
}



function updateCalendar(ano){
    $("#load").style.display = "flex"
    findYear = ano
    fetch(`http://localhost:${process.env.PORT}/api/promotions/${ano}`).then(res=>{
        return res.json()
    }).then(json => {
        gamesOnServer = json
        sort(gamesOnServer)
        
    })
}


function sort(obj){
    Object.keys(obj).forEach(game=>{
    if(game != "update"){        
        if(obj[game].date){
            if(obj[game].date != 'undefined'){
                datedGames.push({"name": game, "date": obj[game].date})
            }  
        } else {
            undetedGames.push(game)
        }}
    })

    updateNavbar()
    initCalendar()
}

function updateNavbar(){
    $("#undetedGamesList").innerHTML = ""
    undetedGames.forEach(game=>{
        $("#undetedGamesList").innerHTML += `<li>${game} <input type="button" onclick="searchDate('${game}')" value="Buscar a data"></li>` 
    })
}

function searchDate(game){
    $("#load").style.display = "flex"
    fetch(`http://${process.env.PORT}/api/searchDate/${game}`).then(res=>{
        return res.json()
    }).then(json => {
        showModal(json)
    })
}

function showModal(obj){
    $("#load").style.display = "none"
    let dateFormated = formateDate(obj.data)
    if(obj.data != "data não encontrada"){
        $("#containerModal").style.display = "flex"
        $("#contentModal>h1").innerHTML = `${obj.jogo} é desse de ${dateFormated}` 
        $("#contentInputs").innerHTML = `
            <input type="button" onclick="updateFile('${obj.jogo}', '${dateFormated}')" value="Atualizar a Data">
            <input type="button" onclick="add('${obj.jogo}')" value="Atualizar a Data Manualmente">
            <input type="button" onclick="updateFile('${obj.jogo}', 'undefined')" value="Descartar esse jogo">
            `
    }
}

function add(nameOfGame){
    $('#containerModalManu').style.display = "flex"
    $('#nameOfGame').value = nameOfGame
    $('#dateOfGameManu').min = `${year}-01-01`
    $('#dateOfGameManu').max = `${year}-12-31`
}

function saved(){
    let dateOfGameManu = ($('#dateOfGameManu').value).split("-")
    updateFile($('#nameOfGame').value, `${dateOfGameManu[2]}/${dateOfGameManu[1]}/${dateOfGameManu[0]}`)
}

function updateFile(gameName, gameDate){
    fetch(`http://${process.env.PORT}/api/updateDate?name=${gameName}&date=${gameDate}&ano=${year}`).then(res=>{
        return res.json()
    }).then(json => {
        console.log(json)
        if(json.status == "Item Salvo"){
            location.reload()
        } else {
            alert("algo deu de errado")
        }
    })
}

function formateDate(date){
    let dateShort = date.split(" ")
    let dia = dateShort[0]
    let mes
    
    switch (dateShort[2]) {
        case "janeiro": mes = 1; break;
        case "fevereiro": mes = 2; break;
        case "março": mes = 3; break;
        case "abril": mes = 4; break;
        case "maio": mes = 5; break;
        case "junho": mes = 6; break;
        case "julho": mes = 7; break;
        case "agosto": mes = 8; break;
        case "setembro": mes = 9; break;
        case "outubro": mes = 10; break;
        case "novembro": mes = 11; break;
        case "dezembro": mes = 12; break;
        default: mes = 0; break;
    }
    





    let ano = dateShort[4]
    return (dia+"/"+mes+"/"+ano)

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

function hideModal(e){
    if(e.target.id == "containerModal"){
        $("#containerModal").style.display = "none"
    }
    if(e.target.id == "containerModalManu"){
        $("#containerModalManu").style.display = "none"
    }
}

$("#layerOfNavBar").addEventListener("click", hideNavBar)
$("#closeNavbarButton").addEventListener("click", hideNavBar)
$("#containerModal").addEventListener("click", hideModal)
$("#containerModalManu").addEventListener("click", hideModal)
