


import { user_info } from "./Profil";
import { StatusBar, StyleSheet, Text, TextInput, View, Image, ScrollView, ImageBackground, Platform, TouchableOpacity, Button, LogBox } from "react-native";
import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { google_access_token } from "./Profil";


let start_event = [];
let end_event = [];
let title_event = [];
let location_event = [];

let modulable_start_event = [];
let modulable_location_event = [];
let modulable_title_event = [];
let modulable_description_event = [];
let modulable_end_event = []


let Arrival;
let event_schedule;
export let chosen_date = new Date().toJSON().slice(0, 10)

let valuemenurequest = "Mode"
let startadressrequest;
let travelduration = []
let starting_time = ["2023-02-25T08:00:00+01:00"]
let temp_path = []
let hours_display = []




export default function Settings() {
  const [bdate, setbeginDate] = useState(new Date());
  // const [chosen_date, setChoosedate] = useState(new Date());
  const [valuemenu, setValue] = useState("Mode");
  const [startAdress, setStartingAdress] = useState("");
  const [list_display, setDisplay] = useState([])

  function secondToHoursAndMinutes(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
  
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { h: hours, m: minutes, s: seconds };
  }


  function diff_hours(dt2, dt1) {

    var diff = Math.abs(dt2.getHours() - dt1.getHours());
    if (diff < 1)
      return 1
    return diff

  }

  function convertToDateTimeForMapsRequest(selecteddate) {
    const newdate = selecteddate;
    let new_month;
    let new_day;
    let new_year;
    let new_minute
    let new_hours
    let tempdate = new Date(newdate);
    if ((tempdate.getMonth() + 1) < 10) {
      new_month = '0' + (tempdate.getMonth() + 1);
    }
    else new_month = (tempdate.getMonth() + 1);
    if (tempdate.getDate() < 10) {
      new_day = '0' + tempdate.getDate();
    }
    else new_day = tempdate.getDate();
    new_year = tempdate.getFullYear();
    if (tempdate.getHours() < 10) {
      new_hours = '0' + tempdate.getHours()
    }
    else new_hours = tempdate.getHours();
    if (tempdate.getMinutes() < 10) {
      new_minute = '0' + tempdate.getMinutes()
    }
    else new_minute = tempdate.getMinutes();
    let mydatebegin = new_year + '/' + new_month + '/' + new_day + ' ' + new_hours + ":" + new_minute + ":00";
    return mydatebegin
  }

  async function getGpsCoord(adresse) {
    let response = await fetch("http://api.positionstack.com/v1/forward?access_key=ce0cabdffceba88f697570ca071956b7&query=" + adresse)
    let content = await response.json()
    let result = content.data[0].latitude + "," + content.data[0].longitude
    return result
  }

  async function canInsertEvent(index_main, index_second, start_coord) {
    //////    request with new paramter ///////////:
    let new_arrival = convertToDateTimeForMapsRequest(modulable_start_event[index_second])
    let coord_insert_event = await getGpsCoord(modulable_location_event[index_second])
    // console.log("CaninsertEvent First request:////////////////")
    // console.log("start adress "+ start_coord)
    // console.log("arrival insert event "+ modulable_location_event[index_second])
    // console.log("arrival time" +new_arrival)
    let response = await fetch("http://dev.virtualearth.net/REST/v1/Routes/" + valuemenurequest + "?" + "wayPoint.1=" + start_coord + "&wayPoint.2=" + coord_insert_event + "&timeType=Arrival&dateTime=" + new_arrival + "&optimize=timeWithTraffic" + "&key=AnohBX4TT6Nd5E532VxJqbuBFoRsbmj9S-z_r_ZXZU7jxTa6GIoH9qD6eFsrqqOo",
      { headers: { Accept: "application/json" } })
    let content = await response.json()
    if (content.resourceSets[0].resources[0] === undefined) {
      alert("Api error:\nPlease retry")
    }
    /////////////////// 2 variables: time in second from start to event, + time of the event
    let time_start_to_new_point = Number(content.resourceSets[0].resources[0].travelDurationTraffic.toString())
    let event_time_in_second = diff_hours(new Date(modulable_end_event[index_second]), new Date(modulable_start_event[index_second])) * 3600
    console.log(time_start_to_new_point)
    console.log(event_time_in_second)
    ///////////////////request to have the time from insert event to real target event:
    let new_depart = await getGpsCoord(modulable_location_event[index_second])
    let real_target = await getGpsCoord(location_event[index_main])
    let arrival_time = convertToDateTimeForMapsRequest(start_event[index_main])
    // console.log("CaninsertEvent Second request:////////////////")
    // console.log("start adress "+ modulable_location_event[index_second])
    // console.log("arrival to real event "+ location_event[index_main])
    console.log(new_depart)
    console.log(real_target)
    console.log("arrival time" + arrival_time)
    if (response.status === 200) {
      let response2 = await fetch("http://dev.virtualearth.net/REST/v1/Routes/" + valuemenurequest + "?" + "wayPoint.1=" + new_depart + "&wayPoint.2=" + real_target + "&timeType=Arrival&dateTime=" + arrival_time + "&optimize=timeWithTraffic" + "&key=AnohBX4TT6Nd5E532VxJqbuBFoRsbmj9S-z_r_ZXZU7jxTa6GIoH9qD6eFsrqqOo",
        { headers: { Accept: "application/json" } })
      let ccontent = await response2.json()
      if (ccontent.resourceSets[0].resources[0] === undefined) {
        alert("Api error:\nPlease retry")
      }
      // console.log(ccontent.resourceSets[0].resources[0])
      // console.log(ccontent.resourceSets[0].resources[0].routeLegs[0].actualEnd)
      console.log("BRRAKPOINT")
      let time_from_insert_to_real_target = Number(ccontent.resourceSets[0].resources[0].travelDurationTraffic.toString())
      console.log(time_from_insert_to_real_target)
      let total_time_insert = time_start_to_new_point + event_time_in_second + time_from_insert_to_real_target
      console.log(total_time_insert)
      let diff_time_between_event = diff_hours(new Date(starting_time[(starting_time.length - 1)]), new Date(start_event[index_main])) * 3600
      console.log(diff_time_between_event)
      if (total_time_insert < diff_time_between_event) {
        //push time from start to insert and insert to real target.
        // modulable_description_event.splice(index_second, 1)
        // modulable_end_event.splice(index_second, 1)
        // modulable_location_event.splice(index_second, 1)
        // modulable_start_event.splice(index_second, 1)
        // modulable_title_event.splice(index_second, 1)
        return {bool: true, startToP:time_start_to_new_point, pToRealP:time_from_insert_to_real_target}
      }
      else { return {bool: false, startToP:0, pToRealP:0}  }
    }
    else { return {bool: false, startToP:0, pToRealP:0} }
  }

function substractHours(time, date) {
  let tempdate = new Date(date)
  let hours = Number(tempdate.getHours()) -Number(time.h)
  let minutes = 0
  if (Number(tempdate.getMinutes()) === 0) {
    hours-=1
    minutes = 60- Number(time.m) - 5
  }
  else {
    minutes = Number(tempdate.getMinutes())- Number(time.m) - 5
  
 if (minutes < 0) {
  hours-=1
  minutes = (60 + Number(tempdate.getMinutes())) - Number(time.m) - 5
 }
}
 let second = Math.abs(Number(tempdate.getSeconds())- Number(time.s))
 return {h: hours, m: minutes, s: second}
}

  async function RequestMaps(index) {
    let startingpoint = await getGpsCoord(startadressrequest)
    let target_point = await getGpsCoord(location_event[index])
    let arrival = convertToDateTimeForMapsRequest(start_event[index])
    console.log("start event===" + start_event[index])
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

    let response = await fetch("http://dev.virtualearth.net/REST/v1/Routes/" + valuemenurequest + "?" + "wayPoint.1=" + startingpoint + "&wayPoint.2=" + target_point + "&timeType=Arrival&dateTime=" + arrival + "&optimize=timeWithTraffic" + "&key=AnohBX4TT6Nd5E532VxJqbuBFoRsbmj9S-z_r_ZXZU7jxTa6GIoH9qD6eFsrqqOo",
      { headers: { Accept: "application/json" } })
    let content = await response.json();
    console.log("request mapppssss" + response.status + "\n" + content.statusDescription.toString())
    console.log(content.errorDetails)
    // console.log("content request"+content.resourceSets[0].resources[0].travelDurationTraffic.toString())

    //////: insert event part////////
    if (response.status === 200) {
      // temp_path.push(startadressrequest)
      for (var i = 0; i != modulable_start_event.length; i++) {
        //{#~#~~~~~~~~~~ CREATE LIST WITH START TIME AND PUT BY DEFAULT THE START DAY TO 8am
        ///// IN ORDER TO HAVE ENCADREMENT (START TIME< INSERT START< START EVENT)
        if (new Date(starting_time[(starting_time.length - 1)]).getTime() < new Date(modulable_start_event[i]).getTime() && new Date(modulable_start_event[i]).getTime() < new Date(start_event[index]).getTime()
          && new Date(modulable_end_event[i]).getTime() < new Date(start_event[index]).getTime()) {
          console.log(starting_time[(starting_time.length - 1)])
          console.log(modulable_start_event[i])
          console.log(start_event[index])
          /// if horaire start---->Insert--->Target
          // let dt2 = new Date(end_event[i])
          // let dt1 = new Date(start_event[i-1])
          // console.log((dt2.getHours()))
          // console.log((dt1.getHours()))
          // let diff_between_two_main_event= abs(dt2.getHours() -dt1.getHours())
          // console.log(diff_hours(new Date(end_event[i]), new Date(start_event[i-1])))
          let insert = (await canInsertEvent(index, i, startingpoint))
          if ( insert.bool === true) {
            console.log("insert elemrnt ==" + modulable_location_event[i])
            let time = secondToHoursAndMinutes(insert.startToP)
            let time_to_insert = substractHours(time, modulable_start_event[i])
            hours_display.push(time_to_insert.h+ ":"+time_to_insert.m+ ":"+time_to_insert.s)
            temp_path.push(modulable_location_event[i]+"--->" + modulable_start_event[i])
            let time2 = secondToHoursAndMinutes(insert.pToRealP)
            console.log(time2)
            let time_insert_to_event = substractHours(time2,start_event[index])
            hours_display.push(time_insert_to_event.h+":"+time_insert_to_event.m+":"+time_insert_to_event.s)
            temp_path.push(location_event[index]+"--->" + start_event[index])
            // insert event
          }
        }
        // travelduration.push(content.resourceSets[0].resources[0].travelDurationTraffic.toString())
        // console.log(content.resourceSets[0].resources[0].routeLegs[0].startTime.toString())
      }
      // console.log(bool_list)
      // if (bool_list[index] === false) {
        // let duration = Number(content.resourceSets[0].resources[0].travelDurationTraffic.toString())
        // second /3600 to convert into hour
        // end event - travel duration = temps au quel il faut partir
      // }
      // console.log(location_event[index])
      
      
      startadressrequest = location_event[index]
      //{#~#~~~~~~~~~~ CREATE LIST WITH START TIME AND PUT BY DEFAULT THE START DAY TO 8am
      ///// IN ORDER TO HAVE ENCADREMENT (START TIME< INSERT START< START EVENT)
      // let temp = new Date()
      starting_time.push(end_event[index]) //// dont forget to put 8am in datetime by default.
      console.log("temp path =====  " + temp_path)
      for (var j = 0; j < temp_path.length; j++) {
        if (temp_path[j].includes(location_event[index]) === true) {
          return
        }
      }
      let time = secondToHoursAndMinutes(Number(content.resourceSets[0].resources[0].travelDurationTraffic.toString()))
      let time_insert = substractHours(time, start_event[index])
      hours_display.push(time_insert.h+":"+time_insert.m+":"+time_insert.s)
      temp_path.push(location_event[index] +"--->" + start_event[index])
      console.log("temp path =====  " + temp_path)
      // console.log("starting time==="+starting_time)
    }
  }


  async function getCalendarEvent() {
    setDisplay([])
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
    let timemin = temp[0].replaceAll("/", "-") + 'T' + "00%3A01%3A00-07%3A00";
    let timemax = temp[0].replaceAll("/", "-") + 'T' + "23%3A59%3A00-07%3A00"
    let response = await fetch("https://www.googleapis.com/calendar/v3/calendars/" + email + "/events?timeMax=" + timemax + "&timeMin=" + timemin + "&orderBy=startTime&singleEvents=true",
      {
        headers: {
          Authorization: `Bearer ${google_access_token}`,
          Accept: "application/json",
        },
      });
    console.log("get calendar event" + response.status)
    let content = await response.json();
    if (response.status === 200) {
      if (content.items.length === 0) {
        alert("You don't have events.")
      }
      else {
        for (var i = 0; i < content.items.length; i++) {

          if (content.items[i].description !== undefined && content.items[i].description.includes('Modulable') === true) {
            modulable_start_event.push(content.items[i].start.dateTime)
            modulable_location_event.push(content.items[i].location)
            modulable_title_event.push(content.items[i].summary)
            modulable_description_event.push(content.items[i].description)
            modulable_end_event.push(content.items[i].end.dateTime)
          }
          else {
            start_event.push(content.items[i].start.dateTime)
            end_event.push(content.items[i].end.dateTime)
            title_event.push(content.items[i].summary)
            location_event.push(content.items[i].location)
          }
        }
        console.log("modulable event" + modulable_title_event)
        // / boucle pour calculer toutt les trajet imposé.
        // boucle pour calculer le trou de chaque event
        // si possible caller un event en fonctiion du temps que ca dure.
        temp_path.push(startadressrequest)
        console.log("modulable event list" + modulable_start_event)
        for (var i = 0; i != start_event.length; i++) {
          await RequestMaps(i)
        }
      }
    }
    if (temp_path.length !== 0) {
      display_result()
    }
    modulable_description_event = []
    modulable_location_event = []
    modulable_start_event = []
    modulable_title_event = []
    start_event = []
    title_event = []
    end_event = []
    location_event = []
    starting_time = ["2023-02-25T08:00:00+01:00"]
    temp_path = []

  }

  function setValueMenuRequest(param) {
    valuemenurequest = param
  }

  function setStartAdressForRequest(param) {
    startadressrequest = param
  }

  function display_result() {
    console.log(temp_path.length)
    let temp = []
    for (var i = 0; i < temp_path.length; i++) {
      if (i === 0) {
        temp.push(<View key={i} style={styles.divForResult}>
          {/* <Text key={i+1} style={styles.textResult}>Start Point</Text> */}
          <Text key={i+2} style={styles.textResult}>{temp_path[i]}</Text>
          <Image style = {{ width: 50, height: 50 }} source={require('../assets/arrow.png')}/>
          <Text key={i+3} style={styles.setHoursResult}>{hours_display[i]}</Text>
          <Image style = {{ width: 50, height: 50 }} source={require('../assets/arrow.png')}/>
        </View>)
      }
      else if (i === temp_path.length - 1) {
        temp.push(<View key={i} style={styles.divForResult}>
          <Text key={i+1} style={styles.textResult}>{temp_path[i]}</Text>
          {/* <Text key={i+2} style={styles.textResult}>End Point</Text> */}
        </View>)
      }
      else {
        temp.push(<View key={i} style={styles.divForResult}>
          {/* <Text key={i+1} style={styles.textResult}>Middle Point</Text> */}
          <Text key={i+2} style={styles.textResult}>{temp_path[i]}</Text>
          <Image style = {{ width: 50, height: 50 }} source={require('../assets/arrow.png')}/>
          <Text key={i+3} style={styles.setHoursResult}>{hours_display[i]}</Text>
          <Image style = {{ width: 50, height: 50 }} source={require('../assets/arrow.png')}/>
        </View>)
      }
      
    }
    setDisplay(temp)
  }

  function setChoosedate(value) {
    chosen_date = value
  }

  function choose_mode_to_display_datetimepicker() {
    if (Platform.OS === "ios") {
      return ("datetime")
    }
    return ("date")
  }

  function changeDateNodeBegin(event, selecteddate) {
    const newdate = selecteddate;
    let new_month;
    let new_day;
    let new_year;
    let new_minute
    let new_hours
    setbeginDate(newdate)
    let tempdate = new Date(newdate);
    if ((tempdate.getMonth() + 1) < 10) {
      new_month = '0' + (tempdate.getMonth() + 1);
    }
    else new_month = (tempdate.getMonth() + 1);
    if (tempdate.getDate() < 10) {
      new_day = '0' + tempdate.getDate();
    }
    else new_day = tempdate.getDate();
    new_year = tempdate.getFullYear();
    if (tempdate.getHours() < 10) {
      new_hours = '0' + tempdate.getHours()
    }
    else new_hours = tempdate.getHours();
    if (tempdate.getMinutes() < 10) {
      new_minute = '0' + tempdate.getMinutes()
    }
    else new_minute = tempdate.getMinutes();
    let mydatebegin = new_year + '/' + new_month + '/' + new_day + ' ' + new_hours + ":" + new_minute + ":00";
    setChoosedate(mydatebegin)
    // mydatebegin+='T'+"23%3A59%3A00-07%3A00";
    // console.log("mydatabegin===="+mydatebegin)
  }
  // console.log(list_display)
  return (<>
    <StatusBar hidden />
      <ImageBackground source={require('../background.jpg')} style={styles.background}>
      <ScrollView  contentContainerStyle={{ flexGrow: 1 , alignItems:"center"}} style={styles.scroll}>
        <View style={styles.DivForEachData}>
          <DateTimePicker is24Hour={true} display="default" value={bdate} onChange={changeDateNodeBegin} />
          <TouchableOpacity style={styles.DivForButtonGetData}>
            <MenuProvider style={styles.container}>
              <Menu onSelect={value => setValue(value)}>
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
          <TextInput onChangeText={text => setStartingAdress(text)} style={styles.textinputadress}></TextInput>
          {setStartAdressForRequest(startAdress)}
          <Text style={{
            fontStyle: 'italic',
            textDecorationLine: "underline",
            fontWeight: 'bold',
          }}>Format: adress, zipcode.</Text>
          <Text>Exemple: 10 avenue de Verdun, 93150.</Text>
          <View style={{ backgroundColor: "black", width: "100%" }}>
            <Button title="butttttt" onPress={() => getCalendarEvent()} />
          </View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 , alignItems:"center", paddingTop:15}} style={styles.scroll}>
          {list_display && list_display.map((display, index) => (
            <View key={index}>
              {display}
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      </ImageBackground>
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
    width: '100%',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  DivForEachData: {
    backgroundColor: 'white',
    opacity: '0.5',
    borderRadius: 10,
    // justifyContent:'center',
    alignItems: 'center',
    marginTop: '25%',
    height: '35%',
    width: "95%",
  },
  optionsdiv: {
    backgroundColor: 'blue',
    width: "100%",
    height: "30%",

  },
  DivForButtonGetData: {
    paddingTop: 60,
    // backgroundColor:'rgba(200, 200, 200, 0.3)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: '40%',
    borderRadius: 20,
  },
  SetTextButton: {
    color: '#800080',
    fontSize: '20',
    fontStyle: 'italic',
    textDecorationLine: "underline",
    fontWeight: 'bold',
  },
  textinputadress: {
    backgroundColor: 'grey',
    width: '80%',
    height: '20%',
    borderRadius: 20,
    textAlign: 'center',
    color: 'white',
  },
  divForResult: {
    // backgroundColor: 'grey',
    width: 300,
    height: 320,
    borderRadius: 20,
    textAlign: 'center',
    paddingTop:15,
    justifyContent:"center",
    alignItems:"center"
  },
  scroll: {
    width:"100%",
    height:"100%",
  },
  textResult: {
    color:"grey",
    fontSize: '20',
    fontStyle: 'italic',
    // fontFamily:"Lucida Console",
    fontWeight: 'bold',
    paddingBottom: 30,
    paddingTop:10,
  },
  setHoursResult: {
    color:"white",
    fontSize: '20',
    fontStyle: 'italic',
    // fontFamily:"Lucida Console",
    textDecorationLine: "underline",
    fontWeight: 'bold',
    paddingBottom: 30,
    paddingTop:10,
  }
});