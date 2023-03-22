import { Component } from "react";
import React from "react";
import {vie,gra,text} from "../../Allstyles";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import url from "../../url";
import { Button, Text, View } from "react-native";


class Violation extends Component{

    state={
        netdata:[],
        yawn:0,
        wink:0,
        distrack:0,
        closeeye:0,

    }


    searchvio = () => {
        fetch(`http://${url}/violation?record=${this.props.record}&license=${this.props.license}`)
        .then(response => response.json())
          .then(netdata => {
            this.setState({ netdata: netdata },()=>{this.eventcount()});
            console.log(netdata);

          })
           }

    eventcount=()=>{
        const con1 = this.state.netdata.reduce((acc,item)=>{
            if(item.Event==="打哈欠"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con2 = this.state.netdata.reduce((acc,item)=>{
            if(item.Event==="眨眼頻率過高"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con3 = this.state.netdata.reduce((acc,item)=>{
            if(item.Event==="駕駛東張西望"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con4 = this.state.netdata.reduce((acc,item)=>{
            if(item.Event==="駕駛閉眼"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        console.log(con1,con2,con3,con4);
        this.setState({yawn:con1});
        this.setState({wink:con2});
        this.setState({distrack:con3});
        this.setState({closeeye:con4});
    }
    
    componentDidMount(){    
        this.searchvio();
        
       
    }


    render(){
        return(
            <SafeAreaView style={vie.container}>
                <View style={{justifyContent:"center",alignItems:"center"}}>
                    <Text style={{fontSize:20,fontWeight:"bold"}}>打哈欠次數:{this.state.yawn}</Text>
                    <Text style={{fontSize:20,fontWeight:"bold"}}>眨眼頻率過高次數:{this.state.wink}</Text>
                    <Text style={{fontSize:20,fontWeight:"bold"}}>東張西望次數:{this.state.distrack}</Text>
                    <Text style={{fontSize:20,fontWeight:"bold"}}>閉眼次數:{this.state.closeeye}</Text>


                </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state=>{
    return{
        record:state.record.list,
        license:state.license.list,

    }
}
export default connect(mapStateToProps)(Violation)