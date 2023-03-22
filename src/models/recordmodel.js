export default{
    namespace:"record",
    state:{
        list:[]
    },
    reducers:{
        SET_record(state,{payload}){
            return{
                ...state,
                list:payload,
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
        }
    },
}