/**
 * Chatrooms overview screen
 * Desc: Show predefined chatrooms for the user to enter
 */

import React, { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet } from "react-native";

import { sharedStyles, Colors } from "../assets/styles";
import { Loading, BasicList, BasicListItem, CustomNav, NoFrameButton } from "../components";

import { UserContext } from "../context/auth.context";
import { getChatRoomList, ChatRooms } from "../services/firebase/database.service";
import { signOutFirebase } from "../services/firebase/auth.service";

export const RoomsScreen = ({route,navigation}: {route: any,navigation: any}) => {

  // Show logged in users credentials - For debug right now
  const userCred = useContext(UserContext);
  console.log("Room, current user logged in:",userCred)

  // State for loader overlay
  const [loading, setLoading] = useState(true); 
  // State for pull down refresh function
  const [refreshingList, setRefreshingList] = useState(false); 
  // Array with Chatrooms
  const [chatrooms, setChatrooms] = useState<ChatRooms[]>([]); 

  useEffect(() => {

    // Get chatrooms list initially and when returning from a chatroom
    getChatRoomList().then((chatrooms)=>{
      setChatrooms(chatrooms)
      setLoading(false)
    }).catch(error => {
      console.log('error', error);
      Alert.alert("Error getting chat rooms...")
      setLoading(false);
    });

    // route.params?.refreshRoomList is set when returning from a chatroom and is unique everytime so getChatRoomList is called for updating the chatroom list.
  }, [route.params?.refreshRoomList]);

  // Refresh the chatroom list with flatlist pull down function  
  const refreshChatroomList = () => {

    console.log("Refreshing list...")
    setRefreshingList(true)
    getChatRoomList().then((chatrooms)=>{
      setChatrooms(chatrooms)
      setRefreshingList(false)
    }).catch(error => {
      console.log('error', error);
      Alert.alert("Error getting chat rooms...")
      setRefreshingList(false)
    });   

  } 
  


  return(
      <SafeAreaView style={[sharedStyles.container]}>
          <CustomNav title='Chat rooms' />
          
          <BasicList 
          style={styles.basicListStyle}
          data={chatrooms}
          renderItem={({item}) => 
            <BasicListItem item={item.data} onPress={()=>{                            
              navigation.navigate('SingleRoom', {
                roomName: item.data.name,
                roomDesc: item.data.desc,
                roomId: item.key
              });
            }} />}
          onRefresh={refreshChatroomList}
          refreshing={refreshingList}
          />                           
        
          <NoFrameButton title="Log off" onPress={()=> signOutFirebase()} />

          { // Loader overlay
        loading ? (<Loading />):(null)}
      </SafeAreaView>
      
  )

}

// Local stylesheet for this screen
const styles = StyleSheet.create({
    basicListStyle: {
        flex: 1,
        marginTop:0,
        backgroundColor: Colors.white
    },
});