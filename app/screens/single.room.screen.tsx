/**
 * Single chatroom screen
 * Desc: Show latest chatmessages in the chatroom
 */

import React, { useEffect, useState, useRef, useContext } from "react";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import * as ImagePicker from 'react-native-image-picker';

import { sharedStyles, Colors } from "../assets/styles";
import { Loading, SubHeader, BasicList, ChatMsgListItem, BasicButton, IconButton, CustomNav } from "../components";

import { UserContext } from "../context/auth.context";
import { addChatMessage, ChatMessages, getMoreChatMessages, updateChatroom } from "../services/firebase/database.service";
import { uploadImageFile } from "../services/firebase/storage.service";
import { sendNotiMessage, subscribeTopic } from "../services/firebase/noti.service";

export const SingleRoomScreen = ({route,navigation}: {route: any,navigation: any}) => {

    // Get user credentials from auth context.
    const userCred = useContext(UserContext);    
    // Params received from chatroom list, data specific for this room.
    const { roomName, roomDesc, roomId } = route.params;   
    // Initial message
    const [emptyErrMsg, setEmptyErrMsg] = useState("Loading messages...");     
    // State for loader overlay
    const [loading, setLoading] = useState(false); 
    // The main chatmessage array state 
    const [msgs, setMsgs] = useState<ChatMessages[]>([]); 
    // State for new chatmessage inputfield
    const [chatMsg, setChatMsg] = useState('');
    // Last document pointer state for infinit scroll function.
    const [lastMsgPointer, setLastMsgPointer] = useState<FirebaseFirestoreTypes.DocumentData>();
    // States used for un button loaders
    const [cameraButtonLoading, setCameraButtonLoading] = useState(false); 
    const [msgSendButtonLoading, setMsgSendButtonLoading] = useState(false); 
    // Ref for main flatlist, for auto scrolling
    const chatFlatlistRef = useRef<FlatList | null>(null);
    // Ref for chatmessage inputfield, mainly used to set focus after send message.
    const chatTextInput = useRef<TextInput | null>(null);
    // Saves the current scroll position, used for auto scrolling with infinit scroll.
    var scrollOffset = 0

    useEffect(() => {        
        
        // START - Firestore active listener to check for changes in chatmessages in the specific chatroom.

        // Chatmessages query error when getting new chatmessages
        const onQueryError = (error: any) => {
            console.log("Firestore database get chat messages onQueryError:",error);
        }          

        console.log("Getting new messages...")  

        // TODO, put in services. (Having lots of issues doing so)
        // Get chatmessages
        const subscriber = firestore()
        .collection('chatmessages')
        .where("chatroom_id","==",roomId)
        .orderBy('msg_date','desc')
        .limit(50)
        .onSnapshot(querySnapshot => {
            
            // Put every message in ChatMessages array
            const msgs: ChatMessages[] = [];            
             querySnapshot.forEach(documentSnapshot => {                
                msgs.push({
                data: documentSnapshot.data(),
                key: documentSnapshot.id,
                });             
            });     

            // Set last document pointer for infinit scroll function, used if there are more then 50 messages.
            setLastMsgPointer(querySnapshot.docs[querySnapshot.docs.length - 1])

            // If no msg is present then show a message
            if(!msgs.length) setEmptyErrMsg('Be the first to send a message...'); 

            // Set the main chatmessage array state with all the chatmessages just gotten.
            setMsgs(msgs)                       

        }, onQueryError);        
        // END - Firestore active listener to check for changes in chatmessages in the specific chatroom.

        // Unsubscribe from events(Get new messages) when no longer in use
        return () => subscriber();
    }, []);
    
    // Get more messages if there are more then 50, the infinit scroll function.
    const getMoreMessages = () => {

        if(msgs.length < 50) return        
        
        if(loading) return

        if(!lastMsgPointer) return
       
        setLoading(true)

        getMoreChatMessages(roomId, lastMsgPointer)
        .then(moreChatmessages => {
            
            // Set the last document pointer for further infinit scroll.
            setLastMsgPointer(moreChatmessages.lastpointer)
            // Added new messages to main chatmessages array
            setMsgs([...msgs, ...moreChatmessages.chatmessages])

            setLoading(false)

            setTimeout(() => {       
                // Auto scroll a bit to show that new messages was loaded         
                chatFlatlistRef.current?.scrollToOffset({offset: scrollOffset + 100, animated: true})  
            }, 100)    

        })
        .catch((error) => {
            Alert.alert("Error getting more chatmessages...")
            console.log("Firestore database get more chat messages error:",error);
        });
    }

   
    // Handle add/send new chatmessage
    const handleSendChatMsg = async () => {
        
        // If no chat msg, then do nothing.
        if(!chatMsg) return

        setMsgSendButtonLoading(true)

        // Add new chat message, call the Firebase service database service in Services/folder.
        addChatMessage(roomId,chatMsg, userCred)
        .then(() => {
            setMsgSendButtonLoading(false)
            // Update the chatroom new_msg_date field with new timestamp
            updateChatroom(roomId)
        })
        .catch((error) => {
            console.log('error', error);
            Alert.alert("Error adding chat message...")
            setMsgSendButtonLoading(false)
        });

        // Handle send of notifications and subs
        handleNoti(chatMsg)

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
                    // Update the chatroom new_msg_date field with new timestamp
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
                   // Update the chatroom new_msg_date field with new timestamp
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

    // Image media source chooser, gallery or camera.
    const chooseMediaSource = () => {
        setCameraButtonLoading(true)
        Alert.alert('Choose image source', '', [
            {text: 'Phone gallery', onPress: pickImageFromGallery},
            {text: 'Camera', onPress: pickImageFromCamera},
            {text: 'Cancel', onPress: () => setCameraButtonLoading(false), style: 'cancel'},
        ]);
    }

    const handleNoti = (msg: string) => {

        // Send push notification for all users that are subs to this chatroom
        sendNotiMessage(roomId, msg, roomName);

        Alert.alert('Push notifications', 'Send me push notifications when new message is added?', [
            {text: 'Yes', onPress: () => {
                // Subscribe to this chatroom
                subscribeTopic(roomId);
            }},
            {text: 'No'},
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

            {/* KeyboardAvoidingView used for pushing items up when keyboard is shown */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{flex: 1}}>

                { 
                // If main chatmessages array is not empty then show the flatlist of chatmessage items.
                msgs.length ? (                             
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
                    // If no messages, show a "error" message.
                    <View style={styles.basicListStyle}>
                        <Text style={[sharedStyles.errorMsgGrey, styles.errorMsg]}>{emptyErrMsg}</Text>
                    </View>                  
                )}

                {/* Bottom area */}
                <View style={styles.bottomItemsContainer}>
                    <IconButton icon='camera-outline' color="white" onPress={chooseMediaSource} loader={cameraButtonLoading} disabled={cameraButtonLoading}/> 
                    <TextInput 
                        placeholder='Type message...'
                        placeholderTextColor={Colors.medGrey}
                        autoCapitalize="none"
                        returnKeyType="go"
                        enablesReturnKeyAutomatically={true}
                        onSubmitEditing={handleSendChatMsg}
                        style={[sharedStyles.textInput,styles.msgInput]}
                        value={chatMsg}
                        onChangeText={text => setChatMsg(text)}
                        />
                    <BasicButton title="SEND" style={styles.sendButton} loader={msgSendButtonLoading} disabled={msgSendButtonLoading} onPress={handleSendChatMsg} />
                </View> 

            </KeyboardAvoidingView>   

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
    sendButton: {
        marginRight:10,
        height:40,
        width:70,
        paddingBottom:1
    },
    msgInput: {
        flex:1,
        marginRight:10,
        marginLeft:10,
        height:40,
        padding:5
    },
    bottomItemsContainer: {
        flexDirection: 'row',
        padding:5,
        marginBottom:10
    },

    errorMsg: {
        padding:120,
        textAlign: "center"
    }

});