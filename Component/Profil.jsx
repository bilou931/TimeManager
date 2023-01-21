
import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ImageBackground, StyleSheet, Image, Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';

export let user_info;
export let google_access_token;

export default function Profil() {
  const [accessToken, setAccessToken] = React.useState();
  const [user, setUser] = React.useState()
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "151462805855-ppsidiv6ojd54bifesr5bqa77udvcgct.apps.googleusercontent.com",
    iosClientId: "151462805855-oggtak1hudth6474k1258bs9e171prbl.apps.googleusercontent.com",
    expoClientId: "151462805855-qjoeaf2souf60dd6dcra638iokkp3atq.apps.googleusercontent.com",
    scopes: ['openid','https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
  }, );
   React.useEffect(() => {
     if (response?.type === "success") {
      console.log(response.authentication.accessToken.toString())
       setAccessToken(response.authentication.accessToken);
     }
   }, [response]);

   async function getUserData () {
    google_access_token = accessToken;
    console.log(google_access_token);
     let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
     });
     const useInfo = await response.json();
     setUser(useInfo)
     user_info = useInfo;
   };

   const ShowUserInfo = () => {
    if (user) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
         <Text style={{fontSize:35, fontWeight:'bold', marginBottom:20}}>Welcome</Text>
         <Image source={{uri:user.picture}} style={{width:100, height:100, borderRadius:50}}/>
         <Text style={{fontSize:20, fontWeight:'bold'}}>{user.name}</Text>
         </View>
      )
    }
   }
    return (
        <>
    <ImageBackground source={require('../background.jpg')} style={styles.background}>
      
      {/* <TopBar/> */}
      <View style={styles.container}>
   <View style={styles.container}> 
        {ShowUserInfo()}
       <Text>Welcome, {}</Text>
        <Button title={accessToken ? "Get user data":"Login"} onPress={accessToken ? getUserData : () => promptAsync({useProxy: true, showInRecents:true})} style={styles.googleSignInButton}/>
           <Text style={styles.googleSignInButtonText}>Sign in with Google</Text>
    </View>
      </View>
      </ImageBackground>
    </>);
  }

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: 20,
      borderRadius: 10,
    },
    googleSignInButton: {
      backgroundColor: '#dd4b39',
      padding: 10,
      borderRadius: 5,
    },
    googleSignInButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  })