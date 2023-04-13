import React, { Component ,useState} from 'react';
import {vie,text,gra} from '../../Allstyles';
import { SafeAreaView,View,Text, TouchableOpacity, Image,Modal,Button} from 'react-native';
import { connect } from 'react-redux';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import url from '../../url';
import  DateTimePicker  from '@react-native-community/datetimepicker';
import { set } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

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
                </View>
                <View style={styles.title}> 
                    <Text style={styles.titletext}>駕駛</Text>
                    <View style={styles.line}/>
                    <Text style={styles.titletext}>駕駛時間</Text>
                </View>
                <FlatList
                showsVerticalScrollIndicator={false}
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
            </View>









        //     <SafeAreaView style={vie.container}>
        //     <View style={vie.lictitle}>
        //         <Text style={text.lictitle}>{this.props.license} </Text>
        //     </View>
            
        //     <View style={vie.lictype}>
        //         <TextInput 
        //         editable={false}
        //         style={text.recordtype}
        //         value={this.state.date.toLocaleDateString()}
        //         />

        //         <TouchableOpacity style={gra.datechoose}
        //         onPress={()=>{this.setState({modal:true})}}
        //         >
        //         <Image style={{width:45,height:45,marginLeft:5,marginTop:3}}source={require('../../image/calender.png')} resizeMode={'stretch'}></Image>
        //         </TouchableOpacity>
        //     </View>
           
        //     <View style={vie.lic}>
            
        //          <FlatList
        //          data={this.state.data}
        //          showsVerticalScrollIndicator={false}
        //          renderItem={({item})=>
        //             <TouchableOpacity
        //             style={gra.licchoose}
        //             onPress={()=>{this.saverec(item.datetime,item.Duration)}}
        //             >
        //                 <Text style={text.licchoose}>{item.date} </Text>
        //                 <Text style={text.licchoose}>{item.time} </Text>

        //             </TouchableOpacity>
        //          }/>
                 
        //     </View>
           
                
        //         <Modal visible={this.state.modal} transparent={true} animationType="slide">
        //         <View  style={{backgroundColor:'white',position:'absolute',width:'100%',justifyContent:'flex-end',bottom:0}}>
        //             <View style={{flexDirection: 'row', justifyContent: 'flex-end',marginRight:15,marginTop:5}}>
        //                 <Button  title='確定' onPress={()=>{this.setState({modal:false})}} ></Button>
        //             </View>
        //             <DateTimePicker
                    
        //             mode='date'
        //             value={this.state.date}
        //             display="spinner"
        //             is24Hour={false}
        //             onChange={(event,date)=>{this.setState({date:date},()=>{this.recfind()})}
        //         }
        //             />
        //             <Button title='123' onPress={()=>{console.log(this.state.date)}} />
        //         </View>
        //         </Modal>
                
                    
        //         <View style={vie.recbottom}></View>

        // </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#1b232a",
        justifyContent:"center",
        alignItems:"center"
    },
    licview:{
        marginTop:30,
        marginBottom:30,
        backgroundColor:"#000000",
        width:320,
        height:50,
        borderRadius:20,
        justifyContent:"center",
        alignItems:"center"
    },
    lic:{
        color:"#FFFFFF",
        fontSize:30,
        fontWeight:"bold",

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

})
const mapStateToProps = state =>{
    return{
        license:state.license.list,
    }
 }
export default connect(mapStateToProps)(Recordchoose)