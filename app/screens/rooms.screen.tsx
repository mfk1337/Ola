import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text } from "react-native";
import { sharedStyles } from "../assets/styles/shared.styles";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Header } from "../components/headers";
import { Loading } from "../components/loading-overlay";
import { BasicList } from "../components/basic-list";
import { BasicListItem } from "../components/items/basic-list-item";
import { Colors } from "../assets/styles/colors";
import { CustomNav } from "../components/custom-nav";


export const RoomsScreen = ({route,navigation}: {route: any,navigation: any}) => {

  const [loading, setLoading] = useState(true); 
  const [refreshingList, setRefreshingList] = useState(false); 
  const [chatrooms, setChatrooms] = useState([]); 

  useEffect(() => {
    getChatRoomList()
  }, [route.params?.refreshRoomList]);

  const refreshChatroomList = () => {

    console.log("Refreshing list...")
    setRefreshingList(true)
    getChatRoomList()
    setRefreshingList(false)

  } 
  
  const getChatRoomList = () => {

    const subscriber = firestore()
    .collection('chatrooms')
    .orderBy('new_msg_date', 'desc')
    .get()
    .then(querySnapshot => {
      const chatrooms = [];

      querySnapshot.forEach(documentSnapshot => {
          chatrooms.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      console.log("Got chatroom list...")
      setLoading(false)
      setChatrooms(chatrooms);
    });

  }

  return(
      <SafeAreaView style={[sharedStyles.container]}>
          <CustomNav title='Chat rooms' />
          
          <BasicList style={styles.basicListStyle} data={chatrooms} renderItem={({item}) => <BasicListItem item={item} onPress={()=>{                            
            navigation.navigate('SingleRoom', {
              roomName: item.name,
              roomDesc: item.desc,
              roomId: item.key
            });
          }} />}
          onRefresh={refreshChatroomList}
          refreshing={refreshingList}
          />                           
        
          <Button title="Log off" onPress={()=>{
              auth()
              .signOut()
              .then(() => console.log('User signed out!'));
            }} />

      { loading ? (<Loading />):(null)}
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