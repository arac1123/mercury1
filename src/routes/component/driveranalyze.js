import React,{Component} from "react";
import url from "../../url";
import { StyleSheet, View ,Image,Text, Button,FlatList,TouchableOpacity  } from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

class Driveranalyze extends Component{

    state={
        vionetdata:[],
        recnetdata:[],
        hour:null,
        minute:null,
        second:null,
        yawn:0,
        wink:0,
        distrack:0,
        closeeye:0,
        lastdrive:'nah',
        name:[{name:"三天",day:3},
              {name:"一周",day:7},
              {name:"一個月",day:30},
              {name:"一季",day:90}],
        long:"一周",
        searchday:7,
        maxIndex:null,
    }

    //搜尋該駕駛這七天的違規情形
    searchvio=()=>{
        fetch(`http://${url}/driverviocount?name=${this.props.driver}&day=${this.state.searchday}`)
        .then(response=>response.json())
        .then(response=>{
            this.setState({vionetdata:response}, () => {
                this.countviotime();
                this.countviofrequency();
              });        })
    }

    searchrecord=()=>{
        fetch(`http://${url}/driverrecord?name=${this.props.driver}&day=${this.state.searchday}`)
        .then(response=>response.json())
        .then(response=>{
            this.setState({recnetdata:response},()=>{
                this.countduration();
                if(this.state.recnetdata.length>1)
                this.setState({lastdrive:this.state.recnetdata[this.state.recnetdata.length-1].datetime.replace('T', ' ').slice(0,19)})
            })
        })
    }

    //計算駕駛總時間
    countduration = () => {
        const totalMilliseconds = this.state.recnetdata.reduce((accumulator, currentValue) => {
            const timeParts = currentValue.Duration.split(":").map(part => parseInt(part));
            const milliseconds = (timeParts[0] * 60 * 60 * 1000) + (timeParts[1] * 60 * 1000) + (timeParts[2] * 1000);
            return accumulator + milliseconds;
        }, 0);
        const seconds = (Math.floor((totalMilliseconds / 1000) % 60)).toString().padStart(2, '0');
        const minutes = (Math.floor((totalMilliseconds / 1000 / 60) % 60)).toString().padStart(2, '0');
        const hours = (Math.floor((totalMilliseconds / 1000 / 60 / 60) )).toString().padStart(2, '0');
        this.setState({ hour:hours,minute:minutes,second:seconds});

        }


    //計算駕駛各項違規總次數
    countviotime=()=>{
        const con1 = this.state.vionetdata.reduce((acc,item)=>{
            if(item.Event==="打哈欠"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con2 = this.state.vionetdata.reduce((acc,item)=>{
            if(item.Event==="眨眼頻率過高"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con3 = this.state.vionetdata.reduce((acc,item)=>{
            if(item.Event==="駕駛東張西望"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        const con4 = this.state.vionetdata.reduce((acc,item)=>{
            if(item.Event==="駕駛閉眼"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        this.setState({yawn:con1});
        this.setState({wink:con2});
        this.setState({distrack:con3});
        this.setState({closeeye:con4});
    }

    countviofrequency=()=>{
        const timeDiffs = this.state.vionetdata.map((item) => {
            const startTime = new Date(item.datetime).getTime();
            
            const endTime = new Date(item.recordtime).getTime();
            
            const diff = endTime - startTime;
            return diff;
          });
        const hourCounts = new Array(24).fill(0);
        timeDiffs.forEach((diff) => {
            console.log(diff)
            const hour = diff/60/60/1000
            console.log(hour)
                        console.log("")

            hourCounts[hour]++;

        });

        const maxIndex = hourCounts.reduce((maxIndex, count, index, arr) => {
            return count > arr[maxIndex] ? index : maxIndex;
        }, 0);

            this.setState({maxIndex:maxIndex})
    }

    componentDidMount(){
        this.searchrecord();
        this.searchvio();

    }

    render(){
        const drivetime=this.state.recnetdata.length
        return(

            
            <View style={styles.container}>
                <LinearGradient
                    colors={['#1B232A', '#5EC5A0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.topview}
                >                
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:70}}>
                            <Image source={require("../../image/user.png")} style={{height:30,width:30,marginLeft:50}}/>
                            <Text style={styles.toptext}>駕駛情形</Text>
                        </View>
                        <Image style={styles.pic} source={require("../../image/rock.png")} resizeMode="stretch"/>
                    
                </LinearGradient>
                <View style={styles.bottomview}>
                        <View style={{flexDirection:"row",marginTop:20,alignItems:"flex-start",marginLeft:30}}>
                            <Image source={require("../../image/steering-wheel.png")} style={{height:40,width:40}} />
                            <Text style={styles.lictitle}>{this.props.driver}</Text>
                        </View>
                        <Text style={styles.record}>上次駕駛 : {this.state.recnetdata.length>1?this.state.lastdrive:"超過一周未開車"}</Text>
                        <Text style={styles.record}>最近{this.state.long}駕駛次數 : {this.state.recnetdata.length}</Text>
                        <Text style={styles.record}>最近{this.state.long}駕駛總時長 : {this.state.hour}:{this.state.minute}:{this.state.second} </Text>
                        <Text style={styles.record}>最近{this.state.long}違規次數 : {this.state.vionetdata.length}</Text>
                        <Text style={styles.conclude}>駕駛者於駕駛第{this.state.maxIndex}小時最容易分心 </Text>

                        <FlatList
                            data={this.state.name}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}

                            renderItem={({item})=>
                                <TouchableOpacity
                                style={styles.flatlist}
                                onPress={()=>{this.setState({long:item.name,searchday:item.day},()=>{
                                        this.searchvio();
                                        this.searchrecord();
                                    })}}
                                >
                                    <Text style={styles.time}>{item.name} </Text>


                                </TouchableOpacity>}
                            />

                        <View style={{justifyContent:"center",alignItems:"center"}}>
                            <BarChart       
                            data={{
                                    labels: ["打哈欠", "眨眼頻率過高", "駕駛東張西望", "駕駛閉眼"],
                                    datasets: [
                                    {
                                        data:[
                                                this.state.yawn,
                                                this.state.wink,
                                                this.state.distrack,
                                                this.state.closeeye
                                            ],
                                    }
                                    ],                            
                            }}
                            style={{marginTop:"2%",paddingBottom:"5%"}}
                            width={Dimensions.get("window").width} // from react-native
                            height={250}
                            fromZero={true}
                            yAxisTickCount={3}
                            chartConfig={{
                            backgroundColor: "#e26a00",
                            fillShadowGradientOpacity:1,
                            fillShadowGradientToOpacity:0.34,

                            backgroundGradientFrom: "#1B232A",
                            backgroundGradientTo: "#5EC5A0",
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(0,139,139, ${opacity})`, // 折線顏色
                            labelColor: (opacity = 1) => `rgba(256,256,256, ${opacity})`, //字體顏色
                            style: {
                                borderRadius: 16,
                                
                            },
                            
                            props: {
                                title: "Title",
                                titleFontSize: 24,
                                titleFontColor: "#000",
                            },
                            }}
                                
                            />
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
        flex:0.6,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        borderRadius:30
    },
    bottomview:{
        flex:2,
        justifyContent:"flex-start",
        backgroundColor:"#1b232a",

    },
    toptext:{
        fontSize:32,
        fontWeight:"bold",
        color:"#DDDDDD",
        paddingLeft:10
    },
    pic:{
        width:134,
        height:134,
        margin:50,
        marginLeft:80
    },
    lictitle:{
        color:"#FFFFFF",
        fontSize:32,
        fontWeight:"bold",
        marginLeft:20
    },
    record:{
        color:"#999999",
        marginTop:"3%",
        marginLeft:"15%",
        fontSize:20,
        fontWeight:"bold"
    },
    conclude:{
        color:"#cccccc",
        marginTop:"3%",
        marginLeft:"8%",
        fontSize:22,
        fontWeight:"bold"
    },
    flatlist:{
        width:150,
        height:30,
        backgroundColor:"#319073",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:20,
        marginTop:"4%",
    },
    time:{
        fontSize:20,
        color:"#BBBBBB",
        fontWeight:"bold"
    },
    
})


const mapStateToProps = state=>{
    return{
        driver:state.driveranalyze.name
    }
}


export default connect(mapStateToProps)(Driveranalyze)