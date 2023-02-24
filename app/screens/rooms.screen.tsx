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


export const RoomsScreen = ({navigation}: {navigation: any}) => {

    const [loading, setLoading] = useState(true); 
    const [refreshingList, setRefreshingList] = useState(false); 
    const [chatrooms, setChatrooms] = useState([]); 

    useEffect(() => {
        const subscriber = firestore()
          .collection('chatrooms')
          .orderBy('name', 'asc')
          .get()
          .then(querySnapshot => {
            const chatrooms = [];
      
            querySnapshot.forEach(documentSnapshot => {
                chatrooms.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
            console.log("lol")
            setChatrooms(chatrooms);
            setLoading(false);
          });      
      }, []);

    return(
        <SafeAreaView style={[sharedStyles.container]}>
            <Header title='Chat rooms' style={{textAlign: 'center'}}/>       

            <BasicList style={styles.basicListStyle} data={chatrooms} renderItem={({item}) => <BasicListItem item={item} onPress={()=>{
              navigation.navigate('SingleRoom')
            }} />}
            onRefresh={() => {
              console.log("Refreshing list...")
              // TODO: Tidy up this code
              setRefreshingList(true)
              const subscriber = firestore()
                .collection('chatrooms')
                .orderBy('name', 'asc')
                .get()
                .then(querySnapshot => {
                  const chatrooms = [];
            
                  querySnapshot.forEach(documentSnapshot => {
                      chatrooms.push({
                      ...documentSnapshot.data(),
                      key: documentSnapshot.id,
                    });
                  });
                  console.log("List refreshed...")
                  setRefreshingList(false)
                  setChatrooms(chatrooms);
                });
            
            }}
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