import React, { Component } from "react";
import { SafeAreaView, View,Text, Alert, Button, TouchableOpacity, Image, BackHandler, Animated } from "react-native";
import { text,gra,vie } from "../../Allstyles";
import exitapp from "react-native-exit-app";
import { connect } from "react-redux";

class Home extends Component {
    
    render(){
        return(
            
                <SafeAreaView style={vie.container}>
                    <View style={vie.home}>
                    <Text style={text.bluetitle}> 首護者</Text>
                    <Text style={text.bluetitle}>Mercury</Text>
                    </View>
                    <View style={vie.home2}>
                        <TouchableOpacity style={gra.cir}
                        onPress={()=>{this.props.navigation.navigate('Driverchoose', { title: 'React' })}}>
                            <Text style={text.grawordw}>駕駛者</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={gra.cir}
                        onPress={()=>{this.props.navigation.navigate('Managerchoose', { title: 'React' })}}>
                            <Text style={text.grawordw}>主管</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={{justifyContent:'flex-end',height:120,width:450}} source={require('../../image/homeroad.jpg')} resizeMode={"stretch"}/>
                      
                </SafeAreaView>
    
        )

    }
    
}
const mapStateToProps = state =>{
    return{
    }
 }
export default connect(mapStateToProps)(Home)