function joinRoom(roomName){
    
    nsSocket.emit('joinRoom', roomName,(newNumberOfMember)=>{
        document.querySelector('.curr-room-num-users').innerHTML = `<span class="glyphicon glyphicon-user"></span> Online: ${newNumberOfMember}`
    });

    nsSocket.on('historyCatchUp', history=>{
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML='';
        history.forEach(msg=>{
            const currentMessages = messagesUl.innerHTML;
            const time = new Date(msg.time).toLocaleTimeString();
            const formatTime = new Date('1970-01-01T' + time + 'Z')
                .toLocaleTimeString({},
                    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
                );

            messagesUl.innerHTML = currentMessages + `
            <li>
                <div class="user-image">
                    <img src="${msg.avatar}" />
                </div>
                <div class="user-message">
                    <div class="user-name-time">${msg.username} <span>${formatTime}</span></div>
                    <div class="message-text">${msg.text.text}</div>
                </div>
            </li>`
        })
        messagesUl.scrollTo(0,messagesUl.scrollHeight);
    })

    nsSocket.on('updateMembers',(usernumbers)=>{
        document.querySelector('.curr-room-num-users').innerHTML = `<span class="glyphicon glyphicon-user"></span> Online: ${usernumbers}`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    })

    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input',(e)=>{
        // console.log(e.target.value)
        let messages = Array.from(document.getElementsByClassName('message-text'));
        // console.log(messages);
        messages.forEach((msg)=>{
            if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
                // the msg does not contain the user search term!
                msg.style.display = "none";
            }else{
                msg.style.display = "block"
            }
        })
    })
}