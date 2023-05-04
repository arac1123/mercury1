import React, { Component, useState } from 'react';
import { Alert, Button, SafeAreaView, TouchableOpacity,Text, View ,Image,Dimensions,} from "react-native";
import { connect } from 'react-redux';
import url from '../../url';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {Svg, Circle} from 'react-native-svg';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import App from './App';




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
      width:0,
      height:0,
      top:"100%",
      time:0,
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
      this.setState({time:starttime})
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

      



      
     
    
      
    render(){
        const formattedSec = new Date(this.state.sec * 1000).toISOString().substr(11, 8);
        return(
          <View style={styles.container}>
            <LinearGradient
            colors={['#1B232A', '#5EC5A0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topview}
           >                
                <View style={{flexDirection:"row",alignItems:"center",marginTop:"25%"}}>
                    <Image source={require("../../image/user.png")} style={{height:30,width:30}}/>
                    <Text style={styles.toptext}>開始駕駛</Text>
                </View>
                <Image style={styles.pic} source={require("../../image/rock.png")} resizeMode="stretch"/>
            
            </LinearGradient>
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
                <TouchableOpacity
                style={styles.button}
                onPress={()=>{
                  this.setState({width:"100%",height:"100%",top:"0%"})
                }}
                >
                    <Text style={{fontSize:20,color:"#FFFFFF",fontWeight:"bold"}}>顯示鏡頭</Text>
                </TouchableOpacity>
                
            </View>

            <View style={{width:this.state.width,height:this.state.height}}>
                <App Driver={this.props.Driver} license={this.props.license} tag={this.state.tag} recordtime={this.state.time} />
                <TouchableOpacity
                style={styles.camerabutton}
                onPress={()=>{
                  this.setState({width:0,height:0,top:"100%"})
                }}
                >
                    <Text style={{fontSize:20,color:"#FFFFFF",fontWeight:"bold"}}>返回</Text>
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
    fontSize:30,
    fontWeight:"bold",
    color:"#FFFFFF",
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
  camerabutton:{
    marginLeft:"28%",
    width:180,
    height:40,
    backgroundColor:"#319073",
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center"
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faces: {
    top:-300,
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  faceDesc: {
    top:0,
    fontSize: 20
  },
  faceOverlay: {

    position: 'absolute',
    left: 0,
    top: 0,
  },
  speedContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
  },
  speedText: {
    fontSize: 20,
  },
})
export default connect(mapStateToProps)(Driconnect)