import {Button, StyleSheet, Text, TextInput, View,} from "react-native";
import React,{ useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

   export default function changeModifyDateBegin (event, selecteddate) {
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
        let result = new_year+'-'+new_month+'-'+new_day+'T'+new_hours+":"+ new_minute +":00+01:00";
        console.log("result ===="+result)
}

const styles = StyleSheet.create({
    popupbackground:{
      backgroundColor:'white',
      justifyContent: "center",
      alignItems: "center",
      width:'100%',
      height:'100%'
    },
})