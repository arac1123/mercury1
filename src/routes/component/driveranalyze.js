import React,{Component} from "react";
import url from "../../url";
import { StyleSheet, View ,Image,Text, Button } from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

class Driveranalyze extends Component{

    state={
        vionetdata:[],
        recnetdata:[],
        duration:null,
        yawn:0,
        wink:0,
        distrack:0,
        closeeye:0,
        viofre:[24],
        warn:0,
        lastdrive:'nah',
    }

    //搜尋該駕駛這七天的違規情形
    searchvio=()=>{
        fetch(`http://${url}/driverviocount?name=${this.props.driver}`)
        .then(response=>response.json())
        .then(response=>{
            this.setState({vionetdata:response}, () => {
                this.countviotime();
                this.countviofrequency();
              });        })
    }

    searchrecord=()=>{
        fetch(`http://${url}/driverrecord?name=${this.props.driver}`)
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
          
          const totalDuration = new Date(totalMilliseconds).toISOString().substr(11, 8);
          this.setState({ duration: totalDuration });
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
        let i=[];
        i[0] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="00"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[1]= this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="01"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[2] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="02"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[3] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="03"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[4] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="04"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[5] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="05"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[6] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="06"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[7] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="07"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[8] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="08"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[9] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="09"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[10] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="10"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[11] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="11"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[12] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="12"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[13] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="13"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[14] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="14"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[15] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="15"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[16] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="16"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[17] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="17"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[18] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="18"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[19] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="19"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[20] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="20"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[21] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="21"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[22] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="22"){
            return acc+1;
            }else{
                return acc;
            }
        },0);
        i[23] = this.state.vionetdata.reduce((acc,item)=>{
            if(item.datetime.substring(11,13)==="23"){
            return acc+1;
            }else{
                return acc;
            }
        },0);

        let max = Math.max(...i);
        let index = i.indexOf(max);
        this.setState({warn:index});
        

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
                        <Text style={styles.record}>最近一周駕駛次數 : {this.state.recnetdata.length}</Text>
                        <Text style={styles.record}>最近一周駕駛總時長 : {this.state.duration}</Text>
                        <Text style={styles.record}>最近一周違規次數 : {this.state.vionetdata.length}</Text>
                        <Text style={styles.conclude}>駕駛於{this.state.recnetdata.length>1?this.state.warn-8:"nah"}:00~{this.state.recnetdata.length>1?this.state.warn-7:"nah"}:00時段容易分心 </Text>

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
    }
    
})


const mapStateToProps = state=>{
    return{
        driver:state.driveranalyze.name
    }
}


export default connect(mapStateToProps)(Driveranalyze)