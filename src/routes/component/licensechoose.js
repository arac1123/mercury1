import React,{Component} from "react";
import { connect } from "react-redux";
import { text,vie,gra} from "../../Allstyles";
import { SafeAreaView, View,Text, TouchableOpacity, Alert } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import url from "../../url";
class Lincensechoose extends Component {
    state={
        netdata:[],
        data:[],
        type:'',
        first:'yes',
    }
    //搜尋所屬車牌
    search=(id)=>{
        fetch(`http://${url}/memberlicense?number=${id}`)
        .then(response=>response.json())
        .then(netdata=>{
            this.setState({netdata:netdata}),this.setState({data:netdata});
            if(this.state.first=='yes'){
                this.props.dispatch({
                    type:'own/Post_own',
                    payload:netdata,
                    callback:()=>{
                    }
                });
                this.setState({first:'no'});
            }
        });

    }
    //刪除車牌
    licdel=(id)=>{
        fetch(`http://${url}/licensedel?number=${id}`, { method: 'DELETE' });
        this.search(this.props.member.CID);
        
    }


    componentDidMount(){
        this.search((this.props.member.CID));
        
    }
    render(){
        return(
            <SafeAreaView style={vie.container}>
                <View style={vie.lictitle}>
                    <Text style={text.lictitle}>車牌管理系統</Text>
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
                        onPress={()=>{
                            Alert.alert(
                                "刪除確認",
                                `你確定要刪除${item.Number}嗎?`,
                                [
                                    {text:'確定', onPress:()=>{this.licdel(item.Number,Alert.alert(
                                        '成功刪除',
                                        `${item.Number}已成功刪除`,
                                        [
                                            {text:'確定',onPress:(this.search(this.props.member.CID))}
                                        ]
                                    ))
                                }},
                                    {text:'取消', onPress:()=>console.log('否')},

                                ]
                            )
                        }}
                        >
                            <Text 
                            style={text.licchoose}>{item.Number} </Text>
                        </TouchableOpacity>
                     }
                     
                     />
                </View>
                <View style={vie.licbottom} >
                     <TouchableOpacity style={gra.licbottom}
                     onPress={()=>{this.props.navigation.navigate("Licenseadd")}} >
                        <Text style={text.licbottom}>新增車牌</Text>
                     </TouchableOpacity>
                     
                </View>
            </SafeAreaView>
        )
    }

}
 const mapStateToProps = state =>{
    return{
        member:state.member.list,
    }
 }
export default connect(mapStateToProps)(Lincensechoose)
