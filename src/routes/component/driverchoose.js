import React, { Component } from "react";
import { SafeAreaView, Text, TouchableOpacity, Image, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { text,gra,vie } from "../../Allstyles";
import url from "../../url";
import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

 class Driverchoose extends Component {
    constructor(props) {
        super(props);
        this.state={
        number:"",
        name:"",
        data:[],
        dri:'' ,
    }
    }
    //紀錄駕駛車牌
    savedrive=(data)=>{
        this.props.dispatch({
            type:'drive/Post_driver',
            payload:data,
            callback:()=>{
                this.savename(this.state.name);
            }
        });
    }
    //紀錄駕駛人
    savename=(data)=>{
        this.props.dispatch({
            type:"drive/Post_name",
            payload:data,
            callback:()=>{

                this.props.navigation.navigate("Driconnect");

            }
        });
    }
    //案確認鍵後查詢sql  
    search=()=>{
        id=this.state.number;
        name=this.state.name;
        if(id.length==0){
            
            alert("不得為空");
        }
        else if(name.length==0){
            alert("請輸入駕駛員")
        }
        else
        {
            //搜尋sql
            fetch(`http://${url}/license?drive=${id}`)
            .then(response =>response.json())
            .then(data => {
                this.setState({data},()=>{
                const res =this.state.data.find(item=> item.Number==id);
                if(res==null)
                    alert("車牌錯誤，請重新輸入");
                else  {
                    this.savedrive(res);
                    
                }
                })
            });
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
                    
                        <Text style={styles.toptext}>駕駛員登入</Text>
                        <Image style={styles.pic} source={require("../../image/rock.png")} resizeMode="stretch"/>
                    
                </LinearGradient>
                <View style={styles.bottomview}>
                    <Text style={styles.imputtext}>車牌</Text>
                    <TextInput style={styles.imput} 
                    placeholder="請輸入車牌"
                    keyboardType="ascii-capable"
                    textContentType="none"
                    autoCorrect={false}
                    placeholderTextColor={"#CCCCCC"}

                    autoCapitalize="characters"
                    onChangeText={(text) => { this.setState({ number: text }) }}
                    />
                        <Text style={styles.imputtext}>駕駛員</Text>
                    <TextInput style={styles.imput} 
                    placeholder="請輸入名字"
                    autoCorrect={false}
                    placeholderTextColor={"#CCCCCC"}

                    autoCapitalize="characters"
                    onChangeText={(text) => { this.setState({ name: text }) }}
                    />
                    <TouchableOpacity style={styles.button}
                    onPress={this.search}>
                        <Text style={styles.buttontext}>登入</Text>
                    </TouchableOpacity>


                </View>
            </View>

            // <SafeAreaView style={vie.container}>
            //     <View style={{ flex: 1 }}></View>
            //     <View style={{ flex: 6, justifyContent: "center", alignItems: "center" }}>
            //         <Text style={text.bluetitle}>首護者</Text>
            //         <Text style={text.bluetitle}>Mercury</Text>
            //         <Image style={{ height: 60, width: 80 ,marginBottom:20}} source={require('../../image/number.png')} />
            //         <Text style={text.blacktitle}>請輸入車牌</Text>
            //         <TextInput style={text.drivetype}
            //             placeholder="請輸入車牌"
            //             autoCorrect={false}
            //             autoCapitalize="characters"
            //             onChangeText={(text) => { this.setState({ number: text }) }}
            //         />
            //         <Text style={text.blacktitle}>請輸入名字</Text>
            //         <TextInput style={text.drivetype}
            //             placeholder="請輸入名字"
            //             autoCorrect={false}
            //             autoCapitalize="characters"
            //             onChangeText={(text) => { this.setState({ name: text }) }}
            //         />
            //         <TouchableOpacity style={gra.squ}
            //             onPress={this.search}>
            //             <Text style={text.grawordw}>確定</Text>
            //         </TouchableOpacity>
            //     </View>
            //     <Image style={{ justifyContent: 'flex-end', height: 120, width: 450, marginTop: 130 }} source={require('../../image/homeroad.jpg')} resizeMode={"stretch"} />

            // </SafeAreaView>
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
export default connect()(Driverchoose);
