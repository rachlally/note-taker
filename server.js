//Server Code
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const uuid = require("uuid");
console.log(uuid.v4())

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
    fs.readFile("./db/db.json", "utf-8", (err, data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg: "Whoops!",
                err: err,
            });
        } else {

            const dataArr = JSON.parse(data);
            req.body.id = uuid.v4();
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
                    });
                }
            });
        }
    });
});

app.delete("/api/notes/:id", (req, res)=>{
    const deletion = req.params.id;
    fs.readFile("./db/db.json", "utf-8", (err, data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg: "Whoops!",
                err: err,
            });
        } else {

            const dataArr = JSON.parse(data);
            let index = -1;
            for (let i = 0; i < dataArr.length; i++){
                if (dataArr[i].id === deletion){
                    index = i;
                    break;
                }
            }

            if (index !== -1){
                dataArr.splice(index, 1)
            }

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
                    });
                }
            });
        }
    });

})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"))
})

//Where listening
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})