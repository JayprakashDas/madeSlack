const express = require('express');
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

const namespaces = require('./data/namespaces');

io.on('connection',(socket)=>{
   let nsData = namespaces.map((ns)=>{
       return {
           img: ns.img,
           endpoint: ns.endpoint
       }
   })
   socket.emit('nsList',nsData)

})

namespaces.forEach((namespace)=>{
    io.of(namespace.endpoint).on('connection',(nsSocket)=>{

        const username = nsSocket.handshake.query.username;
        // console.log(`${socket.id} has sjoinded ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomtoJoin, numberOfuserCallback)=>{
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomTitle);
            nsSocket.join(roomtoJoin);
            //to get the number of client in the room
            // io.of('/wiki').in(roomtoJoin).clients((error,clients)=>{
            //     numberOfuserCallback(clients.length);
            // })

            const nsRoom = namespace.rooms.find(room =>{
                return room.roomTitle == roomtoJoin;
            })
            if(nsRoom){
                nsSocket.emit('historyCatchUp', nsRoom.history);
            }
            

            io.of(namespace.endpoint).in(roomtoJoin).clients((error,clients)=>{
                io.of(namespace.endpoint).in(roomtoJoin).emit('updateMembers',clients.length);
            })
           
        })
        nsSocket.on('newMesssageToServer',(msg)=>{
            const fullMsg = {
                text:msg,
                time: Date.now(),
                username:username,
                avatar:'https://via.placeholder.com/30'
            }
            //gives the room of the socekt//
            const roomTitle = Object.keys(nsSocket.rooms)[1];

            const nsRoom = namespace.rooms.find(room=>{
                return room.roomTitle == roomTitle;
            })

            if(nsRoom){
                nsRoom.addMessage(fullMsg);
            }
            
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
        })
    })
})
