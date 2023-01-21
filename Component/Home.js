import React ,{ useState } from "react";
import { Text, View, StyleSheet, ImageBackground, ScrollView, Platform, Button, TouchableOpacity, TextInput, ToastAndroid } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
 import { user_info } from "./Profil";
 import { google_access_token } from "./Profil";

let temp_timemin = "r";
let sizediv = 0;

 let month;
 let day;
let mydatebegin;
let mydateend;
 let year = null;
 // variable to stock getEventCalendar:
export let start_event= [];
let end_event= [];
let title_event= [];
let location_event= [];
let list_event_id = [];
///////////////
let list_div_event =[];
let list_to_stock_modify_element=[]

export default function Home() {
  
    const [date, setDate] = useState(new Date());
    const [ndate, setdate] = useState(new Date());
    const [bdate, setbeginDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [text, setText] = useState(null);
    const [last_text, setLastText] = useState(null);
    const [modifyTitle, setTitleModify] = useState(null);
    const [modifyStart, setStartModify] = useState(null);
    const [modifyEnd, setEndModify] = useState(null);
    const [modifyLocation, setLocationModify] = useState(null);
    const [isPressed, setIspressed] = useState(false);
    const [addnodeIsPressed, SetAddNode] = useState(false);
    const [createTitle, setTitleCreate] = useState(null);
    const [createLocation, setLocationCreate] = useState(null);
    const [createStart, setStartCreate] = useState(null);
    const [createEnd, setEndCreate] = useState(null);


    async function GetCalendarEvent() {
      let email = user_info.email.replace("@", "%40");
      let timemax = year+'-'+month+'-'+day+'T'+"23%3A59%3A00-07%3A00";
      let timemin = year+'-'+month+'-'+day+'T'+"00%3A01%3A00-07%3A00";
      console.log(timemax)

      if (timemin !== temp_timemin) {
        start_event = [];
        end_event= []
        title_event = []
        location_event = []
        list_event_id = []
        setIspressed(true)
        temp_timemin = timemin;
      let response = await fetch("https://www.googleapis.com/calendar/v3/calendars/"+email+"/events?timeMax="+timemax+"&timeMin="+timemin, 
      {
        headers: {
          Authorization: `Bearer ${google_access_token}`,
          Accept: "application/json",
        },
      });
      console.log(response.status)
      let content = await response.json();
      //  console.log(content.items)
      if (content.items.length === 0) {
        start_event = [];
        end_event= []
        title_event = []
        location_event = []
        list_event_id = []
    }
    else {
    for (var i = 0; i< content.items.length; i++) {
      start_event[i] = content.items[i].start.dateTime
      end_event[i] = content.items[i].end.dateTime
      title_event[i] = content.items[i].summary
      location_event[i] = content.items[i].location
      list_event_id[i] = content.items[i].id
    }
    }
  }
  pushDivInList()
      // displayCalendarEvent();
    // console.log(start_event)
    
    }

    function changeDateNodeEnd (event, selecteddate) {
      const newdate = selecteddate || date;
      let new_month;
      let new_day;
      let new_year;
      let new_minute
      let new_hours
      setdate(newdate)
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
      mydateend= new_year+'-'+new_month+'-'+new_day+'T'+new_hours+":"+ new_minute +":00+01:00";
      setEndCreate(mydateend)
      // console.log("mydataend===="+mydateend)
    }

    function changeDateNodeBegin (event, selecteddate) {
      const newdate = selecteddate || date;
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
      mydatebegin= new_year+'-'+new_month+'-'+new_day+'T'+new_hours+":"+ new_minute +":00+01:00";
      setStartCreate(mydatebegin)
      // mydatebegin+='T'+"23%3A59%3A00-07%3A00";
      // console.log("mydatabegin===="+mydatebegin)
    }

    const onChange = (event, selectedDate) => {
      
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        if ((tempDate.getMonth()+1) < 10) {
          month = '0'+(tempDate.getMonth()+1);
        }
        else month = (tempDate.getMonth()+1);
        if (tempDate.getDate() < 10) {
          day = '0'+tempDate.getDate();
        }
        else day = tempDate.getDate();
        year = tempDate.getFullYear();
        let fDate = day + '/' +month + '/' + tempDate.getFullYear();
        setText(fDate)
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }
    function choose_mode_to_display_datetimepicker(){
       if (Platform.OS === "ios") {
        return("datetime")
       }
       return("date")
    }

    function PushNewDivInList() {
      list_div_event.push(
        <View title="BUTTON" key={start_event.length} style={styles.DivToShowSingleEvent}>
        {/* <Button title="Modify" onPress={()=>ModifyEvent(i)}/> */}
        <DateTimePicker  mode={choose_mode_to_display_datetimepicker()} value={bdate} onChange={changeDateNodeBegin} style={styles.DivForEachData}/>
        <DateTimePicker  mode={choose_mode_to_display_datetimepicker()} value={ndate} onChange={changeDateNodeEnd} style={styles.DivForEachData}/>
        {/* <TextInput onChangeText={text=> setEndModify(text)} style={styles.DivForEachData}></TextInput> */}
        <TextInput onChangeText={text=> setLocationCreate(text)} style={styles.DivForEachData}></TextInput>
        <TextInput  onChangeText={text=> setTitleCreate(text)} style={styles.DivForEachData}></TextInput>
        <Button title="Create" onPress={()=>CreateNewEvent()}/>
      </View>
      )
    }

    async function CreateNewEvent() {
      console.log(createEnd)
      console.log(createStart)
      console.log(createLocation)
      console.log(createTitle)
      let email = user_info.email.replace("@", "%40");
      let response = await fetch("https://www.googleapis.com/calendar/v3/calendars/"+email+"/events", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${google_access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          "end":{
            "dateTime": createEnd,
            "timeZone": "Europe/Paris"
          },
          "start": {
            "dateTime": createStart,
            "timeZone": "Europe/Paris"
          },
          "location": createLocation,
          "summary": createTitle,
        })
      })
      if (response.status === 200) {
        console.log("requete okkkkk200000")
      }
      let content = await response.json();
      console.log(content)
    }// at the end of the function dont forget : mettre variable usestateCreate a null, vider list_div_event and recall getCalendar event

    function pushDivInList() {
      list_div_event = [];
      list_to_stock_modify_element= [];
      for (let i = 0; i < start_event.length; i++) {
        list_div_event.push(
          <View title="BUTTON" key={i} style={styles.DivToShowSingleEvent}>
            {/* <Button title="Modify" onPress={()=>ModifyEvent(i)}/> */}
            <TextInput onChangeText={text=> setStartModify(text)} style={styles.DivForEachData}>{start_event[i]}</TextInput>
            <TextInput onChangeText={text=> setEndModify(text)} style={styles.DivForEachData}>{end_event[i]}</TextInput>
            <TextInput onChangeText={text=> setLocationModify(text)} style={styles.DivForEachData}>{location_event[i]}</TextInput>
            <TextInput  onChangeText={text=> setTitleModify(text)} style={styles.DivForEachData}>{title_event[i]}</TextInput>
            <Button title="Modify" onPress={()=>ModifyEvent(i)}/>
          </View>
        )
        sizediv+=80;
      }
      if (addnodeIsPressed === true) {
        PushNewDivInList()
      }
      displayCalendarEvent()
    }

    async function ModifyEvent(index) {
      // console.log(modifyTitle)
      // console.log("compar toooo  " + title_event[0])
      if (modifyTitle !== title_event[index] && modifyTitle!==null) {
        title_event[index] = modifyTitle;
      }
      if (modifyLocation !== location_event[index] && modifyLocation !== null) {
        location_event[index] = modifyLocation;
      }
      if (modifyStart !== start_event[index] && modifyStart !== null) {
        start_event[index] = modifyStart;
      }
      if (modifyEnd !== end_event[index] && modifyEnd !== null) {
        end_event[index] = modifyEnd
      }
      let email = user_info.email.replace("@", "%40");
      // console.log("email ===" +email)
      let response = await fetch("https://www.googleapis.com/calendar/v3/calendars/"+email+"/events/"+list_event_id[index],{
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${google_access_token}`,
          Accept: "application/json",
        },
         body:JSON.stringify({
          "end":{
            "dateTime": end_event[index],
            "timeZone": "Europe/Paris"
          },
          "start": {
            "dateTime": start_event[index],
            "timeZone": "Europe/Paris"
          },
          "location": location_event[index],
          "summary": title_event[index]
         })
      });
      let content = await response.json();
      console.log("status code of modify==="+response.status)
    }

    function displayCalendarEvent() {
      console.log(list_div_event.length)
       return (
       <View style={styles.DivToShowAllEvent}>
       <Button title="addnode" onPress={()=> SetAddNode(true)} style={styles.SetTextButton}/>
        <ScrollView>
       {list_div_event}
       </ScrollView>
       </View>
       );
    }

     function display_other_node() {
      if (text !== last_text) {
        // list_div_event = [];
        GetCalendarEvent();
        setLastText(text);
      }
      if (isPressed===true) {
      return(<>
      <View style={styles.DivShowEvent}>
      {displayCalendarEvent()}
       <Button title="addnode" onPress={()=> SetAddNode(true)} style={styles.SetTextButton}/>
    </View>
    <View style={styles.DivForButtonGetData}>
      <Button title="addnode" style={styles.SetTextButton}/>
    </View>
    <>
    </>
    </>
    );
      }
    }

    function button_getdata() {
        if (text !== null) {
            return(
            <TouchableOpacity style={styles.DivForButtonGetData} onPress={() => setIspressed(true)}>
                <Text style={styles.SetTextButton}>Show Events</Text>
            </TouchableOpacity>

            );
        }
    }
    // console.log(modifyLocation)
    // console.log(modifyTitle)

    return (
        <>
    <ScrollView contentContainerStyle={{flexGrow:1}}>
    <ImageBackground source={require('../background.jpg')} style={styles.background}>
    <View style = {styles.backgroundDivDate}>
      {/* <Text>{text}</Text> */}
      <View>
        <Button title="Choose date" onPress={() => showMode('date')}/>
      </View>
      {show && (
        <DateTimePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} display="default" onChange={onChange}/>
      )}
      {button_getdata()}
    </View>
    {display_other_node()}

    </ImageBackground>
    </ScrollView>
    </>);
  }
//   pouvoir partager son calendar.
// dark et light mode
// Choisir jour , afficher event, pouvoir modifier, 
// et enfin generer itinerair jour selectionner.

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    backgroundDivDate: {
        backgroundColor: 'rgba(200, 200, 200, 0.7)',
        borderRadius: '20',
          shadowColor: 'black',
        width: 300,
        height: 250,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '10%',
        
    },
    DivForButtonGetData:{
        marginTop: 60,
        backgroundColor:'rgba(200, 200, 200, 0.3)',
        alignItems:'center',
        justifyContent:'center',
        width:160,
        height:70,
        borderRadius:20,
    },
    SetTextButton: {
        color: '#800080',
        fontSize:'20',
        fontStyle:'italic',
        textDecorationLine: "underline",
        fontWeight: 'bold',
    },
    DivShowEvent: {
      backgroundColor: 'rgba(200, 200, 200, 0.7)',
      borderRadius: '20',
      width: 300,
        height: 550,
        marginTop:10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop:20,
    },

    DivToShowAllEvent: {
      paddingTop:10,
      backgroundColor:"white",
      alignItems:'center',
        justifyContent:'center',
        width:285,
        height:'85%',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    },
    DivToShowSingleEvent: {
      backgroundColor:"black",
      width:275,
      height:250,
      marginTop:20,
      borderRadius:20,
      justifyContent:'center',
      alignItems: 'center'
    },
    DivForEachData: {
      backgroundColor: 'grey',
       borderRadius:20,
      justifyContent:'center',
      alignItems: 'center',
      marginTop:15,
      height: '15%',
      width: 230,
    }
  })