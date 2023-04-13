import { StyleSheet } from 'react-native'

     const text =StyleSheet.create({
        bluetitle:{
            fontSize:52,
            marginBottom:0,
            fontWeight:"bold",
             color:"rgb(51,59,105)",
         },
         bluetitle2:{
            fontSize:52,
            fontWeight:"bold",
            color:"rgb(51,59,105)",
            marginBottom:40
             },
        grawordw:{
            fontSize:30,
             fontWeight:"bold",
             color:'white'
         },
         
        blacktitle:{
     
            color:"black",
            fontSize:30,
            fontWeight:"bold",
            },
            
         drivetype:{
            textAlign:"center",
            marginBottom:20,
            height:50,
            width:300,
            borderWidth:1,
            marginTop:20,
            fontSize:20,
         },
         managertype:{
            textAlign:"center",
            marginBottom:30,
            height:50,
            width:250,
            borderWidth:1,
            marginTop:10,
            fontSize:20,
         },
         ficchoose:{
            fontSize:30,
            fontWeight:"bold",
            textAlign:"center",
            color:"black",
         },
         lictitle:{
            fontSize:30,
            fontWeight:"bold",
            color:"rgb(51,59,105)",
            marginTop:10
         },
         lictype:{
            textAlign:'center',
            height:50,
            width:250,
            borderWidth:2,
            borderColor:"rgb(51,59,105)",
            marginBottom:10,
            fontSize:20,
            backgroundColor:"white",
         },
         licchoose:{
            fontSize:20,
            fontWeight:"bold",
            color:"white"
         },
         licbottom:{
            fontSize:30,
            fontWeight:"bold",
            color:"black",
         },
         licadd:{
            fontSize:35,
            fontWeight:"bold",
            color:"black",
            
         },
         licaddtype:{
            height:55,
            width:240,
            backgroundColor:"white",
            marginTop:30,
            fontSize:25,
            textAlign:'center',

         },
         recordtype:{
            textAlign:'center',
            height:50,
            width:220,
            borderWidth:2,
            borderColor:"rgb(51,59,105)",
            marginBottom:10,
            fontSize:20,
            backgroundColor:"white",
         },
         dateconfirm:{
            fontSize:20,
            fontWeight:"bold",
            color:"black",
         },
     })
     const vie =StyleSheet.create({
        container:{
            backgroundColor:"rgb(205,205,205)",
            flex:1,
            
    
        },
        home:{
            justifyContent:"center",
            backgroundColor:"rgb(205,205,205)",
            flexDirection:"column",
            marginBottom:100,
            flex:2,
            justifyContent:"center",
            alignItems:"center",
        },
        home2:{
            width:350,
            backgroundColor:"rgb(205,205,205)",
            flexDirection:'row',
            marginBottom:150,
            flex:1,
            justifyContent:"center",
            alignItems:"center",
    
        },
        lictitle:{
            flex:0.5,
            justifyContent:"center",
            alignItems:'center',
        },
        lictype:{
            flex:1,
            justifyContent:"center",
            alignItems:'center',
            flexDirection:'row',
        },
        lic:{
            flex:5,
            justifyContent:"center",
            alignItems:"center",
        },
        licbottom:{
            flex:1,
            justifyContent:'space-around',
            alignItems:'center',
            flexDirection:"row",
            padding:19
        },
        line:{
            height: 1,
            backgroundColor: 'black',
        },
        licadd:{
            flex:1,
            justifyContent:"center",
            alignItems:"center"

        },
        modalContainer: {
            justifyContent:'flex-end',
            alignItems:'center',
            backgroundColor:'white',
        },
          datePicker: {
            width: 200,
            marginBottom: 20
          },
          recbottom:{
            flex:1,
            justifyContent:'space-around',
            alignItems:'center',
            flexDirection:"row",
            
        },
     })
     const gra=StyleSheet.create({
        cir:{
            alignItems:"center",
            width:150,
            height:150,
            backgroundColor:"rgb(51,59,105)",
            borderRadius:150/2,
            fontSize:20,
            justifyContent:"center",
            marginLeft:70,
        },
        squ:{
            backgroundColor:"rgb(51,59,105)",
            width:150,
            height:50,
            justifyContent:"center",
            alignItems:"center",
        },
        ficchoose:{
            borderColor:"rgb(51,59,105)",
            borderWidth:5,
            width:250,
            height:70,
            alignItems:"center",
            justifyContent:"center",


        },
        licchoose:{
            width:230,
            height:50,
            backgroundColor:"rgb(124,124,124)",
            alignItems:"center",
            justifyContent:"center",
            borderColor:"white",
            borderWidth:1.5,
        },
        licbottom:{
            width:250,
            height:85,
            borderColor:"white",
            borderWidth:4,
            alignItems:"center",
            justifyContent:"center",
            borderRadius: 10,
            
            
        },
        licaddbottom:{
            backgroundColor:"rgb(51,59,105)",
            width:150,
            height:50,
            justifyContent:"center",
            alignItems:"center",
            marginTop:30
            
        },
        datechoose:{
            width:50,
            height:50,
            backgroundColor:"rgb(231,222,190)",
            marginLeft:10,
            marginBottom:10,
        },
        dateconfirm:{
            width:100,
            height:40,
            borderColor:"blue",
            borderWidth:2,
            alignItems:"center",
            justifyContent:"center",
            borderRadius: 10,
            
        },
        viochoose:{
            width:200,
            height:40,
            backgroundColor:"rgb(124,124,124)",
            alignItems:"center",
            justifyContent:"center",
            borderColor:"white",
            borderWidth:1.5,
        },
     })
     
export{text,vie,gra}