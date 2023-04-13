import React, { Component } from "react";
import { SafeAreaView, Text, TouchableOpacity, Image, View,Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { text,gra,vie } from "../../Allstyles";
import url from "../../url";
import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

class Passwordchange extends Component{
    
    state={
        pw:'',
        newpw:"",
        checknewpw:'',
    }


    //確認密碼是否輸入錯誤
    check=()=>{
        if(this.state.pw.length==0 || this.state.newpw.length==0 ||this.state.checknewpw==0){
            alert("格子不得為空")
        }else{
            if(this.state.pw==this.props.member.Password){
                if(this.state.newpw==this.state.checknewpw){
                    Alert.alert(
                        "更新密碼?",
                        `確認更新密碼為${this.state.newpw}嗎?`,
                        [
                            {text:"確定",onPress:()=>{
                                this.updatepassword()
                            }},
                            {text:"取消",onPress:()=>{
                                console.log("否")
                            }}
                        ]
                    )
                }else{
                    alert("確認密碼錯誤，請重新輸入")
                }
            }else{
                alert("原密碼錯誤，請重新輸入")
            }
        }
    }

    //更新密碼到mysql
    updatepassword=()=>{
        fetch(`http://${url}/passwordupd`,{
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
              password:this.state.newpw,
              id:this.props.member.CID,
            })
          });
          this.props.navigation.navigate("Home");
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
                    
                        <Text style={styles.toptext}>修改密碼</Text>
                        <Image style={styles.pic} source={require("../../image/rock.png")} resizeMode="stretch"/>
                    
                </LinearGradient>
                <View style={styles.bottomview}>
                    <Text style={styles.imputtext}>原密碼</Text>
                    <TextInput style={styles.imput} 
                    placeholder="請輸入原本密碼"
                    keyboardType="ascii-capable"
                    textContentType="none"
                    autoCorrect={false}
                    placeholderTextColor={"#CCCCCC"}
                    onChangeText={(text)=>{this.setState({pw:text})}}
                    autoCapitalize="characters"
                    />
                        <Text style={styles.imputtext}>新密碼</Text>
                    <TextInput style={styles.imput} 
                    placeholder="請輸入新密碼"
                    keyboardType="ascii-capable"
                    textContentType="none"
                    autoCorrect={false}
                    placeholderTextColor={"#CCCCCC"}
                    onChangeText={(text)=>{this.setState({newpw:text})}}

                    autoCapitalize="characters"
                    />
                    <Text style={styles.imputtext}>確認新密碼</Text>
                    <TextInput style={styles.imput} 
                    placeholder="再次輸入新密碼"
                    keyboardType="ascii-capable"
                    textContentType="none"
                    autoCorrect={false}
                    placeholderTextColor={"#CCCCCC"}
                    onChangeText={(text)=>{this.setState({checknewpw:text})}}

                    autoCapitalize="characters"
                    />
                    <TouchableOpacity style={styles.button}
                    onPress={()=>{this.check()}}>
                        <Text style={styles.buttontext}>確定</Text>
                    </TouchableOpacity>


                </View>
            </View>
        )
    }
}
const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#1b232a",

    },
    topview:{
        flex:0.8,
        justifyContent:"space-evenly",
        alignItems:"baseline",
        flexDirection:"row",
        borderRadius:30
    },
    bottomview:{
        flex:2,
        justifyContent:"flex-start",
        alignItems:"flex-start",
        backgroundColor:"#1b232a",

    },
    toptext:{
        fontSize:32,
        fontWeight:"bold",
        color:"#FFFFFF",
        marginLeft:35,
    },
    pic:{
        width:134,
        height:134,
        margin:50
    },
    imput:{
        backgroundColor:"#161C22",
        width:344,
        height:56,
        borderRadius:20,
        marginLeft:25,
        color:"#FFFFFF",
        textAlign:"center"
    },
    imputtext:{
        color:"#FFFFFF",
        fontSize:14,
        fontWeight:"300",
        margin:15,
        marginLeft:35
    },
    buttontext:{
        fontSize:20,
        fontWeight:"bold"
    },
    button:{
        backgroundColor:"#319073",
        borderRadius:16,
        width:250,
        height:54,
        justifyContent:"center",
        alignItems:"center",
        marginLeft:75,
        marginTop:40
    },
})
const mapStateToProps = state=>{
    return{
        member :state.member.list,
    }
}
export default connect(mapStateToProps)(Passwordchange)