


    
  import { StyleSheet, Text, TextInput, View } from "react-native";
import React,{ useState } from "react";
import {
 Menu,
 MenuProvider,
 MenuOptions,
 MenuOption,
 MenuTrigger,
} from "react-native-popup-menu";

export default function Settings() {
  const [locationPopup, setLocationPopup] = useState(null);
 return (
   <MenuProvider style={styles.container}>
     <Menu>
       <MenuTrigger
         text="Click for Option menu"
       />
       <MenuOptions>
          <TextInput onChangeText={text=> setLocationPopup(text)} value={locationPopup}></TextInput>
       </MenuOptions>
     </Menu>
   </MenuProvider>
 );
};



const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#fff",
   justifyContent: "flex-start",
   alignItems: "center",
   padding: 30,
   flexDirection: "column",
 },
});