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
import Icon from 'react-native-vector-icons/FontAwesome5';


export const RoomsScreen = () => {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [chatrooms, setChatrooms] = useState([]); // Initial empty array of users

    useEffect(() => {
        const subscriber = firestore()
          .collection('chatrooms')
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
      
        // Unsubscribe from events when no longer in use
        //return () => subscriber();
      }, []);


    return(
        <SafeAreaView style={[sharedStyles.container]}>
            <Header title='Chat rooms' style={{textAlign: 'center'}}/>       

            <BasicList style={styles.basicListStyle} data={chatrooms} renderItem={({item}) => <BasicListItem item={item} />}/>                              
           
            <Button title="Log off" onPress={()=>{
                auth()
                .signOut()
                .then(() => console.log('User signed out!'));
            }} />
            <Icon size={24} color="white" name="movie" />

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