export default{
    namespace:"license",
    state:{
        list:[]
    },
    reducers:{
        SET_license(state,{payload}){
            return{
                ...state,
                list:payload,
            };
        }
    },
    effects:{
        *Post_license({payload,callback},{put}){
            yield put({
                type:"SET_license",payload:payload,
            });
            if(callback){
            callback();
            }
        }
    },
}