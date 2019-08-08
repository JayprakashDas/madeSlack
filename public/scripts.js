// const socket = io('http://localhost:9000'); 

const username = prompt("Please enter your Name")

const socket = io('https://slack-copy-2.herokuapp.com',{
    query:{
        username:username
    }
}); 
  

let nsSocket='';

socket.on('nsList',(nsData)=>{
    let namespaceDiv = document.querySelector('.namespaces');
    namespaceDiv.innerHTML="";
    nsData.forEach((ns) => {
        namespaceDiv.innerHTML +=`<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"></img></div>`
    });

    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        elem.addEventListener('click',(e)=>{
            const nsEndpoint = elem.getAttribute('ns');
            joinNS(nsEndpoint)
        })
    })

    joinNS('/wiki')

   
})




