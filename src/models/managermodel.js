export default{
    namespace:'member',
    state:{
        list:[],
    },
    reducers:{
        SET_member(state,{payload}){
            return{
                ...state,
                list:payload,
            };
        },
    },
    effects:{
        *Post_member({payload,callback},{put}){
            yield put({
                type:"SET_member",payload:payload,
            });
            if(callback){
                callback();
            }
        },
    },
};