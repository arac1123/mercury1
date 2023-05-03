import React,{Component} from "react";
import { SafeAreaView, View ,Text,TouchableOpacity,Image,TextInput,FlatList, Alert, Dimensions} from "react-native";
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
const driver =require("../../image/usergray.png");
const drivergreen =require('../../image/user.png');


class Managerfic extends Component {
    state={
        loupeimage:loupegreen,
        loupevisible:true,
        drivervisible:false,
        trashImage:trash,
        addvisible:false,
        trashvisible:false,
        addimage:add,
        driverimage:driver,
        netdata:[],
        data:[],
        type:'',
        first:"yes",
        number:'',
        drivernetdata:[],
        driverdata:[],
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


    //搜尋駕駛
    searchdri=()=>{
        fetch(`http://${url}/driverselect?cid=${this.props.member.CID}`)
        .then(response => response.json())
        .then(response=>{
            this.setState({drivernetdata:response,driverdata:response})
        })
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

    //紀錄駕駛名字於model
    savedriveranalyze=(data)=>{
        this.props.dispatch({
            type:"driveranalyze/Post_driveranalyze",
            payload:data,
            callback:()=>{
                this.props.navigation.navigate("Driveranalyze");
            }
        })
    }

    componentDidMount(){
        this.search((this.props.member.CID));
        this.searchdri();
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

                    {/* 駕駛查詢介面 */}
                    {   this.state.drivervisible &&
                        <View style={{flex:1,backgroundColor:"#1b232a",}}>
                            <View style={styles.searchview}>
                                <View style={styles.inputview}>
                                    <Image source={loupegreen} style={{width:28,height:28}}/>
                                    <TextInput 
                                    autoCapitalize="characters"
                                    placeholder="查詢駕駛"
                                    placeholderTextColor={"#777777"}
                                    style={styles.licsearch}
                                    onChangeText={(type)=>{
                                        const res = this.state.drivernetdata.filter(item=>
                                            item.Driver.toUpperCase().includes(type.toUpperCase()));
                                        this.setState({driverdata:res});
                                    }
                                    }
                                    />
                                </View>
                                <FlatList
                                data={this.state.driverdata}
                                style={styles.flat}
                                keyExtractor={(item,index)=>item.Driver.toString()}
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}

                                renderItem={({item})=>
                                    <TouchableOpacity
                                    style={styles.licflat}
                                    onPress={()=>{this.savedriveranalyze(item.Driver)}}
                                    >
                                        <Text 
                                        style={styles.licnum}>{item.Driver} </Text>
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
                        onPress={()=>{this.setState({loupeimage:loupegreen,trashImage:trash,addimage:add,driverimage:driver,loupevisible:true,trashvisible:false,addvisible:false,drivervisible:false})}}
                        >
                            <Image style={styles.bottompic} source={this.state.loupeimage} resizeMode="stretch" />
                            <Text style={styles.bottomtext}>查詢車牌</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{this.setState({loupeimage:loupe,trashImage:trash,addimage:addgreen,driverimage:driver,loupevisible:false,trashvisible:false,addvisible:true,drivervisible:false})}}

                        >
                            <Image style={styles.bottompic} source={this.state.addimage} resizeMode="stretch" />
                            <Text style={styles.bottomtext}>新增車牌</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{this.setState({loupeimage:loupe,trashImage:trashgreen,addimage:add,driverimage:driver,loupevisible:false,trashvisible:true,addvisible:false,drivervisible:false})}}

                        >
                            <Image style={styles.bottompic} source={this.state.trashImage} resizeMode="stretch" />
                            <Text style={styles.bottomtext}>刪除車牌</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{this.setState({loupeimage:loupe,trashImage:trash,addimage:add,driverimage:drivergreen,loupevisible:false,trashvisible:false,addvisible:false,drivervisible:true})}}
                        >
                            <Image style={styles.bottompic} source={this.state.driverimage} resizeMode="stretch" />
                            <Text style={styles.bottomtext}>查詢駕駛</Text>
                        </TouchableOpacity>
                    </View>

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
        width:Dimensions.get("window").width,
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