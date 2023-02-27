import React, { useEffect, useState, useRef } from "react";
import { Button, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { sharedStyles } from "../assets/styles/shared.styles";
import { Header, SubHeader } from "../components/headers";
import { Loading } from "../components/loading-overlay";
import firestore from '@react-native-firebase/firestore';
import { Colors } from "../assets/styles/colors";
import { BasicList } from "../components/basic-list";
import { ChatMsgListItem } from "../components/items/chat-msg-list-item";
import { BasicButton } from "../components/basic-button";

export const SingleRoomScreen = ({route,navigation}: {route: any,navigation: any}) => {

    const { roomName, roomDesc, roomId } = route.params;
   
    const [scrollToEnd, setScrollToEnd] = useState(); 
    const [loading, setLoading] = useState(false); 
    const [msgs, setMsgs] = useState([]); 
    const [chatMsg, setChatMsg] = useState('');
    const [lastMsgPointer, setLastMsgPointer] = useState();

    const chatFlatlistRef = useRef<FlatList | null>(null);

    useEffect(() => {
                 
        const onQueryError = (error) => {
            console.error("onQueryError: "+error);
        }          

        const subscriber = firestore()
        .collection('chatmessages')
        .where("chatroom_id","==",roomId)
        .orderBy('msg_date','desc')
        .limit(50)
        .onSnapshot(querySnapshot => {
            
            const msgs = [];                       

            querySnapshot.forEach(documentSnapshot => {
                
                msgs.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                });

            });         
            
            setLastMsgPointer(querySnapshot.docs[querySnapshot.docs.length - 1])

            setMsgs(msgs);            

        }, onQueryError);

        console.log("Getting new messages...")  

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const getMoreMessages = () => {

        if(msgs.length < 50) return
        console.log("Getting MORE messages...")
        setLoading(true)

        firestore()
        .collection('chatmessages')
        .where("chatroom_id","==",roomId)
        .orderBy('msg_date','desc')
        .limit(5)
        .startAfter(lastMsgPointer)
        .get()
        .then(querySnapshot => {
            
            const moreMsgs = [];                       

            querySnapshot.forEach(documentSnapshot => {
                
                moreMsgs.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                });

            });         
            
            setLastMsgPointer(querySnapshot.docs[querySnapshot.docs.length - 1])
            
            setMsgs([...msgs, ...moreMsgs])

            setLoading(false)

            console.log("scrollToEnd1")
            setScrollToEnd(true)

        });
    }

    useEffect(() => {        
        if(!scrollToEnd) return
        setTimeout(() => {chatFlatlistRef.current?.scrollToEnd({animated:true})  }, 200)
        console.log("scrollToEnd2")
        
    }, [scrollToEnd]);

    const handleSendChatMsg = () => {
        console.log({chatMsg})

        if(!chatMsg) return

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
        setTimeout(() => {chatFlatlistRef.current?.scrollToIndex({
            animated: true,
            index: 0,
          })  }, 200)
    }

    //data={[...msgs].reverse()}

    return(
        <SafeAreaView style={[sharedStyles.container]}>
            <Header title={roomName} style={{textAlign: 'center'}}/>       
            <SubHeader text={roomDesc} style={{textAlign: 'center', marginBottom: 10}}/>              

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}>

                { msgs.length ? (                             
                    <BasicList
                    refref={chatFlatlistRef} 
                    style={styles.basicListStyle}
                    data={msgs}
                    inverted={true}
                    onEndReached={getMoreMessages}
                    renderItem={({item}) => <ChatMsgListItem item={item} currentUser={true} />}/>  
                ):(
                    <View style={styles.basicListStyle}>
                        <Text style={[sharedStyles.errorMsgGrey, {padding:120, textAlign: "center"}]}>Be the first to send a message...</Text>
                    </View>
                )}

                <View style={{flexDirection: 'row', padding:5, marginBottom:10}}>
                    <TextInput 
                        placeholder='Type message...'
                        placeholderTextColor={Colors.medGrey}
                        autoCapitalize="none"
                        returnKeyType="go"
                        enablesReturnKeyAutomatically={true}
                        onSubmitEditing={handleSendChatMsg}
                        style={[sharedStyles.textInput,{flex:1, marginRight:10, marginLeft:10, height:40, padding:5}]}
                        value={chatMsg}
                        onChangeText={text => setChatMsg(text)}
                        />
                    <BasicButton title="SEND" style={{marginRight:10, height:40, width:70, paddingBottom:1}} onPress={handleSendChatMsg} />
                </View> 

            </KeyboardAvoidingView>   

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