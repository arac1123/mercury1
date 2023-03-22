export default{
    namespace:"own",
    state:{
        list:[],
    },
    reducers:{
        SET_own(state,{payload}){
            return{
                ...state,
                list:payload,
            };
        }
    },
    effects:{
        *Post_own({payload,callback},{put}){
            yield put({
                type:"SET_own",payload:payload,
            });
            if(callback){
            callback();
            }
        },
    },
}