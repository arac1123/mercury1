import React,{Component} from "react";
import { text,vie,gra} from "../../Allstyles";
import { SafeAreaView, View ,Text,TouchableOpacity,Image,TextInput,FlatList, Alert} from "react-native";
import { connect } from "react-redux";
import { StyleSheet } from "react-native";
import url from "../../url";
//圖片檔位置
const loupe =require("../../image/loupe.png");
const loupegreen =require("../../image/loupegreen.png");
const add =require("../../image/add.png");
const addgreen =require("../../image/addgreen.png");
const trash =require("../../image/trash.png");
const trashgreen =require("../../image/trashgreen.png");

class Managerfic extends Component {
    state={
        loupeimage:loupegreen,
        loupevisible:true,
        trashImage:trash,
        addvisible:false,
        trashvisible:false,
        addimage:add,
        netdata:[],
        data:[],
        type:'',
        first:"yes",
        number:'',
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

    //新增車牌
    licadd=()=>{
        fetch(`http://${url}/licenseadd`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                data:{
                    value1:this.state.number,
                    value2:this.props.member.CID,
                },
            }),
        
        }
    
    );
    alert(`${this.state.number}已經新增完成`);
    this.search((this.props.member.CID));
}
    //刪除車牌
    licdel=(id)=>{
        fetch(`http://${url}/licensedel?number=${id}`, { method: 'DELETE' });
        this.search(this.props.member.CID);
        
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

    componentDidMount(){
        this.search((this.props.member.CID));
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.topview }>
                    <View style={{backgroundColor:"#1b232a",alignContent:"flex-end",flexDirection:"row-reverse"}}>
                        <TouchableOpacity
                        style={{margin:22}}
                        onPress={()=>{this.props.navigation.navigate("Passwordchange")}}
                        >
                            <Image source={require("../../image/setting.png")} style={{height:5,width:5,padding:12}} resizeMode="stretch"/>

                        </TouchableOpacity>
                    </View>


                    {/* 查詢介面 */}
                    { this.state.loupevisible &&
                    <View style={styles.searchview}>
                        <View style={styles.inputview}>
                            <Image source={loupegreen} style={{width:28,height:28}}/>
                        <TextInput 
                        autoCapitalize="characters"
                        keyboardType="ascii-capable"
                        textContentType="none"
                        placeholder="查詢車牌"
                        placeholderTextColor={"#777777"}
                        style={styles.licsearch}
                        onChangeText={(type)=>{
                            const res = this.state.netdata.filter(item=>
                                item.Number.toUpperCase().includes(type.toUpperCase()));
                            this.setState({data:res});
                        }
                        }
                        />
                        </View>
                        <FlatList
                        data={this.state.data}
                        style={styles.flat}
                        keyExtractor={(item,index)=>item.Number.toString()}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}

                        renderItem={({item})=>
                            <TouchableOpacity
                            style={styles.licflat}
                            onPress={()=>{this.savelic(item.Number)}}
                            >
                                <Text 
                                style={styles.licnum}>{item.Number} </Text>
                            </TouchableOpacity>
                        }
                        
                        />
                    </View>
                    }


                    {/* 新增介面 */}
                    { this.state.addvisible &&
                    <View style={styles.addview}>
                        <Image source={require("../../image/log.png")} style={{width:150,height:150,padding:50}}/>
                        <Text style={styles.title}>Mercury</Text>
                        <View style={styles.inputview}>
                            <Image source={addgreen} style={{width:28,height:28}}/>
                            <TextInput 
                            keyboardType="ascii-capable"
                            textContentType="none"
                            autoCapitalize="characters"
                            placeholder="請輸入欲新增之車牌"
                            placeholderTextColor={"#777777"}
                            style={styles.licsearch}
                            onChangeText={(txt)=>{this.setState({number:txt})}}
                            />
                        </View>
                        <TouchableOpacity style={styles.addbutton}
                        onPress={()=>{
                        Alert.alert(
                            '確定新增',
                            `確定新增車牌 ${this.state.number} 嗎?`,
                            [
                                {text:'確定',onPress:()=>{
                                    const exist = this.state.netdata.find(item=> item.Number==this.state.number);
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
                        <Text style={styles.addtxt}>確定新增</Text>
                    </TouchableOpacity>
                    </View>
                    }



                    {/* 刪除介面 */}
                    { this.state.trashvisible &&
                    <View style={{flex:1,backgroundColor:"#FF0000"}}>
                        <View style={styles.searchview}>
                        <View style={styles.inputview}>
                            <Image source={trashgreen} style={{width:28,height:28}}/>
                        <TextInput 
                        autoCapitalize="characters"
                        keyboardType="ascii-capable"
                        textContentType="none"
                        placeholder="查詢欲刪除車牌"
                        placeholderTextColor={"#777777"}
                        style={styles.licsearch}
                        onChangeText={(type)=>{
                            const res = this.state.netdata.filter(item=>
                                item.Number.toUpperCase().includes(type.toUpperCase()));
                            this.setState({data:res});
                        }
                        }
                        />
                        </View>
                        <FlatList
                        data={this.state.data}
                        style={styles.flat}
                        keyExtractor={(item,index)=>item.Number.toString()}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}

                        renderItem={({item})=>
                            <TouchableOpacity
                            style={styles.licflat}
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
                                style={styles.licnum}>{item.Number} </Text>
                            </TouchableOpacity>
                        }
                        
                        />
                    </View>
                    </View>
                    }
                


                </View>
                <View style={styles.bottomview}>
                    <View
                    style={styles.tagview}
                    >
                        <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{this.setState({loupeimage:loupegreen,trashImage:trash,addimage:add,loupevisible:true,trashvisible:false,addvisible:false,})}}
                        >
                            <Image style={styles.bottompic} source={this.state.loupeimage} resizeMode="stretch" />
                            <Text style={styles.bottomtext}>查詢車牌</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{this.setState({loupeimage:loupe,trashImage:trash,addimage:addgreen,loupevisible:false,trashvisible:false,addvisible:true})}}

                        >
                            <Image style={styles.bottompic} source={this.state.addimage} resizeMode="stretch" />
                            <Text style={styles.bottomtext}>新增車牌</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{this.setState({loupeimage:loupe,trashImage:trashgreen,addimage:add,loupevisible:false,trashvisible:true,addvisible:false})}}

                        >
                            <Image style={styles.bottompic} source={this.state.trashImage} resizeMode="stretch" />
                            <Text style={styles.bottomtext}>刪除車牌</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>




        // <SafeAreaView style={vie.container}>
        //     <View style={{flex:3,justifyContent:"center",alignItems:"center"}}>
        //         <Text style={text.bluetitle}>首護者</Text>
        //         <Text style={text.bluetitle2}>Mercury</Text>
        //         <Image style={{ height: 60, width: 80 }} source={require('../../image/number.png')} />

        //     </View>
            
        //     <View style={{flex:2,justifyContent:"center",alignItems:"center"}}>
            
            
        //     <TouchableOpacity style={gra.ficchoose}
        //     onPress={()=>{this.props.navigation.navigate("Licensechoose")}}
        //     >
        //         <Text style={text.ficchoose}>車牌管理系統</Text>
        //     </TouchableOpacity>
        //     <View style={{flex:0.3}} />
        //     <TouchableOpacity style={gra.ficchoose}
        //     onPress={()=>{this.props.navigation.navigate("Situationlicchoose")}}
        //     >
        //         <Text style={text.ficchoose}>司機狀況查詢</Text>
        //     </TouchableOpacity>
            
        //  </View>
        //  <Image style={{justifyContent:'flex-end',height:120,width:450}} source={require('../../image/homeroad.jpg')} resizeMode={"stretch"}/>

        //  </SafeAreaView>
        )
    }
}

const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#1b232a",
        
    },
    topview:{
        flex:4,
        backgroundColor:"#FFFFFF"
    },
    searchview:{
        flex:1,
        alignItems:"center",
        backgroundColor:"#1b232a",
        
    },
    bottomview:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
    },
    tagview:{
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        backgroundColor:"#212B34",
        width:340,
        height:80,
        borderRadius:20
    },
    button:{
        justifyContent:"center",
        alignItems:"center",
        padding:25,
        paddingTop:30,
        width:110,
        height:80
    },
    bottompic:{
        width:25,
        height:25,
    },
    bottomtext:{
        color:"#CCCCCC",
        fontSize:14,
        paddingTop:5,
        fontWeight:"300"
    },
    licsearch:{
        width:280,
        height:54,
        borderRadius:20,
        fontSize:20,
        color:"#FFFFFF",
        paddingLeft:15
    },
    inputview:{
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        backgroundColor:"#161C22",
        width:350,
        height:54,
        borderRadius:20,
        
    },
    flat:{
        paddingTop:25
    },  
    licflat:{
    backgroundColor:"#319073",
    width:320,
    height:60,
    borderRadius:15,
    justifyContent:"center",
    alignItems:"center",
    
    },
    licnum:{
        fontSize:30,
        color:"#000000",
        fontWeight:"bold"
    },
    addview:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#1b232a",
    },
    title:{    
            color:"#CCCCCC",
            fontSize:40,
            fontWeight:"bold",
            padding:20
    },
    addbutton:{
        backgroundColor:"#319073",
        borderRadius:16,
        width:300,
        height:54,
        justifyContent:"center",
        alignItems:"center",
        marginTop:20,
        
    },
    addtxt:{
        color:"#171D22",
        fontSize:24,
        fontWeight:"bold",

    },

})

const mapStateToProps = state=>{
    return{
        member :state.member.list,
    }
}
export default connect(mapStateToProps)(Managerfic)