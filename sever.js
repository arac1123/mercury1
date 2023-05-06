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

//搜尋司機車牌是否正確
app.get('/license',(req,res)=>{
    const drive= req.query.drive;
    connection.query(`select * from license where number LIKE "${drive}"`,function(error,rows,fields){
        if(error) console.log(error);
        else{
            res.send(rows);
            

        }
    })

});


//搜尋主管帳密是否正確
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


//搜尋主管所屬車牌
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


//刪除所屬車牌
app.delete('/licensedel',(req,res)=>{
    const number =req.query.number;
    connection.query(`DELETE FROM license WHERE Number='${number}'`,(error,result)=>{
        if(error)
        console.log(error);
        else 
        res.send('successfully');
    })
});


//新增車牌
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


//查詢該車牌的駕駛紀錄
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
                  Driver:row.Driver,
                };
              });
              console.log(rows);
              res.json(data);

        }
    })
});



//查詢該紀錄的違規紀錄
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
      console.log(rows);
      res.json(data);
    }
  });
});


//新增駕駛紀錄
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


//新增違規事項
app.post(`/violationadd`,(req,res)=>{
    const {data}=req.body;
    console.log(data.rTime)
    connection.query(`INSERT INTO violation(vTime,rTime,Number,Event) VALUES ('${data.vTime}','${data.rTime}','${data.license}','${data.Event}')`,
    (error,result)=>{
        if(error)
        console.log(error);
        else{
            res.send('successfully');
        }

    })
});


//更新車牌駕駛狀態
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

//更新駕駛時長
app.put(`/recordupd`,(req,res)=>{
    const Duration=req.body.Duration;
    const rTime =req.body.rTime;
    const Number= req.body.Number;

    connection.query(`UPDATE record SET Duration = '${Duration}' WHERE record.rTime = '${rTime}' AND record.Number = '${Number}'`,(error,results)=>{
        if (error) {
            console.log(error);
            res.status(500).send('Failed to update data.');
          } else {
            console.log(results);
            res.send('Data updated successfully.');
          }})
})


//更新密碼
app.put('/passwordupd',(req,res)=>{
    const password=req.body.password;
    const id= req.body.id;
    connection.query(`UPDATE member SET Password='${password}' WHERE CID='${id}'`,(error,results)=>{
        if (error) {
            console.log(error);
            res.status(500).send('Failed to update data.');
          } else {
            console.log(results);
            res.send('Data updated successfully.');
          }
    })
});



//搜尋有哪些駕駛
app.get(`/driverselect`,(req,res)=>{
    const CID =req.query.cid;
     connection.query(`SELECT Distinct Driver FROM license INNER join record where license.Number=record.Number and license.CID="${CID}";`,function(error,rows,fields){
        if(error)console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
});

//搜尋該駕駛的最近一周駕駛紀錄
app.get('/driverrecord',(req,res)=>{
    const name = req.query.name
    const day =req.query.day
    connection.query(`select * FROM record WHERE rTime >= DATE_SUB(NOW(), INTERVAL ${day} DAY) AND Driver="${name}"`,function(error,rows,fields){
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
                  Driver:row.Driver,
                };
              });
            //   console.log(rows);
              res.json(data);

        }
    });
});


//搜尋駕駛7天內的所有違規事項
app.get('/driverviocount',(req,res)=>{
    const name = req.query.name
    const day = req.query.day
    connection.query(`select * from violation INNER JOIN record where record.rTime >= DATE_SUB(NOW(), INTERVAL ${day} DAY) AND record.Driver="${name}" and violation.rTime=record.rTime;`,function(error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send('Internal Server Error');
        } else {
          const data = rows.map(row => {
            const recordtime =moment.utc(row.rTime).utcOffset(8 * 60);
            const datetime = moment.utc(row.vTime).utcOffset(8 * 60);
            return {
                recordtime:recordtime.format(),
                datetime:datetime.format(),
                date: datetime.format('YYYY-MM-DD'),
              time: datetime.format('HH:mm:ss'),
              Event: row.Event,
            };
          });
          console.log(rows);
          res.json(data);
        }
      }
    )
})