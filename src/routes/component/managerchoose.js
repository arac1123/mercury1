import React, { Component } from "react";
import { SafeAreaView, Text,View,Image,TextInput,TouchableOpacity } from "react-native";
import url from "../../url";
import { connect } from "react-redux";
import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

 class Managerchoose extends Component {
    state={
        account:"",
        password:"",
        data:[],
        num:''
    }

    
    //紀錄主管ID
    savemember=(data)=>{
        this.props.dispatch({
            type:"member/Post_member",
            payload:data,
            callback:()=>{
                this.props.navigation.navigate("Managerfic");

            }
        });
    }


    //驗證主管帳密
    search=()=>{
        mid=this.state.account;
        pwd=this.state.password;
        if(mid.length==0)
        alert("帳號不得為空");
        else if(pwd.length==0)
        alert("密碼不得為空");
        else {
            fetch(`http://${url}/member?account=${mid}`)
            .then(response =>response.json())
            .then(data =>{
                this.setState({data},()=>{
                    const res =this.state.data.find(item=> item.Account==mid);
                    if(res==null)
                    alert("查無帳號");
                    else
                    {
                        const match = this.state.data.find(item => item.Password==pwd);
                        if(match==null)
                        alert("密碼錯誤");
                        else {
                        this.savemember(match);
                        }
                    }
                })
            })
        }
    }
    render() {
        return (
                <View style={styles.container}>
                    <LinearGradient
                    colors={['#1B232A', '#5EC5A0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.topview}
                    >                
                    
                        <Text style={styles.toptext}>管理者登入</Text>
                        <Image style={styles.pic} source={require("../../image/rock.png")} resizeMode="stretch"/>
                    
                </LinearGradient>
                <View style={styles.bottomview}>
                    <Text style={styles.imputtext}>帳號</Text>
                    <TextInput style={styles.imput} 
                    placeholder="請輸入帳號"
                    placeholderTextColor={"#CCCCCC"}

                    autoCorrect={false}                                                                                  
                    onChangeText={(text)=>{this.setState({account:text})}}
                    />
                    <Text style={styles.imputtext}>密碼</Text>
                    <TextInput style={styles.imput} 
                    placeholderTextColor={"#CCCCCC"}
                    placeholder="請輸入密碼"
                    secureTextEntry={true}  
                    onChangeText={(text)=>{this.setState({password:text})}}
                    />
                    <TouchableOpacity style={styles.button}
                    onPress={this.search}>
                        <Text style={styles.buttontext}>登入</Text>
                    </TouchableOpacity>


                </View>
            </View>

        //     <SafeAreaView style={vie.container}>
        //     <View style={{flex:1}}></View>
        //     <View style={{flex:6,justifyContent:"center",alignItems:"center"}}>
        //     <Text style={text.bluetitle}>首護者</Text>
        //     <Text style={text.bluetitle2}>Mercury</Text>

        //     <Text style={text.blacktitle}>請輸入帳號</Text>
            
        //     <TextInput style={text.managertype} 
        //     placeholder="請輸入帳號"
        //     autoCorrect={false}                                                                                  
        //     onChangeText={(text)=>{this.setState({account:text})}}
        //     />
        //     <Text style={text.blacktitle}>請輸入密碼</Text>
        //     <TextInput style={text.managertype} 
        //     placeholder="請輸入密碼"
        //     secureTextEntry={true}  
        //     onChangeText={(text)=>{this.setState({password:text})}}
        //     />
        //     <TouchableOpacity style={gra.squ}
        //     onPress={this.search}>
        //         <Text style={text.grawordw}>確定</Text>
        //     </TouchableOpacity>
        //     <View style={vie.line}>
        //         <Text onPress={()=>{this.props.navigation.navigate("")}} style={text.linetxt}>修改密碼</Text>
        //     </View>
            
        //  </View>
        //  <Image style={{justifyContent:'flex-end',height:120,width:450,marginTop:130}} source={require('../../image/homeroad.jpg')} resizeMode={"stretch"}/>

        //  </SafeAreaView>
        );
    }
}
const styles= StyleSheet.create({
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
        width:300,
        height:54,
        justifyContent:"center",
        alignItems:"center",
        marginLeft:45,
        marginTop:20
    },
})

export default connect()(Managerchoose);