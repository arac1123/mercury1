import { Component } from "react";
import React from "react";
import {vie,gra,text} from "../../Allstyles";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import url from "../../url";
import { Button, Text, TouchableOpacity, View,Image } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { color } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

// const endt= new Date();




class Violation extends Component{

    state={
        netdata:[],
        data:[],
        firsthour:"",
        hour:[],
        endtime:[],
        yawn:0,
        wink:0,
        distrack:0,
        closeeye:0,
        title:"違規總次數",
    }

    //搜尋sql
    searchvio = () => {
        fetch(`http://${url}/violation?record=${this.props.record.datetime}&license=${this.props.license}`)
        .then(response => response.json())
          .then(netdata => {
            this.setState({data:netdata,netdata:netdata },()=>{this.eventcount()});
            // console.log(netdata);

          })
           }

    //點擊時間後顯示該時段違規情形
    buttonclick=(hour) =>{
        console.log(hour.substring(0,2));
        this.setState({title:hour})
        const res =this.state.netdata.filter((item=>
            item.datetime.substring(11,13)===hour.substring(0,2)))
            console.log(res);
        this.setState({data:res},()=>{ this.eventcount()})
    }


    //計算各個次數
    eventcount=()=>{
        const con1 = this.state.data.reduce((acc,item)=>{
            if(item.Event==="打哈欠"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con2 = this.state.data.reduce((acc,item)=>{
            if(item.Event==="眨眼頻率過高"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con3 = this.state.data.reduce((acc,item)=>{
            if(item.Event==="駕駛東張西望"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con4 = this.state.data.reduce((acc,item)=>{
            if(item.Event==="駕駛閉眼"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        this.setState({yawn:con1});
        this.setState({wink:con2});
        this.setState({distrack:con3});
        this.setState({closeeye:con4});
        console.log(con1,con2,con3,con4);

    }
    
    //把開始到結束駕駛的每小時記錄在hour陣列
    countduration=()=>{
        const duration = new Date(`1970-01-01T${this.props.duration}Z`);
        const time = new Date(`1970-01-01T08:00:00.000Z`);
        const timeset = new Date(this.props.record.datetime);
        const starttime =new Date(timeset.getTime()+time.getTime()-new Date(0).getTime());
        const endtime = new Date(timeset.getTime() + duration.getTime()-new Date(0).getTime()+time.getTime());    
        console.log(starttime);
        console.log(endtime);
        const firsthour = starttime.toISOString().substring(11,13);
        const endhour = endtime.toISOString().substring(11,13);
        
        console.log(firsthour,endhour);
        
        for(let i=firsthour;i<25;i++){
            if(i==24)
            i=0;
            if(i==endhour){
                    const hour = endtime.toISOString().substring(11,13);
                    const second = endtime.toISOString().substring(14,16);
                    const res=`${hour}:00~${hour}:${second}`;
                    this.state.hour.push(res);
                break;
            }
            else if(i==firsthour){
                    const hour = starttime.toISOString().substring(11,13);
                    const second = starttime.toISOString().substring(14,16);
                    
                    if(i<9){
                        const res =`${hour}:${second}~0${i+1}:00`
                        this.state.hour.push(res);

                    }else{
                        const res =`${hour}:${second}~${parseInt(hour,10)+1}:00`
                        this.state.hour.push(res);
                    }
            }
            else{
                if(i<8){
                    const res=`0${i}:00~0${i+1}:00`;
                    this.state.hour.push(res);
                }else if(i==9){
                    const res=`09:00~10:00`;
                    this.state.hour.push(res);
                }else if(i==23){
                    const res =`23:00~00:00`;
                    this.state.hour.push(res);
                }
                else {
                    const res =`${i}:00~${i+1}:00`;
                    this.state.hour.push(res);
                }
            }
            
        }

    }
    componentDidMount(){ 
        this.searchvio();
        this.countduration();

    }
    render(){

        return(

            <View style={styles.container}>
                <LinearGradient
                    colors={['#1B232A', '#5EC5A0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.topview}
                >                
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:70}}>
                            <Image source={require("../../image/user.png")} style={{height:30,width:30,marginLeft:50}}/>
                            <Text style={styles.toptext}>{this.props.member}</Text>
                        </View>
                        <Image style={styles.pic} source={require("../../image/rock.png")} resizeMode="stretch"/>
                    
                </LinearGradient>


                <View style={styles.bottomview}>
                    <View style={{flexDirection:"row",marginTop:20,alignItems:"flex-start",marginLeft:30}}>
                        <Image source={require("../../image/steering-wheel.png")} style={{height:40,width:40}} />
                        <Text style={styles.lictitle}>{this.props.license}</Text>
                    </View>
                    <Text style={styles.record}>駕駛 : {this.props.record.Driver}</Text>
                    <Text style={styles.record}>日期 : {this.props.record.date}   {this.props.record.time}</Text>
                    <View style={{alignItems:"center",justifyContent:"center",marginTop:10}}>
                        <Text style={{fontSize:22,color:"#DDDDDD",fontWeight:"bold"}}>{this.state.title}</Text>
                    </View>
                    <View style={{height:40 ,justifyContent:"center",alignItems:"center"}}>
                        <FlatList
                        style={styles.flat}
                        data={this.state.hour}
                        showsVerticalScrollIndicator={false}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}

                        renderItem={({item})=>
                            <TouchableOpacity
                            style={styles.flatlist}
                            onPress={()=>{this.buttonclick(item)}}
                            >
                                <Text style={styles.time}>{item} </Text>


                            </TouchableOpacity>
                        }
                    />
                   </View>
                    <BarChart       
                    data={{
                            labels: ["打哈欠", "眨眼頻率過高", "駕駛東張西望", "駕駛閉眼"],
                            datasets: [
                            {
                                data:[
                                        this.state.yawn,
                                        this.state.wink,
                                        this.state.distrack,
                                        this.state.closeeye
                                    ],
                            }
                            ],                            
                    }}
                    style={{marginTop:20}}
                    width={Dimensions.get("window").width} // from react-native
                    height={250}
                    fromZero={true}
                    yAxisTickCount={3}
                    chartConfig={{
                    backgroundColor: "#e26a00",
                    fillShadowGradientOpacity:1,
                    fillShadowGradientToOpacity:0.34,

                    backgroundGradientFrom: "#1B232A",
                    backgroundGradientTo: "#5EC5A0",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(0,139,139, ${opacity})`, // 折線顏色
                    labelColor: (opacity = 1) => `rgba(256,256,256, ${opacity})`, //字體顏色
                    style: {
                        borderRadius: 16,
                        
                    },
                    
                    props: {
                        title: "Title",
                        titleFontSize: 24,
                        titleFontColor: "#000",
                      },
                    }}
                        
                    />

                </View>
            </View>


            // <SafeAreaView style={vie.container}>
            //     <View style={{justifyContent:"center",alignItems:"center"}}>
            //         <FlatList
            //         style={{height:"40%"}}
            //         data={this.state.hour}
            //         showsVerticalScrollIndicator={false}
            //         renderItem={({item})=>
            //         <TouchableOpacity
            //         style={gra.viochoose}
            //         onPress={()=>{this.buttonclick(item)}}
            //         >
            //             <Text style={text.licchoose}>{item} </Text>


            //         </TouchableOpacity>
            //      }
            //         />
                    
            //         <Text style={{fontSize:22}}>{this.state.title}</Text>
            //         <BarChart       
            //         data={{
            //                 labels: ["打哈欠", "眨眼頻率過高", "駕駛東張西望", "駕駛閉眼"],
            //                 datasets: [
            //                 {
            //                     data:[
            //                             this.state.yawn,
            //                             this.state.wink,
            //                             this.state.distrack,
            //                             this.state.closeeye
            //                         ],
            //                 }
            //                 ],                            
            //         }}
            //         width={Dimensions.get("window").width} // from react-native
            //         height={250}
            //         fromZero={true}
            //         yAxisTickCount={3}
            //         chartConfig={{
            //         backgroundColor: "#e26a00",
            //         fillShadowGradientOpacity:1,
            //         fillShadowGradientToOpacity:0.34,

            //         backgroundGradientFrom: "rgb(255,255,224)",
            //         backgroundGradientTo: "rgb(255,255,224)",
            //         decimalPlaces: 0, // optional, defaults to 2dp
            //         color: (opacity = 1) => `rgba(0,139,139, ${opacity})`, // 折線顏色
            //         labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`, //字體顏色
            //         style: {
            //             borderRadius: 16,
            //         },
                    
            //         props: {
            //             title: "Title",
            //             titleFontSize: 24,
            //             titleFontColor: "#000",
            //           },
            //         }}
                        
            //         />
            //     </View>
            // </SafeAreaView>
        )

    }


    
}

const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#1b232a",

    },
    topview:{
        flex:0.6,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        borderRadius:30
    },
    bottomview:{
        flex:2,
        justifyContent:"flex-start",
        backgroundColor:"#1b232a",

    },
    toptext:{
        fontSize:32,
        fontWeight:"bold",
        color:"#DDDDDD",
        paddingLeft:10
    },
    pic:{
        width:134,
        height:134,
        margin:50,
        marginLeft:80
    },
    lictitle:{
        color:"#FFFFFF",
        fontSize:32,
        fontWeight:"bold",
        marginLeft:20
    },
    record:{
        color:"#999999",
        marginTop:10,
        marginLeft:95,
        fontSize:20,
        fontWeight:"bold"
    },
    flatlist:{
        width:150,
        height:30,
        backgroundColor:"#319073",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:20
    },
    flat:{
        marginTop:10,
        width:Dimensions.get("window").width,
        

    },
    time:{
        fontSize:20,
        color:"#000000",
        fontWeight:"bold"
    }
    
})

const mapStateToProps = state=>{
    return{
        record:state.record.list,
        duration:state.record.duration,
        license:state.license.list,
        member:state.member.list.Name,

    }
}
export default connect(mapStateToProps)(Violation)