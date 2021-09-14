const port = process.env.PORT || 4000;

const io = require("socket.io")(port, {
    cors: {
        origin: '*',
    }
});

let scubas = [];

io.on('connection', (socket) => {
    console.log(`user: ${socket.id} - connected`);

    socket.emit('scubas', scubas);

    socket.on('newUrl', (user, url) => {
        // console.log(data);

        let scubaUser = scubas.find(scuba => scuba.id === socket.id);

        if(scubaUser){
            scubaUser.url = url;
        }
        
        else {
            scubas.push({ id: socket.id, name: user, url: url });
        }
        
        // console.log(scubas);
        io.emit('scubas', scubas);  
    })

    socket.on('getScubas', () =>{
        socket.emit('scubas', scubas);
        setTimeout(() => {
            socket.emit('scubas', scubas);
        }, 1500);
    })

    socket.on('disconnect', () => {
        // remove object from array scubas
        let scubaUser = scubas.find(scuba => scuba.id === socket.id);
        scubas.splice(scubas.indexOf(scubaUser), 1);
        io.emit('scubas', scubas);
        console.log('user disconnected');
    });
});
