async function downloadfunction(imageSrc , name) {
    console.log(imageSrc);
    console.log("Hello")
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

}

function viewfunction(ele){
    const view = ele.parentElement;
    const child = view.children[1];
    child.click();
}

function deletefunction(ele){
    const del= ele.parentElement;
    const child = del.children[2];
    child.click();
}

function tempAlert(msg,duration)
{
 var el = document.createElement("div");
 el.setAttribute("style","position:absolute;top:40%;left:20%;background-color:white;");
 el.innerHTML = msg;
 setTimeout(function(){
  el.parentNode.removeChild(el);
 },duration);
 document.body.appendChild(el);
}

function func(){
    console.log("hello i am from message function.....")
}