document.addEventListener('DOMContentLoaded', ()=>{
    updatePromotions()
})

function updatePromotions(){

    fetch('http://localhost:3000/api/promotions').then(res=>{
        return res.json()
    }).then(json => {
        console.log(json)
    })
}