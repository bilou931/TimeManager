


import { user_info } from "./Profil";
import { StatusBar, StyleSheet, Text, TextInput, View, ScrollView,ImageBackground, Platform, TouchableOpacity, Button, LogBox } from "react-native";
import React,{useState} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
 Menu,
 MenuProvider,
 MenuOptions,
 MenuOption,
 MenuTrigger,
} from "react-native-popup-menu";
import { google_access_token } from "./Profil";


 let start_event= [];
let end_event= [];
let title_event= [];
let location_event= [];

let modulable_start_event= [];
let modulable_location_event= [];
let modulable_title_event= [];
let modulable_description_event= [];
let modulable_end_event = []


let Arrival;
let event_schedule;
export let chosen_date = new Date().toJSON().slice(0,10)

let valuemenurequest="Mode"
let startadressrequest;
let travelduration = []
let starting_time = ["2023-02-25T08:00:00+01:00"]


function diff_hours(dt2, dt1) 
 {

  var diff = Math.abs(dt2.getHours() - dt1.getHours());
  if (diff < 1)
    return 1
  return diff
  
 }

function convertToDateTimeForMapsRequest (selecteddate) {
  const newdate = selecteddate;
  let new_month;
  let new_day;
  let new_year;
  let new_minute
  let new_hours
  let tempdate = new Date(newdate);
  if ((tempdate.getMonth()+1) < 10) {
    new_month = '0'+(tempdate.getMonth()+1);
  }
  else new_month = (tempdate.getMonth()+1);
  if (tempdate.getDate() < 10) {
    new_day = '0'+tempdate.getDate();
  }
  else new_day = tempdate.getDate();
  new_year = tempdate.getFullYear();
  if (tempdate.getHours() < 10) {
    new_hours = '0'+tempdate.getHours()
  }
  else new_hours = tempdate.getHours();
  if (tempdate.getMinutes()<10) {
    new_minute = '0'+tempdate.getMinutes()
  }
  else new_minute = tempdate.getMinutes();
  let mydatebegin= new_year+'/'+new_month+'/'+new_day+' '+new_hours+":"+ new_minute +":00";
  return mydatebegin
}

export async function getGpsCoord(adresse){
  let response = await fetch("http://api.positionstack.com/v1/forward?access_key=ce0cabdffceba88f697570ca071956b7&query="+adresse)
  let content = await response.json()
  let result = content.data[0].latitude +","+ content.data[0].longitude
  return result
}

export async function canInsertEvent(index_main, index_second, start_coord) {
  //////    request with new paramter ///////////:
  let new_arrival = convertToDateTimeForMapsRequest(modulable_start_event[index_second])
  let coord_insert_event= await getGpsCoord(modulable_location_event[index_second])
  // console.log("CaninsertEvent First request:////////////////")
  // console.log("start adress "+ start_coord)
  // console.log("arrival insert event "+ modulable_location_event[index_second])
  // console.log("arrival time" +new_arrival)
  let response = await fetch("http://dev.virtualearth.net/REST/v1/Routes/"+valuemenurequest+"?"+"wayPoint.1="+start_coord+"&wayPoint.2="+coord_insert_event+"&timeType=Arrival&dateTime="+new_arrival+"&optimize=timeWithTraffic"+"&key=AnohBX4TT6Nd5E532VxJqbuBFoRsbmj9S-z_r_ZXZU7jxTa6GIoH9qD6eFsrqqOo",
  {headers:{Accept: "application/json"}})
  let content = await response.json()
  /////////////////// 2 variables: time in second from start to event, + time of the event
  let time_start_to_new_point = Number(content.resourceSets[0].resources[0].travelDurationTraffic.toString())
  let event_time_in_second = diff_hours(new Date(modulable_end_event[index_second]), new Date(modulable_start_event[index_second]))*3600
    console.log(time_start_to_new_point)
    console.log(event_time_in_second)
     ///////////////////request to have the time from insert event to real target event:
    let new_depart = await getGpsCoord(modulable_location_event[index_second])
    let real_target = await getGpsCoord(location_event[index_main])
    let arrival_time = convertToDateTimeForMapsRequest(start_event[index_main])
  // console.log("CaninsertEvent Second request:////////////////")
  // console.log("start adress "+ modulable_location_event[index_second])
  // console.log("arrival to real event "+ location_event[index_main])
  // console.log("arrival time" +arrival_time)
    let response2 = await fetch("http://dev.virtualearth.net/REST/v1/Routes/"+valuemenurequest+"?"+"wayPoint.1="+new_depart+"&wayPoint.2="+real_target+"&timeType=Arrival&dateTime="+arrival_time+"&optimize=timeWithTraffic"+"&key=AnohBX4TT6Nd5E532VxJqbuBFoRsbmj9S-z_r_ZXZU7jxTa6GIoH9qD6eFsrqqOo",
    {headers:{Accept: "application/json"}})
    let ccontent = await response2.json()
    //console.log(ccontent.resourceSets[0].resources[0])
    // console.log(ccontent.resourceSets[0].resources[0].routeLegs[0].actualEnd)
    let time_from_insert_to_real_target = Number(ccontent.resourceSets[0].resources[0].travelDurationTraffic.toString())
    console.log(time_from_insert_to_real_target)
    let total_time_insert = time_start_to_new_point + event_time_in_second + time_from_insert_to_real_target
    console.log(total_time_insert)
    let diff_time_between_event = diff_hours(new Date(starting_time[(starting_time.length - 1)]), new Date(start_event[index_main])) * 3600
    if (total_time_insert < diff_time_between_event) {
      modulable_description_event.splice(index_second, 1)
      modulable_end_event.splice(index_second, 1)
      modulable_location_event.splice(index_second, 1)
      modulable_start_event.splice(index_second, 1)
      modulable_title_event.splice(index_second, 1)

      
      return true
    }
    // if (diff_twomain_event)
  // return true
}

export async function RequestMaps(index)
{
  let startingpoint = await getGpsCoord(startadressrequest)
  let target_point = await getGpsCoord(location_event[index])
  let arrival = convertToDateTimeForMapsRequest(start_event[index])
  // console.log("modulable = "+modulable_location_event)
  // console.log("main = "+ location_event)
  // console.log(startadressrequest)
  // console.log(location_event[index])
  // console.log(startingpoint)
  // console.log(target_point)
  // console.log(valuemenurequest)
  // console.log(arrival)
  // console.log(start_event)
  // console.log(end_event)
  console.log("-----------------------^\n\n")

  let response = await fetch("http://dev.virtualearth.net/REST/v1/Routes/"+valuemenurequest+"?"+"wayPoint.1="+startingpoint+"&wayPoint.2="+target_point+"&timeType=Arrival&dateTime="+arrival+"&optimize=timeWithTraffic"+"&key=AnohBX4TT6Nd5E532VxJqbuBFoRsbmj9S-z_r_ZXZU7jxTa6GIoH9qD6eFsrqqOo",
  {headers:{Accept: "application/json"}})
  let content = await response.json();
  console.log("request mapppssss"+response.status)
  // console.log("content request"+content.resourceSets[0].resources[0].travelDurationTraffic.toString())
  
  //////: insert event part////////
  if (response.status===200) {
    for (var i = modulable_start_event.length-1; i>=0 ; i--) {
      // console.log(new Date(starting_time[0]).getTime())
      // console.log(new Date(modulable_start_event[i]).getTime())
      // console.log(new Date(start_event[index]).getTime())
      //{#~#~~~~~~~~~~ CREATE LIST WITH START TIME AND PUT BY DEFAULT THE START DAY TO 8am
  ///// IN ORDER TO HAVE ENCADREMENT (START TIME< INSERT START< START EVENT)
  console.log(starting_time[(starting_time.length -1)])
  console.log(modulable_start_event[i])
  console.log(start_event[index])
    if (new Date(starting_time[(starting_time.length -1)]).getTime() < new Date(modulable_start_event[i]).getTime() && new Date(modulable_start_event[i]).getTime() < new Date(start_event[index]).getTime()
    && new Date(modulable_end_event[i]).getTime() < new Date(start_event[index]).getTime()) {
      /// if horaire start---->Insert--->Target
      // let dt2 = new Date(end_event[i])
      // let dt1 = new Date(start_event[i-1])
      // console.log((dt2.getHours()))
      // console.log((dt1.getHours()))
      // let diff_between_two_main_event= abs(dt2.getHours() -dt1.getHours())
      // console.log(diff_hours(new Date(end_event[i]), new Date(start_event[i-1])))
      if (await canInsertEvent(index, i, startingpoint) === true) {
        // insert event
      }
    }
    // travelduration.push(content.resourceSets[0].resources[0].travelDurationTraffic.toString())
    // console.log(content.resourceSets[0].resources[0].routeLegs[0].startTime.toString())
    // startadressrequest = location_event[index]
  }
  //{#~#~~~~~~~~~~ CREATE LIST WITH START TIME AND PUT BY DEFAULT THE START DAY TO 8am
  ///// IN ORDER TO HAVE ENCADREMENT (START TIME< INSERT START< START EVENT)
  // let temp = new Date()
  starting_time.push(end_event[index]) //// dont forget to put 8am in datetime by default.
  }
}


export async function getCalendarEvent() {
  modulable_description_event = []
  modulable_location_event = []
  modulable_start_event = []
  modulable_title_event = []
  start_event = []
  title_event = []
  end_event = []
  location_event = []
  let email = user_info.email.replace("@", "%40");
  let temp = chosen_date.split(' ');
  let timemin = temp[0].replaceAll("/","-") +'T'+"00%3A01%3A00-07%3A00";
  let  timemax = temp[0].replaceAll("/","-") +'T'+"23%3A59%3A00-07%3A00"
  let response = await fetch("https://www.googleapis.com/calendar/v3/calendars/"+email+"/events?timeMax="+timemax+"&timeMin="+timemin,
      {
        headers: {
          Authorization: `Bearer ${google_access_token}`,
          Accept: "application/json",
        },
      });
      console.log("get calendar event"+response.status)
      let content = await response.json();
      
      if (response.status === 200) {
      if (content.items.length === 0) {
        alert("You don't have events.")
      }
      else {
        for (var i = 0; i< content.items.length; i++) {

            if (content.items[i].description !== undefined && content.items[i].description.includes('Modulable') === true ) {
              modulable_start_event.push(content.items[i].start.dateTime)
              modulable_location_event.push(content.items[i].location)
              modulable_title_event.push(content.items[i].summary)
              modulable_description_event.push(content.items[i].description)
              modulable_end_event.push(content.items[i].end.dateTime)
            }
        else {
          start_event[i] = content.items[i].start.dateTime
          end_event[i] = content.items[i].end.dateTime
          title_event[i] = content.items[i].summary
          location_event[i] = content.items[i].location
        }
      }
      // console.log("modulable event" +modulable_title_event)
      /// boucle pour calculer toutt les trajet imposé.
      // boucle pour calculer le trou de chaque event
      //si possible caller un event en fonctiion du temps que ca dure.
      for (var i = start_event.length-1; i>=0 ; i--) {
        await RequestMaps(i)
        }
      }
    }

}

function setValueMenuRequest(param) {
  valuemenurequest = param
}

function setStartAdressForRequest(param) {
startadressrequest = param
}

export default function Settings() {
  const [bdate, setbeginDate] = useState(new Date());
  // const [chosen_date, setChoosedate] = useState(new Date());
  const [valuemenu, setValue] = useState("Mode");
  const [startAdress, setStartingAdress] = useState("");

  function setChoosedate(value) {
    chosen_date = value
  }

  function choose_mode_to_display_datetimepicker(){
    if (Platform.OS === "ios") {
     return("datetime")
    }
    return("date")
 }

 function changeDateNodeBegin (event, selecteddate) {
  const newdate = selecteddate;
  let new_month;
  let new_day;
  let new_year;
  let new_minute
  let new_hours
  setbeginDate(newdate)
  let tempdate = new Date(newdate);
  if ((tempdate.getMonth()+1) < 10) {
    new_month = '0'+(tempdate.getMonth()+1);
  }
  else new_month = (tempdate.getMonth()+1);
  if (tempdate.getDate() < 10) {
    new_day = '0'+tempdate.getDate();
  }
  else new_day = tempdate.getDate();
  new_year = tempdate.getFullYear();
  if (tempdate.getHours() < 10) {
    new_hours = '0'+tempdate.getHours()
  }
  else new_hours = tempdate.getHours();
  if (tempdate.getMinutes()<10) {
    new_minute = '0'+tempdate.getMinutes()
  }
  else new_minute = tempdate.getMinutes();
  let mydatebegin= new_year+'/'+new_month+'/'+new_day+' '+new_hours+":"+ new_minute +":00";
  setChoosedate(mydatebegin)
  // mydatebegin+='T'+"23%3A59%3A00-07%3A00";
  // console.log("mydatabegin===="+mydatebegin)
}

 return (<>
  <StatusBar hidden/>
  <ScrollView contentContainerStyle={{flexGrow:1}}>
  <ImageBackground source={require('../background.jpg')} style={styles.background}>
    <View style={styles.DivForEachData}>
  <DateTimePicker  is24Hour={true} display="default" value={bdate} onChange={changeDateNodeBegin}/>
    <TouchableOpacity style={styles.DivForButtonGetData}>
  <MenuProvider style={styles.container}>
    <Menu onSelect={value=> setValue(value)}>
      {setValueMenuRequest(valuemenu)}
      <MenuTrigger>
        <Text style={styles.SetTextButton}>{valuemenu}</Text>
      </MenuTrigger>
      <MenuOptions>
        <MenuOption value={"Driving"}>
          <Text>Driving</Text>
        </MenuOption>
        <MenuOption value={"Walking"}>
          <Text>Walking</Text>
        </MenuOption>
        <MenuOption value={"Transit"}>
          <Text>Transit</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  </MenuProvider>
  </TouchableOpacity>
  <TextInput onChangeText={text=>setStartingAdress(text)} style={styles.textinputadress}></TextInput>
  {setStartAdressForRequest(startAdress)}
  <Text style={{fontStyle:'italic',
  textDecorationLine: "underline",
  fontWeight: 'bold',}}>Format: adress, zipcode.</Text>
  <Text>Exemple: 10 avenue de Verdun, 93150.</Text>
  <View style={{backgroundColor:"black", width:"100%"}}>
  <Button  title="butttttt" onPress={()=> getCalendarEvent()}/>
  </View>
  </View>
    </ImageBackground>
    </ScrollView>
   {/* <MenuProvider style={styles.container}> */}
     {/* <Menu> */}
       {/* <MenuTrigger */}
        {/* //  text="Click for Option menu" */}
      {/* //  /> */}
       {/* <MenuOptions> */}
          {/* <TextInput onChangeText={text=> setLocationPopup(text)} value={locationPopup}></TextInput> */}
       {/* </MenuOptions> */}
     {/* </Menu> */}
   {/* </MenuProvider> */}
   </>
 );
};



// demande les besoins utilisateurs(demande pour goole tasks, remplacer par mot clé)
// probleme organisation archi.


const styles = StyleSheet.create({
 container: {
   flex: 1,
  //  backgroundColor: "red",
   justifyContent: "flex-start",
   padding: 30,
   flexDirection: "column",
   width:'100%',
 },
 background: {
  flex: 1,
  alignItems: 'center',
  // justifyContent: 'center',
},
DivForEachData: {
  backgroundColor: 'white',
  opacity:'0.5',
  borderRadius:10,
  // justifyContent:'center',
  alignItems: 'center',
  marginTop:'25%',
  height: '35%',
  width:"95%",
},
optionsdiv:{
  backgroundColor:'blue',
  width:"100%",
  height:"30%",

},
DivForButtonGetData:{
  paddingTop: 60,
  // backgroundColor:'rgba(200, 200, 200, 0.3)',
  alignItems:'center',
  justifyContent:'flex-end',
  width:'100%',
  height:'40%',
  borderRadius:20,
},
SetTextButton: {
  color: '#800080',
  fontSize:'20',
  fontStyle:'italic',
  textDecorationLine: "underline",
  fontWeight: 'bold',
},
textinputadress:{
  backgroundColor:'grey',
  width:'80%',
  height:'20%',
  borderRadius:20,
  textAlign:'center',
  color:'white',
}
});