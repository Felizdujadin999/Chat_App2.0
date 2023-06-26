const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
const messageRoute = require("./routes/MessagesRoute");

const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

const dbConnection = async () => {
    try{
    const connection = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connection successful${connection.connection.host}`)
    }catch(e){
        {console.log(`error:${e.message}`)};
        process.exit()
    }
    
    // .then(()=> {
    //     console.log("DB Conncetion Successfull")
    // })
    // .catch((err)=> {
    //     console.log(err.message)
    // });

}

const server = app.listen(process.env.PORT, ()=>{
     console.log(`server started on Port ${process.env.PORT}`)
})

dbConnection();

const io = socket(server, {
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })
})