
import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ImageBackground, StyleSheet, Image, Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import TopBar from './Component/TopBar';
import Home from './Component/Home';
import  Settings  from './Component/Settings';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profil from './Component/Profil';

const Tab = createBottomTabNavigator();



// const Home=() => {
  // return (<div>
    {/* <Text>Home</Text> */}
  {/* </div>) */}
// }

const About =() => {
  return (<div>
    <Text>About</Text>
  </div>)
}

export default function App() {
  // const [accessToken, setAccessToken] = React.useState(null);
  // const [user, setUser] = React.useState(null)
  // const [request, response, promptAsync] = Google.useAuthRequest({
    // androidClientId: "151462805855-ppsidiv6ojd54bifesr5bqa77udvcgct.apps.googleusercontent.com",
    // iosClientId: "151462805855-oggtak1hudth6474k1258bs9e171prbl.apps.googleusercontent.com",
    // expoClientId: "151462805855-qjoeaf2souf60dd6dcra638iokkp3atq.apps.googleusercontent.com",
// 
  // });
  //  React.useEffect(() => {
    //  if (response?.type === "success") {
      // console.log(response.authentication.accessToken.toString())
      //  setAccessToken(response.authentication.accessToken);
    //  }
  //  }, [response]);
// 
  //  async function getUserData () {

    //  let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      // headers: {
        // Authorization: `Bearer ${accessToken}`
      // }
    //  });
    //  const useInfo = await response.json();
    //  setUser(useInfo)
  //  };
// 
  //  const ShowUserInfo = () => {
    // if (user) {
      // return (
        // <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          {/* <Text style={{fontSize:35, fontWeight:'bold', marginBottom:20}}>Welcome</Text> */}
          {/* <Image source={{uri:user.picture}} style={{width:100, height:100, borderRadius:50}}/> */}
          {/* <Text style={{fontSize:20, fontWeight:'bold'}}>{user.name}</Text> */}
        {/* </View> */}
      // )
    // }
  //  }
  return (
    <>
    
     {/* <ImageBackground source={require('./background.jpg')} style={styles.background}> */}
{/*  */}
      {/* <View style={styles.container}> */}
   {/* <View style={styles.container}>  */}
        {/* {ShowUserInfo()} */}
       {/* <Text>Welcome, {}</Text> */}
        {/* <Button title={accessToken ? "Get user data":"Login"} onPress={accessToken ? getUserData : () => promptAsync({useProxy: true, showInRecents:true})} style={styles.googleSignInButton}/> */}
           {/* <Text style={styles.googleSignInButtonText}>Sign in with Google</Text> */}
    {/* </View> */}
      {/* </View> */}
      {/* </ImageBackground> */}
      <NavigationContainer>
    <Tab.Navigator>
    <Tab.Screen name='Profil' component={Profil}/>
      <Tab.Screen name='Home' component={Home}/>
      <Tab.Screen name='Settings' component={Settings}/>

    </Tab.Navigator>
  </NavigationContainer>
      </>)
  ;
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
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
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
});

