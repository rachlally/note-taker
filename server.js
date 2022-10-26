//Server Code
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { get } = require("http");
const PORT = process.env.PORT || 3000;

app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//What listening
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"))
})

app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get('/api/notes',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"Whoops!",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
})

app.post('/api/notes',(req,res)=>{
    fs.readFile('./db/db.json','utf-8',(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"Whoops!",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            dataArr.push(req.body);
            fs.writeFile('./db/db.json',JSON.stringify(dataArr,null,4),(err,data)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        msg:"Whoops!",
                        err:err
                    })
                } else {
                    res.json({
                        msg:"Successfully Added!"
                    })
                }
            })
        }
    })
})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"))
})

//Where listening
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})