export default{
    namespace:'drive',
    state:{
        list:'',
        name:'',
    },
    reducers:{
        SET_driver(state,{payload}){
            return{
                ...state,
                list:payload,
            };
        },
        SET_name(state,{payload}){
            return{
                ...state,
                name:payload,
            };
        },
    },
    effects:{
            *Post_driver({payload,callback},{put}){
            yield put({
                type:"SET_driver",payload:payload,
            });
            if(callback){
                callback();
            }
        },
            *Post_name({payload,callback},{put}){
                yield put({
                    type:"SET_name",payload:payload,
                });
                if(callback){
                    callback();
                }
            }
        
    },
};