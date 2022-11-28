let date = new Date
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Desembro"]
let monthCorrent = []
let year = date.getFullYear()
let month
function initCalendar(){
    updateYear(year)
    updateMonth(date.getMonth())
}

function prevYear(){
    $("#years div").style.marginLeft = "0%"
    setTimeout(()=>{
        let newYear = Number(document.querySelectorAll("#years h1")[1].innerText) - 1
        updateYear(newYear)
    }, 750)

}

function nextYear(){
    $("#years div").style.marginLeft = "-200%"
    setTimeout(()=>{
        let newYear = Number(document.querySelectorAll("#years h1")[1].innerText) + 1
        updateYear(newYear)
        }, 750)
        
}

function updateYear(ano){
    console.log(ano <= date.getFullYear())
    if(ano > 1977 && ano <= date.getFullYear()){
        document.querySelectorAll("#years h1")[1].innerText = ano
        $("#years div").style.transition = "none"
        $("#years div").style.marginLeft = "-100%"
        setTimeout(()=>{
            $("#years div").style.transition = ".5s"
            document.querySelectorAll("#years h1")[0].innerText = ano - 1
            document.querySelectorAll("#years h1")[2].innerText = ano + 1
            updateDays(ano, months.indexOf(document.querySelectorAll("#months h1")[1].innerText))
            if(findYear != ano){
                updateCalendar(ano)
            }
        },50)
    } else {
        alert("Ano não válido")
        $("#years div").style.marginLeft = "-100%"
    }
}

function updateMonth(mes){
    document.querySelectorAll("#months h1")[1].innerText = months[mes]
    $("#months div").style.transition = "none"
    $("#months div").style.marginLeft = "-100%"
    setTimeout(()=>{
        $("#months div").style.transition = ".5s"
        document.querySelectorAll("#months h1")[0].innerText = mes == 0 ? months[11] : months[mes - 1] 
        document.querySelectorAll("#months h1")[2].innerText = mes == 11 ? months[0] : months[mes + 1] 
    },50)
    updateDays(document.querySelectorAll("#years h1")[1].innerText, mes)
}

function prevMonth(){
    $("#load").style.display = "flex"
    $("#months div").style.marginLeft = "0%"
    setTimeout(()=>{
        if(months.indexOf(document.querySelectorAll("#months h1")[1].innerText) == 0){
            updateMonth(11)
            prevYear(Number(document.querySelectorAll("#years h1")[1].innerText)-1)
        } else {
            let newMonth = months.indexOf(document.querySelectorAll("#months h1")[1].innerText) - 1
            updateMonth(newMonth)
        }
    }, 750)
}

function nextMonth(){
    $("#load").style.display = "flex"
    $("#months div").style.marginLeft = "-200%"
    setTimeout(()=>{
        if(months.indexOf(document.querySelectorAll("#months h1")[1].innerText) == 11){
            updateMonth(0)
            nextYear(Number(document.querySelectorAll("#years h1")[1].innerText) + 1)
        } else {
            let newMonth = months.indexOf(document.querySelectorAll("#months h1")[1].innerText) + 1
            updateMonth(newMonth)
        }
    }, 750)
}

function updateDays(yearP, monthP){
    year = yearP
    month = monthP
    date.setFullYear(yearP)
    date.setMonth(monthP + 1)
    date.setDate(0)
    let daysOfMonth = date.getDate()
    monthCorrent = []
    for(let i = 1; i <= daysOfMonth; i++){
        date.setMonth(month)
        date.setDate(i)
        monthCorrent.push([date.getDate(), date.getDay()])
    }
    createWeeks(month)
    sortCalendar()
    date.setMonth(monthP)
}

function createWeeks(month){
    date.setDate(0)
    let cont = 8 - monthCorrent[0][1]
    let lC 
    let b = 1
    for(let w = 1; w < 7; w++){
        $(`#w${w}`).innerHTML = ""
        if(w==1){
            for(let d = -monthCorrent[0][1]+1; d < cont; d++){
                if(d<1){
                    $(`#w${w}`).innerHTML += `<div class="dayM">${date.getDate() + d}</div>`
                } else {
                    $(`#w${w}`).innerHTML += `<div class="day d${monthCorrent[d-1][0]}">${monthCorrent[d-1][0]}</div>`
                    lC = d
                }
            }
        }else{
            for(let d = 0; d < 7; d++){
                if(monthCorrent.length != lC){
                    $(`#w${w}`).innerHTML += `<div class="day d${monthCorrent[lC][0]}">${monthCorrent[lC][0]}</div>`
                    lC++
                }else{
                    date.setMonth(month + 1)
                    date.setDate(b)
                    $(`#w${w}`).innerHTML += `<div class="dayM">${b}</div>`
                    b++
                }
            }
        }
    }
}

function sortCalendar(){
    datedGames.forEach(game=>{
        
        let dismemberDate = game.date.split("/")
        if(dismemberDate[1] == month+1){
            document.querySelector(`.d${Number(dismemberDate[0])}`).innerHTML += `<p>${game.name}</p>`
        }
    })
    document.querySelector("#load").style.display = "none"
}