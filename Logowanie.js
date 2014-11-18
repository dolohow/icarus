function validate(){
var username = document.getElementById("username").value;
if ( username === "Pukasz"){
alert ("Login successfully");
window.location = 'Panel.html';
    return false;
    
}else{
    alert ("Seems like your ID was not found, click ok to try again");
    window.location = "MAIN.html";
    return false;

}
}