import React, { Component } from "react";
import { SafeAreaView, Text,View,Image,TextInput,TouchableOpacity } from "react-native";
import {vie,gra,text } from "../../Allstyles";
import url from "../../url";
import { connect } from "react-redux";

 class Managerchoose extends Component {
    state={
        account:"",
        password:"",
        data:[],
        num:''
    }

    

    savemember=(data)=>{
        this.props.dispatch({
            type:"member/Post_member",
            payload:data,
            callback:()=>{
                this.props.navigation.navigate("Managerfic");

            }
        });
    }



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
            <SafeAreaView style={vie.container}>
            <View style={{flex:1}}></View>
            <View style={{flex:6,justifyContent:"center",alignItems:"center"}}>
            <Text style={text.bluetitle}>首護者</Text>
            <Text style={text.bluetitle2}>Mercury</Text>

            <Text style={text.blacktitle}>請輸入帳號</Text>
            
            <TextInput style={text.managertype} 
            placeholder="請輸入帳號"
            autoCorrect={false}                                                                                  
            onChangeText={(text)=>{this.setState({account:text})}}
            />
            <Text style={text.blacktitle}>請輸入密碼</Text>
            <TextInput style={text.managertype} 
            placeholder="請輸入密碼"
            secureTextEntry={true}  
            onChangeText={(text)=>{this.setState({password:text})}}
            />
            <TouchableOpacity style={gra.squ}
            onPress={this.search}>
                <Text style={text.grawordw}>確定</Text>
            </TouchableOpacity>
            <View style={vie.line}>
                <Text onPress={()=>{this.props.navigation.navigate("")}} style={text.linetxt}>修改密碼</Text>
            </View>
            
         </View>
         <Image style={{justifyContent:'flex-end',height:120,width:450,marginTop:130}} source={require('../../image/homeroad.jpg')} resizeMode={"stretch"}/>

         </SafeAreaView>
        );
    }
}

export default connect()(Managerchoose);