var express = require('express');
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser');
const moment = require('moment');
app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));

var connection = mysql.createConnection({
    host:"localhost",
    user:'root',
    port: '3306',
    password:'',
    database:'mercury'
});


var server = app.listen(3300,function(){
    var host = server.address().address
    var port =server.address().port
});

connection.connect(function(error){
    if(error) console.log(error);
    else console.log("connected");
}
);

app.get('/license',(req,res)=>{
    const drive= req.query.drive;
    connection.query(`select * from license where number LIKE "${drive}"`,function(error,rows,fields){
        if(error) console.log(error);
        else{
            res.send(rows);
            

        }
    })

});

app.get('/member',(req,res)=>{
    const account =req.query.account;
    connection.query(`select * from member where Account like "${account}"`,function(error,rows,fields){
        if(error)console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
});

app.get('/memberlicense',(req,res)=>{
    const number =req.query.number;
    connection.query(`select * from license where CID like "${number}"`,function(error,rows,fields){
        if(error)console.log(error);
        else{
            console.log("所屬車牌");
            console.log(rows);
            res.send(rows);
        }
    })
});

app.delete('/licensedel',(req,res)=>{
    const number =req.query.number;
    connection.query(`DELETE FROM license WHERE Number='${number}'`,(error,result)=>{
        if(error)
        console.log(error);
        else 
        res.send('successfully');
    })
});

app.post('/licenseadd',(req,res)=>{
    const {data}=req.body;
    connection.query(`INSERT INTO license(Number, CID) VALUES ('${data.value1}','${data.value2}')`,(error,result)=>{
        if(error)
        console.log(error);
        else{
            res.send('successfully');
        }

    })
});

app.get('/record',(req,res)=>{
    const license=req.query.license;
    connection.query(`Select * from record where number='${license}'`,function(error,rows,fields){
        if(error)
        console.log(error);
        else{
            const data = rows.map(row => {
                const datetime = moment(row.rTime).utcOffset(8 * 60);
                return {
                    datetime :datetime.format(),
                  Number: row.Number,
                  date: datetime.format('YYYY-MM-DD'),
                  time: datetime.format('HH:mm:ss'),
                  Duration:row.Duration,
                };
              });
              
              res.json(data);

        }
    })
});

app.get('/violation', (req, res) => {
  const record = req.query.record;
  const license = req.query.license;
  connection.query(`SELECT * FROM violation WHERE rtime="${record}" and Number="${license}"`, function(error, rows, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      const data = rows.map(row => {
        const datetime = moment.utc(row.vTime).utcOffset(8 * 60);
        return {
            datetime:datetime.format(),
          date: datetime.format('YYYY-MM-DD'),
          time: datetime.format('HH:mm:ss'),
          Event: row.Event,
          driver: row.Driver,
        };
      });
      console.log(data);
      res.json(data);
    }
  });
});

app.post('/recordadd',(req,res)=>{
    const {data}=req.body;
    connection.query(`INSERT INTO record (rTime, Number, Duration, Driver) VALUES ('${data.rTime}', '${data.Number}', '00:00:00', '${data.Driver}')`,
    (error,result)=>{
        if(error)
        console.log(error);
        else{
            res.send('successfully');
        }

    })
});

app.put('/driverupd',(req,res)=>{
    const Number=req.body.Number;
    const situation= req.body.situation;
    connection.query(`UPDATE license SET situation ='${situation}' WHERE Number='${Number}'`,(error,results)=>{
        if (error) {
            console.log(error);
            res.status(500).send('Failed to update data.');
          } else {
            console.log(results);
            res.send('Data updated successfully.');
          }
    })
});

app.put(`/recordupd`,(req,res)=>{
    const Duration=req.body.Duration;
    const rTime =req.body.rTime;
    const Number= req.body.Number;
    connection.query(`UPDATE record SET Duration='${Duration}' WHERE rTime='${rTime}' and Number='${Number}'`,(error,results)=>{
        if (error) {
            console.log(error);
            res.status(500).send('Failed to update data.');
          } else {
            console.log(results);
            res.send('Data updated successfully.');
          }})
})





