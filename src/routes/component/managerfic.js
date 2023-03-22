import React,{Component} from "react";
import { text,vie,gra} from "../../Allstyles";
import { SafeAreaView, View ,Text,TouchableOpacity,Image} from "react-native";

export default class Managerfic extends Component {
    
    render(){
        return(
        <SafeAreaView style={vie.container}>
            <View style={{flex:3,justifyContent:"center",alignItems:"center"}}>
                <Text style={text.bluetitle}>首護者</Text>
                <Text style={text.bluetitle2}>Mercury</Text>
                <Image style={{ height: 60, width: 80 }} source={require('../../image/number.png')} />

            </View>
            
            <View style={{flex:2,justifyContent:"center",alignItems:"center"}}>
            
            
            <TouchableOpacity style={gra.ficchoose}
            onPress={()=>{this.props.navigation.navigate("Licensechoose")}}
            >
                <Text style={text.ficchoose}>車牌管理系統</Text>
            </TouchableOpacity>
            <View style={{flex:0.3}} />
            <TouchableOpacity style={gra.ficchoose}
            onPress={()=>{this.props.navigation.navigate("Situationlicchoose")}}
            >
                <Text style={text.ficchoose}>司機狀況查詢</Text>
            </TouchableOpacity>
            
         </View>
         <Image style={{justifyContent:'flex-end',height:120,width:450}} source={require('../../image/homeroad.jpg')} resizeMode={"stretch"}/>

         </SafeAreaView>
        )
    }
}