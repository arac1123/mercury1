import React, { Component, useState } from 'react';
import { Alert, Button, SafeAreaView, TouchableOpacity,Text, View ,Image} from "react-native";
import { connect } from 'react-redux';
import url from '../../url';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import App from '../component/App';
//播放音檔
async function playSound() {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(require('../../audio/dog1a.mp3'));
    await soundObject.playAsync();
  } catch (error) {
    console.log(error);
  }
}
class Driconnect extends Component{


    state={
      datetime:'----,--,--,--:--:--',
      sid:"開始",
      sec:0,
      started:false,
      text:[],
      viocurrent:[],
      vionew:[],
      prescore:100,
      score:100,
      drivecount:0,
      yawn:0,
      wink:0,
      distrack:0,
      closeeye:0,
      tag:0,
    }
  
 


    // update駕駛時間
    recordupdate=()=>{
      const time = new Date(`1970-01-01T08:00:00.000Z`);
      const starttime = new Date(this.state.datetime.getTime()+ time.getTime()-new Date(0).getTime());
      const ts =new Date(this.state.sec * 1000).toISOString().substr(11, 8);
      fetch(`http://${url}/recordupd`,{
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          Duration:new Date(this.state.sec * 1000).toISOString().substr(11, 8),
          rTime : starttime.toISOString().slice(0,19),
          Number:this.props.license,

        })
      })
  }

    // 更改車牌狀態
    situationupdate=(situ)=>{
        fetch(`http://${url}/driverupd`,{
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            Number:this.props.license,
            situation:situ,
          })
        })
    }


    //搜尋sql違規紀錄
    searchvio = () => {
      const time = new Date(`1970-01-01T08:00:00.000Z`);
      const starttime = new Date(this.state.datetime.getTime()+ time.getTime()-new Date(0).getTime());
      console.log(starttime.toISOString().slice(0,19))
      fetch(`http://${url}/violation?record=${starttime.toISOString().slice(0,19)}&license=${this.props.license}`)
      .then(response => response.json())
      .then(response=>{this.setState({vionew:response})})
    }


    // insert 紀錄
    recordadd=()=>{
      const time = new Date(`1970-01-01T08:00:00.000Z`);
      const starttime = new Date(this.state.datetime.getTime()+ time.getTime()-new Date(0).getTime());
      console.log(starttime);
      fetch(`http://${url}/recordadd`,{
            method:'POST',
            headers:{
              Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                data:{
                  rTime:starttime.toISOString(),
                  Number:this.props.license,
                  Driver:this.props.Driver,
                },
            }),
        
        });
      }

    // 開始計時
    handleStart = () => {
        this.setState({ started: true });
        this.recordadd();
        
        //計時
        this.interval = setInterval(() => {
          this.setState({ sec: this.state.sec+1 });
        }, 1000);

        //搜尋資料庫是否有新的違規
        this.interval =setInterval(()=>{
          this.searchvio();
          const difference = this.state.vionew.filter(item => !this.state.viocurrent.some(element => element.datetime === item.datetime));
          console.log(this.state.drivecount);
          console.log(difference)
          if(difference.length===0){
            
            //良好駕駛加分            
            this.setState({drivecount:this.state.drivecount+1});
            if(this.state.drivecount==12){
              if(this.state.score>95){
                this.setState({drivecount:0, score:100});
              }else{
                this.setState({drivecount:0, score:this.state.score+5});
              }
            }
          }else{
            this.setState({drivecount:0,viocurrent:this.state.vionew,prescore:this.state.score});

            this.eventcount(difference);

          }
        },2000);
      };
    


      // 結束計時
      handleStop = () => {
        clearInterval(this.interval);
        this.setState({ started: false});
        Alert.alert(
            "結束駕駛",
            "請問您要結束駕駛嗎?",
            [
              {
                text: "取消",
                onPress: () => this.handleStart()
              },
              {
                text: "確定",
                onPress: () => {
                  this.recordupdate();
                  this.situationupdate("休息中");
                this.setState({ started: false,sec:0});
                this.props.navigation.navigate("Home");
                }
              }
            ]
          );
      };

      //算這趟違規的次數&加扣分
      eventcount=(data)=>{

        const con1 = data.reduce((acc,item)=>{
            if(item.Event==="打哈欠"){
              this.setState({score:this.state.score-3, yawn:this.state.yawn+1});
            
            }
        },0);

        const con2 = data.reduce((acc,item)=>{
            if(item.Event==="眨眼頻率過高"){
              this.setState({score:this.state.score-4 , wink:this.state.wink+1});

            }
        },0);

        const con3 =data.reduce((acc,item)=>{
            if(item.Event==="駕駛東張西望"){
              this.setState({score:this.state.score-3 , distrack:this.state.distrack+1});

            }
        },0);

        const con4 =data.reduce((acc,item)=>{
            if(item.Event==="駕駛閉眼"){
              this.setState({score:this.state.score-20 , closeeye:this.state.closeeye+1});
            }
        },0);
        
        if(this.state.score<80 && this.state.prescore>80 ){
          playSound();
        }
        if(this.state.score<60 && this.state.prescore>60){
          playSound();
        }
        if(this.state.score<40 && this.state.prescore>40){
          playSound();
        }

    }




      
     
    
      
    render(){

        const formattedSec = new Date(this.state.sec * 1000).toISOString().substr(11, 8);
        return(
          <View style={styles.container}>
            {/* <App Driver="John" license="ABC123" tag={1} /> */}
            <View style={styles.bottomview}>
              <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:32,fontWeight:"bold",color:"#DDDDDD",marginTop:"10%"}}>開始時間</Text>
              </View>
              <Text  style={{fontSize:28,fontWeight:"bold",color:"#DDDDDD",marginTop:"5%"}}>{this.state.datetime.toString().substring(0,25)}</Text>
              <Text  style={{fontSize:30,fontWeight:"bold",color:"#DDDDDD",marginTop:"10%"}}>駕駛時間</Text>
              <Text  style={{fontSize:28,fontWeight:"bold",color:"#DDDDDD",marginTop:"5%"}}>{formattedSec}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{
                    if(this.state.sid=="開始"){
                        this.setState({datetime:new Date(),sid:"結束",tag:1},()=>{this.handleStart()});
                        
                        this.situationupdate("駕駛中");

                    }
                    else if(this.state.sid=="結束"){
                        this.handleStop();
                        
                    }
                }}
                >
                    <Text style={{fontSize:20,color:"#FFFFFF",fontWeight:"bold"}}>{this.state.sid}</Text>
                </TouchableOpacity>
            </View>
          </View>



            
        )
    }
    
}
const mapStateToProps = state =>{
  return{
      license:state.drive.list.Number,
      Driver:state.drive.name,

  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#1b232a",

  },
  topview:{
    flex:0.6,
    justifyContent:"space-evenly",
    alignItems:"baseline",
    flexDirection:"row",
    borderRadius:30,
  },
  bottomview:{
    flex:2,
    justifyContent:"flex-start",
    alignItems:"center",
    flexDirection:"column",
    backgroundColor:"#1b232a",

  },
  toptext:{
    fontSize:32,
    fontWeight:"bold",
    color:"#FFFFFF",
    marginTop:"25%",
  },
  pic:{
    width:100,
    height:100,
    
  },
  button:{
    marginTop:"10%",
    width:180,
    height:40,
    backgroundColor:"#319073",
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center"
  },
})
export default connect(mapStateToProps)(Driconnect)