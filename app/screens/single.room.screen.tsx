import React, { useEffect, useState, useRef, useContext } from "react";
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { sharedStyles } from "../assets/styles/shared.styles";
import { SubHeader } from "../components/headers";
import { Loading } from "../components/loading-overlay";
import { Colors } from "../assets/styles/colors";
import { BasicList } from "../components/basic-list";
import { ChatMsgListItem } from "../components/items/chat-msg-list-item";
import { BasicButton } from "../components/basic-button";
import { IconButton } from "../components/icon-button";
import * as ImagePicker from 'react-native-image-picker';
import { CustomNav } from "../components/custom-nav";
import { UserContext } from "../context/auth.context";
import { addChatMessage, ChatMessages, getMoreChatMessages, updateChatroom } from "../services/firebase/database.service";

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { uploadImageFile } from "../services/firebase/storage.service";

export const SingleRoomScreen = ({route,navigation}: {route: any,navigation: any}) => {

    const userCred = useContext(UserContext);
    
    const { roomName, roomDesc, roomId } = route.params;
   
    const [emptyErrMsg, setEmptyErrMsg] = useState("Loading messages..."); 

    const [loading, setLoading] = useState(false); 
    const [msgs, setMsgs] = useState<ChatMessages[]>([]); 
    const [chatMsg, setChatMsg] = useState('');
    const [lastMsgPointer, setLastMsgPointer] = useState<FirebaseFirestoreTypes.DocumentData>();

    const [cameraButtonLoading, setCameraButtonLoading] = useState(false); 
    const [msgSendButtonLoading, setMsgSendButtonLoading] = useState(false); 

    const chatFlatlistRef = useRef<FlatList | null>(null);
    const chatTextInput = useRef<TextInput | null>(null);

    var scrollOffset = 0

    useEffect(() => {
                 
        const onQueryError = (error: any) => {
            console.log("Firestore database get chat messages onQueryError:",error);
        }          

        console.log("Getting new messages...")  

        // TODO, put in services.
        const subscriber = firestore()
        .collection('chatmessages')
        .where("chatroom_id","==",roomId)
        .orderBy('msg_date','desc')
        .limit(50)
        .onSnapshot(querySnapshot => {
            
            const msgs: ChatMessages[] = [];                       

            querySnapshot.forEach(documentSnapshot => {                
                msgs.push({
                data: documentSnapshot.data(),
                key: documentSnapshot.id,
                });             
            });     

            setLastMsgPointer(querySnapshot.docs[querySnapshot.docs.length - 1])

            if(!msgs.length) setEmptyErrMsg('Be the first to send a message...'); 

            setMsgs(msgs)                       

        }, onQueryError);        

        // Unsubscribe from events(Get new messages) when no longer in use
        return () => subscriber();
    }, []);
    

    const getMoreMessages = () => {

        if(msgs.length < 50) return        
        
        if(loading) return

        if(!lastMsgPointer) return
       
        setLoading(true)

        getMoreChatMessages(roomId, lastMsgPointer)
        .then(moreChatmessages => {
                 
            setLastMsgPointer(moreChatmessages.lastpointer)
            setMsgs([...msgs, ...moreChatmessages.chatmessages])

            setLoading(false)

            setTimeout(() => {                
                chatFlatlistRef.current?.scrollToOffset({offset: scrollOffset + 100, animated: true})  
            }, 100)    

        })
        .catch((error) => {
            Alert.alert("Error getting more chatmessages...")
            console.log("Firestore database get more chat messages error:",error);
        });
    }

   

    const handleSendChatMsg = async () => {
        
        // If no chat msg, then do nothing.
        if(!chatMsg) return

        setMsgSendButtonLoading(true)

        addChatMessage(roomId,chatMsg, userCred)
        .then(() => {
            setMsgSendButtonLoading(false)
            updateChatroom(roomId)
        })
        .catch((error) => {
            console.log('error', error);
            Alert.alert("Error adding chat message...")
            setMsgSendButtonLoading(false)
        });

        setChatMsg('')

        // When chat msg sendt, then refocus on textinput field for further and faster writing.
        chatTextInput.current?.focus() 

        // Scroll to start point when chat msg is sendt, for better UX if user is further up the list.
        setTimeout(() => {chatFlatlistRef.current?.scrollToIndex({
            animated: true,
            index: 0,
          })  }, 200)

        setMsgSendButtonLoading(false)
    }
    
    // Open image picker to choose image from phone gallery
    const pickImageFromGallery = async () => {
        
        ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            includeBase64: false,
            selectionLimit: 1,
          }, async (response) => {

            // If no image was chosen then return and stop loading animation for camera button.
            if(!response.assets){
                console.log("Imagepicker closed again...no image chosen")
                setCameraButtonLoading(false)
                return
            }
              
            // If image asset was chosen then upload to Firebase Storage
            uploadImageFile(response.assets![0])
            .then((url) => {
                
                if(!url){
                    setCameraButtonLoading(false)
                    return
                }
                // Add "Image chat message" with image url returned from uploadImageFile.
                addChatMessage(roomId, 'image', userCred, url)
                .then(() => {
                    console.log('Chat message added!');
                    updateChatroom(roomId)
                    setCameraButtonLoading(false)
                })
                .catch((error) => {
                    console.log("Firestore database add image chat message error:",error);
                    Alert.alert("Error adding chat message...")
                    setCameraButtonLoading(false)
                });

            })
            .catch(() => {
                Alert.alert("Error adding chat message...")
                setCameraButtonLoading(false)
            });

        });

    }

    // Open image picker to take image with phone camera
    const pickImageFromCamera = async () => {
        
          ImagePicker.launchCamera({
            mediaType: 'photo',
            includeBase64: false,
          }, async (response) => {

            // If no image was chosen then return and stop loading animation for camera button.
            if(!response.assets){
                console.log("Imagepicker CAMERA closed again...no image chosen")
                setCameraButtonLoading(false)
                return
            }
            
           // If image asset was taken then upload to Firebase Storage
           uploadImageFile(response.assets![0])
           .then((url) => {
               
               if(!url){
                   setCameraButtonLoading(false)
                   return
               }
               // Add "Image chat message" with image url returned from uploadImageFile.
               addChatMessage(roomId, 'image', userCred, url)
               .then(() => {
                   console.log('Chat message added!');
                   updateChatroom(roomId)
                   setCameraButtonLoading(false)
               })
               .catch((error) => {
                   console.log("Firestore database add image chat message error:",error);
                   Alert.alert("Error adding chat message...")
                   setCameraButtonLoading(false)
               });

           })
           .catch(() => {
               Alert.alert("Error adding chat message...")
               setCameraButtonLoading(false)
           });

        });

    }

    const chooseMediaSource = () => {
        setCameraButtonLoading(true)
        Alert.alert('Choose image source', '', [
            {text: 'Phone gallery', onPress: pickImageFromGallery},
            {text: 'Camera', onPress: pickImageFromCamera},
            {text: 'Cancel', onPress: () => setCameraButtonLoading(false), style: 'cancel'},
        ]);
    }

    return(
        <SafeAreaView style={[sharedStyles.container]}>

            <CustomNav
            title={roomName} 
            leftButtonVisible={true}
            leftButtonIcon="chevron-back"
            leftButtonOnPress={()=>{
                navigation.navigate({
                    name: 'Rooms',
                    params: { refreshRoomList: Date.now() },
                    merge: true,
                  });
            }}
            />      
            <SubHeader text={roomDesc} />           

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
                    onScroll={e => {
                        scrollOffset = e.nativeEvent.contentOffset.y;
                      }}
                    renderItem={({item}) => 
                        <ChatMsgListItem 
                            item={item.data} 
                            currentUser={item.data.sender_id == userCred.uid ? true : false}
                            imageOnPress={()=>{
                                navigation.navigate('ImageFullsize', {
                                    image_url: item.data.msg_image_url,
                                });            
                            }} 
                        />}
                    />  
                ):(
                    <View style={styles.basicListStyle}>
                        <Text style={[sharedStyles.errorMsgGrey, {padding:120, textAlign: "center"}]}>{emptyErrMsg}</Text>
                    </View>                  
                )}

                <View style={{flexDirection: 'row', padding:5, marginBottom:10}}>
                    <IconButton icon='camera-outline' color="white" onPress={chooseMediaSource} loader={cameraButtonLoading} disabled={cameraButtonLoading}/> 
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
                    <BasicButton title="SEND" style={{marginRight:10, height:40, width:70, paddingBottom:1}} loader={msgSendButtonLoading} disabled={msgSendButtonLoading} onPress={handleSendChatMsg} />
                </View> 

            </KeyboardAvoidingView>   

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