import React, { Component } from 'react';
import {vie,text,gra} from '../../Allstyles';
import { SafeAreaView,View,Text, TouchableOpacity, Image,Modal,Button} from 'react-native';
import { connect } from 'react-redux';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import url from '../../url';
import  DateTimePicker  from '@react-native-community/datetimepicker';


class Recordchoose extends Component{
state={
    netdata:[],
    data:[],
    date:new Date(),
    modal:false,
}


saverec=(data)=>{
    this.props.dispatch({
        type:"record/Post_record",
        payload:data,
        callback:()=>{
            this.props.navigation.navigate("Violation");
        }
    });
}

recfind=()=>{
    const res= this.state.netdata.filter(item=>
        item.date===this.state.date.toISOString().slice(0, 10));
        console.log(res);
        this.setState({data:res});
}

search=()=>{
    fetch(`http://${url}/record?license=${this.props.license}`)
    .then(response=>response.json())
    .then(netdata=>{
        this.setState({netdata:netdata}),this.setState({data:netdata},console.log(this.state.netdata))
    });
}
componentDidMount(){    
    this.search(this.props.license);
    
    
}
    render(){
        return(
            <SafeAreaView style={vie.container}>
            <View style={vie.lictitle}>
                <Text style={text.lictitle}>{this.props.license} </Text>
            </View>
            
            <View style={vie.lictype}>
                <TextInput 
                editable={false}
                style={text.recordtype}
                value={this.state.date.toLocaleDateString()}
                />

                <TouchableOpacity style={gra.datechoose}
                onPress={()=>{this.setState({modal:true})}}
                >
                <Image style={{width:45,height:45,marginLeft:5,marginTop:3}}source={require('../../image/calender.png')} resizeMode={'stretch'}></Image>
                </TouchableOpacity>
            </View>
           
            <View style={vie.lic}>
            
                 <FlatList
                 data={this.state.data}
                 showsVerticalScrollIndicator={false}
                 renderItem={({item})=>
                    <TouchableOpacity
                    style={gra.licchoose}
                    onPress={()=>{this.saverec(item.datetime)}}
                    >
                        <Text style={text.licchoose}>{item.date} </Text>
                        <Text style={text.licchoose}>{item.time} </Text>

                    </TouchableOpacity>
                 }/>
                 
            </View>
           
                
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
                    onDateChange={()=>{console.log("123")}}
                    />
                </View>
                </Modal>
                
                    
                <View style={vie.recbottom}></View>

        </SafeAreaView>
        )
    }

}

const mapStateToProps = state =>{
    return{
        license:state.license.list,
    }
 }
export default connect(mapStateToProps)(Recordchoose)