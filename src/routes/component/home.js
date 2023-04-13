import React, { Component } from "react";
import { SafeAreaView, View,Text, Alert, Button, TouchableOpacity, Image, BackHandler, Animated } from "react-native";
import { text,gra,vie } from "../../Allstyles";
import exitapp from "react-native-exit-app";
import { connect } from "react-redux";
import { StyleSheet } from "react-native";

class Home extends Component {
    
    render(){
        return(
                <SafeAreaView style={styles.container}>
                    <Image style={styles.pic} source={require('../../image/logo.png')} resizeMode="stretch"/>
                    <Text style={styles.title}>Mercury</Text>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{this.props.navigation.navigate('Driverchoose')}}
                    >
                        <Text style={styles.buttontext}>駕駛員</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{this.props.navigation.navigate('Managerchoose')}}
                    >
                        <Text style={styles.buttontext}>管理者</Text>
                    </TouchableOpacity>
                </SafeAreaView>


                // <SafeAreaView style={vie.container}>
                //     <View style={vie.home}>
                //     <Text style={text.bluetitle}> 首護者</Text>
                //     <Text style={text.bluetitle}>Mercury</Text>
                //     </View>
                //     <View style={vie.home2}>
                //         <TouchableOpacity style={gra.cir}
                //         onPress={()=>{this.props.navigation.navigate('Driverchoose', { title: 'React' })}}>
                //             <Text style={text.grawordw}>駕駛者</Text>
                //         </TouchableOpacity>
                //         <TouchableOpacity style={gra.cir}
                //         onPress={()=>{this.props.navigation.navigate('Managerchoose', { title: 'React' })}}>
                //             <Text style={text.grawordw}>主管</Text>
                //         </TouchableOpacity>
                //     </View>
                //     <Image style={{justifyContent:'flex-end',height:120,width:450}} source={require('../../image/homeroad.jpg')} resizeMode={"stretch"}/>
                      
                // </SafeAreaView>
    
        )

    }
    
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000000',
        justifyContent:"center",
        alignItems:"center"   
    },
    pic:{

    },
    title:{
        color:"#FFFFFF",
        fontSize:40,
        fontWeight:"bold",
        marginBottom:40
    },
    button:{
        backgroundColor:"#319073",
        borderRadius:16,
        width:300,
        height:54,
        justifyContent:"center",
        alignItems:"center",
        margin:5
    },
    buttontext:{
        fontSize:20,
        fontWeight:"bold"
    }
})
const mapStateToProps = state =>{
    return{
    }
 }
export default connect(mapStateToProps)(Home)