function joinNS(endpoint){
    if(nsSocket){
        nsSocket.close();

        document.querySelector('#user-input').removeEventListener('submit', formSubmit);
    }
    nsSocket = io(`https://slack-copy-2.herokuapp.com${endpoint}`);
    nsSocket.on('nsRoomLoad',(nsRooms)=>{
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML='';

        nsRooms.forEach(room=>{
            let glyph;
            if(room.privateRoom){
                roomList.innerHTML+=`<li class="room"><span class="glyphicon glyphicon-lock "></span>${room.roomTitle}</li>`;
            }   
            else{
                roomList.innerHTML+=`<li class="room"><span class="glyphicon glyphicon-globe"></span>${room.roomTitle}</li>`;
            }  
        })

        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach(elem=>{
            elem.addEventListener('click',e=>{
                joinRoom(e.target.innerText)
            })
        })

       const topRoom =document.querySelector('.room')
       const topRoomName = topRoom.innerText;
         joinRoom(topRoomName);
    })
    
    nsSocket.on('messageToClients',(msg)=>{
        
        const time = new Date(msg.time).toLocaleTimeString();
        const formatTime = new Date('1970-01-01T' + time + 'Z')
        .toLocaleTimeString({},
            {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
        );
        document.querySelector('#messages').innerHTML += `
        <li>
            <div class="user-image">
                <img src="${msg.avatar}" />
            </div>
            <div class="user-message">
                <div class="user-name-time">${msg.username} <span>${formatTime}</span></div>
                <div class="message-text">${msg.text.text}</div>
            </div>
         </li>
        `;

        
    })

    document.querySelector('.message-form').addEventListener('submit',formSubmit)

}
function formSubmit(){
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    const frm = document.getElementById('user-input');
    nsSocket.emit('newMesssageToServer',{text: newMessage});
    frm.reset();
}
