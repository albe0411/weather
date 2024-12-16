function shownDateChange(a){
    if(location.href.split("/")[3] == ""){
        shownDate = new Date(document.getElementById("date").innerHTML.valueOf())
    }else{
        shownDate = new Date(location.href.split("/")[3])
    }
    shownDate = new Date(shownDate.setDate(eval(`shownDate.getDate() ${a} 1`)))
    if(location.href.endsWith("3000")){
        location.href = `${location.href}${shownDate.toISOString().split("T")[0]}`
    }else{
        location.href = `${location.href.slice(0, -10)}${shownDate.toISOString().split("T")[0]}`
    }
}