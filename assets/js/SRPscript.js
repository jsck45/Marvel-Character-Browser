var id = ""

entry = "Sp"
if (entry!=="") {
    entry = "nameStartsWith=" + entry + "&"
}

let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
fetch (idscrapper)
.then(function (response) {
    response.json().then(function(data) {
        id = data.data.results[0].id 
        console.log(id)
        let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id +"/comics?ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
        fetch (comicscrapper)
        .then(function (response2) {
            response2.json().then(function(data) {
            console.log(data)
    })
    })
})})

/*
let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id +"/comics?ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
fetch (comicscrapper)
.then(function (response) {
    response.json().then(function(data) {
        console.log(data)
    })
})*/