import React, { Component } from "react";
import { SafeAreaView, Text, TouchableOpacity, Image, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { text,gra,vie } from "../../Allstyles";
import url from "../../url";

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

    savedrive=(data)=>{
        this.props.dispatch({
            type:'drive/Post_driver',
            payload:data,
            callback:()=>{
                this.savename(this.state.name);
            }
        });
    }

    savename=(data)=>{
        this.props.dispatch({
            type:"drive/Post_name",
            payload:data,
            callback:()=>{

                this.props.navigation.navigate("Driconnect");

            }
        });
    }
        
    search=()=>{
        id=this.state.number;
        if(id.length==0){
            
            alert("不得為空");
        }
        else
        {
            fetch(`http://${url}/license?drive=${id}`)
            .then(response =>response.json())
            .then(data => {
                this.setState({data},()=>{
                const res =this.state.data.find(item=> item.Number==id);
                if(res==null)
                    alert("請重新輸入");
                else  {
                    this.savedrive(res);
                    
                }
                })
            });
        }
        
    }

    render() {
        return (

            <SafeAreaView style={vie.container}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 6, justifyContent: "center", alignItems: "center" }}>
                    <Text style={text.bluetitle}>首護者</Text>
                    <Text style={text.bluetitle}>Mercury</Text>
                    <Image style={{ height: 60, width: 80 ,marginBottom:20}} source={require('../../image/number.png')} />
                    <Text style={text.blacktitle}>請輸入車牌</Text>
                    <TextInput style={text.drivetype}
                        placeholder="請輸入車牌"
                        autoCorrect={false}
                        autoCapitalize="characters"
                        onChangeText={(text) => { this.setState({ number: text }) }}
                    />
                    <Text style={text.blacktitle}>請輸入名字</Text>
                    <TextInput style={text.drivetype}
                        placeholder="請輸入名字"
                        autoCorrect={false}
                        autoCapitalize="characters"
                        onChangeText={(text) => { this.setState({ name: text }) }}
                    />
                    <TouchableOpacity style={gra.squ}
                        onPress={this.search}>
                        <Text style={text.grawordw}>確定</Text>
                    </TouchableOpacity>
                </View>
                <Image style={{ justifyContent: 'flex-end', height: 120, width: 450, marginTop: 130 }} source={require('../../image/homeroad.jpg')} resizeMode={"stretch"} />

            </SafeAreaView>
        );
    }
}
export default connect()(Driverchoose);
