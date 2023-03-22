import React,{Component} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import {vie,gra,txt} from "../../Allstyles";
class Passwordchange extends Component{
    render(){
        return(
            <SafeAreaView style={vie.container}>
                
            </SafeAreaView>
        )
    }
}
export default connect()(Passwordchange)