import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import "./TopBar";
import { useNavigation } from "@react-navigation/native";
import {Home} from "./Home";




export default function TopBar() {
  return(<>
    
      <View style={style_topbar.topbar}>
    <Text style={style_topbar.textlogo}>TimeManager</Text>
      {/* <View> */}
        <Button title="Home" onPress={()=>useNavigation.navigate (Home)}></Button>
      {/* </View> */}
  </View>
</>
  )
}

const style_topbar = StyleSheet.create({
topbar :{
  display: 'flex',
  height:115,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#16161A',
  borderBottom: 'solid 1px #242629',
},

textlogo: {
  display: 'flex',
  fontSize: 30,
  fontWeight: '600px',
  letterSpacing: '0.02em',
  color: '#fffffe',
},

postext: {
  marginLeft: 75,
}
})