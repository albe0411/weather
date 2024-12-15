function shownDateChange(a){
    if(location.href.split("/")[3] == ""){
        console.log(document.getElementById("date"))
        shownDate = new Date(document.getElementById("date").innerHTML.valueOf())
    }else{
        shownDate = new Date(location.href.split("/")[3])
    }
    shownDate = new Date(shownDate.setDate(eval(`shownDate.getDate() ${a} 1`)))
    location.href = `http://localhost:3000/${shownDate.toISOString().split("T")[0]}`
}