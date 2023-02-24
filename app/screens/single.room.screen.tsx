import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { sharedStyles } from "../assets/styles/shared.styles";
import { Header, SubHeader } from "../components/headers";
import { Loading } from "../components/loading-overlay";
import firestore from '@react-native-firebase/firestore';
import { Colors } from "../assets/styles/colors";
import { BasicList } from "../components/basic-list";
import { BasicListItem } from "../components/items/basic-list-item";
import { ChatMsgListItem } from "../components/items/chat-msg-list-item";
import { BasicButton } from "../components/basic-button";

export const SingleRoomScreen = ({route,navigation}: {route: any,navigation: any}) => {

    const { roomName, roomDesc, roomId } = route.params;
   
    const [loading, setLoading] = useState(false); 
    const [msgs, setMsgs] = useState([]); 
    const [chatMsg, setChatMsg] = useState('');
    
      useEffect(() => {
        const subscriber = firestore()
        .collection('chatmessages')
        .orderBy('msg_date', 'asc')
        .limit(50)
        .where('chatroom_id', '==', roomId)
          .onSnapshot(querySnapshot => {
            const msgs = [];
      
            querySnapshot.forEach(documentSnapshot => {
                msgs.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
            setMsgs(msgs);
            setLoading(false);
          });
          
        console.log("Getting new messages...")  
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);

    const handleSendChatMsg = () => {
        console.log({chatMsg})

        firestore()
        .collection('chatmessages')
        .add({
            chatroom_id: roomId,
            msg_text: chatMsg,
            msg_date: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            console.log('Msg added!');
        });

        setChatMsg('')
    }

    return(
        <SafeAreaView style={[sharedStyles.container]}>
            <Header title={roomName} style={{textAlign: 'center'}}/>       
            <SubHeader text={roomDesc} style={{textAlign: 'center', marginBottom: 10}}/>              
        
            { msgs.length ? (                             
                <BasicList 
                style={styles.basicListStyle}
                data={[...msgs].reverse()}
                inverted={true}
                renderItem={({item}) => <ChatMsgListItem item={item} currentUser={true} />}/>  
            ):(
                <View style={styles.basicListStyle}>
                    <Text style={[sharedStyles.errorMsgGrey, {padding:120, textAlign: "center"}]}>Be the first to send a message...</Text>
                </View>
            )}

            <View style={{flexDirection: 'row', padding:5}}>
                <TextInput 
                    placeholder='Type message...'
                    autoCapitalize="none"
                    returnKeyType="go"
                    enablesReturnKeyAutomatically={true}
                    onSubmitEditing={handleSendChatMsg}
                    style={[sharedStyles.textInput,{flex:1, marginRight:10, marginLeft:10, height:40, padding:5}]}
                    value={chatMsg}
                    onChangeText={text => setChatMsg(text)}
                    />
                <BasicButton title="SEND" style={{marginRight:10, height:40, width:70, padding:5}} onPress={handleSendChatMsg} />
            </View>    

            <Button title="Back to overview" onPress={()=>{
                navigation.popToTop()
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