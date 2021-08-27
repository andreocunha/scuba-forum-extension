const port = process.env.PORT || 4000;

const io = require("socket.io")(port, {
    cors: {
        origin: '*',
    }
});

let scubas = [];

io.on('connection', (socket) => {
    console.log(`user: ${socket.id} - connected`);

    socket.emit('info', scubas);

    socket.on('newTab', (user, url) => {
        // console.log(data);

        let scubaUser = scubas.find(scuba => scuba.id === socket.id);

        if(scubaUser){
            scubaUser.url = url;
        }
        
        else {
            scubas.push({ id: socket.id, name: user, url: url });
        }
        
        console.log(scubas);
        io.emit('info', scubas);  
    })

    socket.on('getInfo', () =>{
        setInterval(() => {
            socket.emit('info', scubas);
        }, 1500);
    })

    socket.on('disconnect', () => {
        // remove object from array scubas
        let scubaUser = scubas.find(scuba => scuba.id === socket.id);
        scubas.splice(scubas.indexOf(scubaUser), 1);
        io.emit('info', scubas);
        console.log('user disconnected');
    });
});