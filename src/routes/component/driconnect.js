import { NavigationHelpersContext } from '@react-navigation/native';
import { randomUUID } from 'expo-crypto';
import React, { Component, useState } from 'react';
import { Alert, Button, SafeAreaView, TouchableOpacity,Text, View } from "react-native";
import { connect } from 'react-redux';
import {vie,text,gra} from "../../Allstyles";
import url from '../../url';

class Driconnect extends Component{

    state={
        datetime:'----,--,--,--:--:--',
        sid:"開始",
        sec:0,
        started:false,
        text:[],

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
        this.interval = setInterval(() => {
          
          this.setState({ sec: this.state.sec+1 });

        }, 1000);
        this.recordadd();
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
            <SafeAreaView style={vie.container}>
              <View style={{justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontSize:20,fontWeight:"bold"}}>開始時間</Text>
                <Text  style={{fontSize:20,fontWeight:"bold"}}>{this.state.datetime.toString().substring(0,25)}</Text>
                <Text  style={{fontSize:20,fontWeight:"bold"}}>{formattedSec}</Text>
                <TouchableOpacity
                onPress={()=>{
                    if(this.state.sid=="開始"){
                        this.setState({datetime:new Date(),sid:"結束"},()=>{this.handleStart()});
                        
                        this.situationupdate("駕駛中");

                    }
                    else if(this.state.sid=="結束"){
                        this.handleStop();
                        
                    }
                }}
                >
                    <Text>{this.state.sid}</Text>
                </TouchableOpacity>
                <Button title={"test"} onPress={()=>{console.log(this.state.text)}}/>
                </View>
            </SafeAreaView>
        )
    }
    
}
const mapStateToProps = state =>{
  return{
      license:state.drive.list.Number,
      Driver:state.drive.name,
  }
}
export default connect(mapStateToProps)(Driconnect)