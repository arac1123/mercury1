import { Component } from "react";
import React from "react";
import {text,vie,gra} from "../../Allstyles";
import { connect } from "react-redux";
import { SafeAreaView, TouchableOpacity, View,Text, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import url from "../../url";
class Licenseadd extends Component{
    state={
        number:'',
    }


    licadd=()=>{
        fetch(`http://${url}/licenseadd`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                data:{
                    value1:this.state.number,
                    value2:this.props.id,
                },
            }),
        
        }
        
        );
        this.props.navigation.navigate("Managerfic");
        }
        
    



    render(){
        return(
            <SafeAreaView style={vie.container}>
                <View style={vie.licadd}>
                <Text style={text.licadd}>輸入欲新增之車牌</Text>
                <TextInput style={text.licaddtype}
                autoCapitalize="characters"
                onChangeText={(txt)=>{this.setState({number:txt})}} />
                <TouchableOpacity style={gra.licaddbottom}
                onPress={()=>{
                    Alert.alert(
                        '確定新增',
                        `確定新增車牌 ${this.state.number} 嗎?`,
                        [
                            {text:'確定',onPress:()=>{
                                const exist = this.props.own.find(item=> item.Number==this.state.number);
                                if(exist==null){
                                    this.licadd()
                                }
                                else{
                                    alert("此車牌已註冊");
                                    this.props.navigation.navigate("Managerfic");
                                }
                                
                            }
                            },
                            {text:'取消', onPress:()=>console.log('否')},


                        ]
                    )
                }}
                >
                    <Text style={text.grawordw}>確定</Text>
                </TouchableOpacity>

                </View>
            
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state=>{
    return{
        id :state.member.list.CID,
        own:state.own.list,
    }
}

export default connect(mapStateToProps)(Licenseadd)