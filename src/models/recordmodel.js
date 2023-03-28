import { call } from "react-native-reanimated";

export default{
    namespace:"record",
    state:{
        list:[],
        duration:[]
    },
    reducers:{
        SET_record(state,{payload}){
            return{
                ...state,
                list:payload,
            };
        },
        SET_duration(state,{payload}){
            return{
                ...state,
                duration:payload,
            };
        }
       
    },
    effects:{
        *Post_record({payload,callback},{put}){
            yield put({
                type:"SET_record",payload:payload,
            });
            if(callback){
            callback();
            }
        },
        *Post_duration({payload,callback},{put}){
            yield put({
                type:"SET_duration",payload:payload,
            });
            if(callback){
                callback();
            }
        }
       
    },
}