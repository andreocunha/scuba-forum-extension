const port = process.env.PORT || 4000;

const io = require("socket.io")( port, {
    cors: {
        origin: "*"
    }
});


let scubas = [];


io.on('connection', (socket) => {
    console.log('user: ' + socket.id + ' - connected');

    socket.on('newUrl', (user, url) => {
        let scubaUser = scubas.find(scuba => scuba.id === socket.id);

        if(scubaUser){
            scubaUser.url = url;
        }
        else {
            scubas.push({ id: socket.id, name: user, url: url });
        }

        console.log(scubas)
        io.emit('scubas', scubas);
    })

    socket.on('disconnect', () => {
        console.log('user: ' + socket.id + ' - disconnected');
        let scubaUser = scubas.find(scuba => scuba.id === socket.id);
        scubas.splice(scubas.indexOf(scubaUser), 1);
    })
})