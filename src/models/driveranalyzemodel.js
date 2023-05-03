export default{
    namespace:"driveranalyze",
    state:{
        name:[],
    },
    reducers:{
        SET_driveranalyze(state,{payload}){
            return{
                ...state,
                name:payload,
            };
        }
    },
    effects:{
        *Post_driveranalyze({payload,callback},{put}){
            yield put({
                type:"SET_driveranalyze",payload:payload,
            });
            if(callback){
            callback();
            }
        }
    },
};