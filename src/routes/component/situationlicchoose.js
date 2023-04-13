import React,{Component} from "react";
import { connect } from "react-redux";
import { text,vie,gra} from "../../Allstyles";
import { SafeAreaView, View,Text, TouchableOpacity } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import url from "../../url";
class Situationlicchoose extends Component {
    state={
        netdata:[],
        data:[],
        type:'',
        
    }

    //紀錄該車牌於model
    savelic=(data)=>{
        this.props.dispatch({
            type:"license/Post_license",
            payload:data,
            callback:()=>{
                this.props.navigation.navigate("Recordchoose");
            }
        });
    }

    //查詢所屬車牌
    search=(id)=>{
        fetch(`http://${url}/memberlicense?number=${id}`)
        .then(response=>response.json())
        .then(netdata=>{
            this.setState({netdata:netdata}),this.setState({data:netdata})
        });
    }

    
    componentDidMount(){
        this.search(this.props.member.CID);
        
    }
    render(){
        return(
            <SafeAreaView style={vie.container}>
                <View style={vie.lictitle}>
                    <Text style={text.lictitle}>司機狀況查詢</Text>
                </View>
                
                <View style={vie.lictype}>
                    <TextInput 
                    autoCapitalize="characters"

                    style={text.lictype}
                    onChangeText={(type)=>{
                        const res = this.state.netdata.filter(item=>
                            item.Number.toUpperCase().includes(type.toUpperCase()));
                        this.setState({data:res});
                    }
                    }
                    />

                    
                </View>
                <View style={vie.lic}>
                     <FlatList
                     data={this.state.data}
                     keyExtractor={(item,index)=>item.Number.toString()}
                     showsVerticalScrollIndicator={false}
                     renderItem={({item})=>
                        <TouchableOpacity
                        style={gra.licchoose}
                        onPress={()=>{this.savelic(item.Number)}}

                        >
                            <Text style={text.licchoose}>{item.Number} </Text>
                        </TouchableOpacity>
                     }
                     
                     />
                </View>
                <View style={vie.recbottom}></View>
            </SafeAreaView>
        )
    }

}
 const mapStateToProps = state =>{
    return{
        member:state.member.list,
    }
 }
export default connect(mapStateToProps)(Situationlicchoose)
