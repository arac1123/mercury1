import React, { Component ,useState} from 'react';
import { SafeAreaView,View,Text, TouchableOpacity, Image,Modal,Button} from 'react-native';
import { connect } from 'react-redux';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import url from '../../url';
import  DateTimePicker  from '@react-native-community/datetimepicker';
import { set } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
const loupegreen =require("../../image/loupegreen.png");

const pagesize= 10;

class Recordchoose extends Component{
state={
    netdata:[],
    data:[],
    date:new Date(),
    modal:false,
}

//紀錄選擇的紀錄
saverec=(data,duration)=>{
    this.props.dispatch({
        type:"record/Post_record",
        payload:data,
        callback:()=>{
        }
    });
    this.saveduration(duration);
}

//紀錄選擇紀錄的持續時間
saveduration=(data)=>{
    this.props.dispatch({
        type:"record/Post_duration",
        payload:data,
        callback:()=>{
            this.props.navigation.navigate("Violation");
        }
    });
}

//查詢所選的匹配日期
recfind=()=>{
    const time = new Date(`1970-01-01T08:00:00.000Z`);
    const utcDate = new Date(this.state.date.getTime() + time.getTime()-new Date(0).getTime());
    const res= this.state.netdata.filter(item=>
        item.date===utcDate.toISOString().slice(0, 10));
        this.setState({data:res});
}

//搜尋sql此車牌所屬駕駛紀錄
search=()=>{
    fetch(`http://${url}/record?license=${this.props.license}`)
    .then(response=>response.json())
    .then(netdata=>{
        this.setState({netdata:netdata}),this.setState({data:netdata},console.log(this.state.netdata))
    });}
componentDidMount(){    
    this.search(this.props.license);

    
}
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.licview}>
                    <Text style={styles.lic}>{this.props.license}</Text>
                    <TouchableOpacity 
                    onPress={()=>{this.setState({modal:true})}}
                    >
                        <Image style={{width:45,height:45,marginLeft:5,marginTop:3}}source={require('../../image/calender.png')} resizeMode={'stretch'}></Image>
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.inputview}>
                            <Image source={loupegreen} style={{width:28,height:28}}/>
                            <TextInput 
                            autoCapitalize="characters"
                            
                            placeholder="查詢駕駛"
                            placeholderTextColor={"#777777"}
                            style={styles.licsearch}
                            onChangeText={(type)=>{
                                const res = this.state.netdata.filter(item=>
                                    item.Driver.toUpperCase().includes(type.toUpperCase()));
                                this.setState({data:res});
                            }
                            }
                            />
                        </View>
                <View style={styles.title}> 
                    <Text style={styles.titletext}>駕駛</Text>
                    <View style={styles.line}/>
                    <Text style={styles.titletext}>駕駛時間</Text>
                </View>
                <FlatList
                showsVerticalScrollIndicator={false}
                style={{marginBottom:"7%"}}
                data={this.state.data}
                windowSize={10}
                renderItem={({item})=>
                <TouchableOpacity
                style={styles.flat}
                onPress={()=>{this.saverec(item,item.Duration)}}
                >
                    <View style={styles.list}> 
                        <View  style={styles.driver}>
                        <Text style={styles.recordtext}>{item.Driver}</Text>
                        </View>
                        <View style={styles.line}/>
                        <View  style={styles.driver}>
                            <Text style={styles.recordtimetext}>{item.date}</Text>
                            <Text style={styles.recordtimetext}>{item.time}</Text>
                        </View>
                    </View>
                </TouchableOpacity>  
                
                }
                />

                 <Modal visible={this.state.modal} transparent={true} animationType="slide">
                    <View  style={{backgroundColor:'white',position:'absolute',width:'100%',justifyContent:'flex-end',bottom:0}}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end',marginRight:15,marginTop:5}}>
                            <Button  title='確定' onPress={()=>{this.setState({modal:false})}} ></Button>
                        </View>
                        <DateTimePicker
                        mode='date'
                        value={this.state.date}
                        display="spinner"
                        is24Hour={false}
                        onChange={(event,date)=>{this.setState({date:date},()=>{this.recfind()})}}
                        />
                    </View>
                </Modal>

            </View>
            
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#1b232a",
        justifyContent:"center",
        alignItems:"center",
        
    },
    inputview:{
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        backgroundColor:"#161C22",
        width:330,
        height:54,
        borderRadius:20,
        marginBottom:"5%"
    },
    licview:{
        marginTop:30,
        marginBottom:30,
        backgroundColor:"#000000",
        width:320,
        height:50,
        borderRadius:20,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row"
    },
    lic:{
        color:"#FFFFFF",
        fontSize:30,
        fontWeight:"bold",
        marginLeft:"25%",
        paddingRight:"10%"
    },
    line:{
        height: '150%',
        width: 3,
        backgroundColor: 'black',
        marginHorizontal: 10,

    },
    title:{
        width:320,
        height:40,
        backgroundColor:"#C3C8CD",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },
    titletext:{
        fontSize:20,
        fontWeight:"bold",
        width:160,
        marginLeft:30,
        marginRight:-70
    },
    flat:{
        backgroundColor:"#DDDDDD",
        width:320,
        height:45,
        justifyContent:"space-evenly",
        alignItems:"center",
        borderBottomWidth: 3,
        borderBottomColor: 'black',
    },
    recordtext:{
        color:"#000000",
        fontSize:16,
        fontWeight:"bold",
        marginRight:-20,
    },
    recordtimetext:{
        color:"#000000",
        fontSize:16,
        fontWeight:"bold",
        marginRight:15
    },
    driver:{
         justifyContent:"center",
         alignItems:"center",
         width:160,
    },
    list:{
        flexDirection:"row",
        alignItems:"center",

    },
    licsearch:{
        width:280,
        height:54,
        borderRadius:20,
        fontSize:20,
        color:"#FFFFFF",
        paddingLeft:"10%"
    },

})
const mapStateToProps = state =>{
    return{
        license:state.license.list,
    }
 }
export default connect(mapStateToProps)(Recordchoose)