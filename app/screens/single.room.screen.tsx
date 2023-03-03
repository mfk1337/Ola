import React, { useEffect, useState, useRef, useContext } from "react";
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { sharedStyles } from "../assets/styles/shared.styles";
import { SubHeader } from "../components/headers";
import { Loading } from "../components/loading-overlay";
import firestore from '@react-native-firebase/firestore';
import { Colors } from "../assets/styles/colors";
import { BasicList } from "../components/basic-list";
import { ChatMsgListItem } from "../components/items/chat-msg-list-item";
import { BasicButton } from "../components/basic-button";
import { IconButton } from "../components/icon-button";
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { CustomNav } from "../components/custom-nav";
import { UserContext } from "../context/auth.context";

export const SingleRoomScreen = ({route,navigation}: {route: any,navigation: any}) => {

    const userCred = useContext(UserContext);
    
    const { roomName, roomDesc, roomId } = route.params;
   
    const [scrollToEnd, setScrollToEnd] = useState(); 
    const [loading, setLoading] = useState(false); 
    const [msgs, setMsgs] = useState([]); 
    const [chatMsg, setChatMsg] = useState('');
    const [lastMsgPointer, setLastMsgPointer] = useState();

    const [cameraButtonLoading, setCameraButtonLoading] = useState(false); 

    const chatFlatlistRef = useRef<FlatList | null>(null);
    const chatTextInput = useRef<TextInput | null>(null);

    useEffect(() => {
                 
        const onQueryError = (error: any) => {
            console.log("Firestore database get chat messages onQueryError:",error);
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

        })
        .catch((error) => {
            console.log("Firestore database get more chat messages error:",error);
        });
    }

    useEffect(() => {        
        if(!scrollToEnd) return
        setTimeout(() => {chatFlatlistRef.current?.scrollToEnd({animated:true})  }, 200)
        console.log("scrollToEnd2")
        
    }, [scrollToEnd]);

    const updateChatroom = () => {
        firestore()
        .collection('chatrooms')
        .doc(roomId)
        .update({
            new_msg_date: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            console.log('Chatroom new_msg_date updated...');
        })
        .catch((error) => {
            console.log("Firestore database update chatroom data error:",error);
        });
    }

    const handleSendChatMsg = () => {
        console.log({chatMsg})

        // If no chat msg, then do nothing.
        if(!chatMsg) return

        firestore()
        .collection('chatmessages')
        .add({
            chatroom_id: roomId,
            msg_text: chatMsg,
            msg_date: firestore.FieldValue.serverTimestamp(),
            sender_id: userCred.uid,
            sender_name: userCred.name ? userCred.name : userCred.email,
            sender_avatar: userCred.avatar_url ? userCred.avatar_url : '',
        })
        .then(() => {
            console.log('Chat message added!');
            updateChatroom()
        })
        .catch((error) => {
            console.log("Firestore database add chat message error:",error);
        });

        setChatMsg('')

        // When chat msg sendt, then refocus on textinput field for further and faster writing.
        chatTextInput.current?.focus() 

        // Scroll to start point when chat msg is sendt, for better UX if user is further up the list.
        setTimeout(() => {chatFlatlistRef.current?.scrollToIndex({
            animated: true,
            index: 0,
          })  }, 200)
    }
    
    // Open image picker, sets state: responseGallery, when image is chosen.
    const pickImageFromGallery = async () => {
        
        ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            includeBase64: false,
            selectionLimit: 1,
          }, async (response) => {

            if(!response.assets){
                console.log("Imagepicker closed again...no image chosen")
                setCameraButtonLoading(false)
                return
            }

            // Because selection limit is set to 1, we only check first item in the assets array returned.
            console.log(response.assets![0])
            //response.assets ? setResponseGallery(response.assets![0]) : 
                        
            try {

                const refFileName = '/chat_media/'+response.assets![0].fileName;
                const refPutFileStorage = storage().ref(refFileName);
                const taskPutfileStorage = refPutFileStorage.putFile(response.assets![0].uri as string);
                taskPutfileStorage.then(async () => {
                    const url = await storage().ref(refFileName).getDownloadURL();
                    console.log('Image uploaded to the bucket!', url);
    
                    firestore()
                    .collection('chatmessages')
                    .add({
                        chatroom_id: roomId,
                        msg_text: 'image',
                        msg_date: firestore.FieldValue.serverTimestamp(),
                        msg_image_url: url,
                        sender_id: userCred.uid,
                        sender_name: userCred.name ? userCred.name : userCred.email,
                        sender_avatar: userCred.avatar_url ? userCred.avatar_url : '',
                    })
                    .then(() => {
                        console.log('Chat message added!');
                        updateChatroom()
                        setCameraButtonLoading(false)
                    })
                    .catch((error) => {
                        console.log("Firestore database add image chat message error:",error);
                        setCameraButtonLoading(false)
                    });
    
                });
                taskPutfileStorage.catch((error) => {
                    console.log("Firestore storage upload error #1:",error);
                    setCameraButtonLoading(false)
                })
            
            } catch (error) {
                console.log("Firestore storage upload error #2:",error);
                setCameraButtonLoading(false)
            } 

           
            


        });

    }

    const pickImageFromCamera = async () => {
        
          ImagePicker.launchCamera({
            mediaType: 'photo',
            includeBase64: false,
          }, async (response) => {

            if(!response.assets){
                console.log("Imagepicker CAMERA closed again...no image chosen")
                setCameraButtonLoading(false)
                return
            }

            // Because selection limit is set to 1, we only check first item in the assets array returned.
            console.log(response.assets![0])
            //response.assets ? setResponseGallery(response.assets![0]) : 
            
            try {

                const refFileName = '/chat_media/'+response.assets![0].fileName;
                const refPutFileStorage = storage().ref(refFileName);
                const taskPutfileStorage = refPutFileStorage.putFile(response.assets![0].uri as string);
                taskPutfileStorage.then(async () => {
                    const url = await storage().ref(refFileName).getDownloadURL();
                    console.log('Image uploaded to the bucket!', url);

                    firestore()
                    .collection('chatmessages')
                    .add({
                        chatroom_id: roomId,
                        msg_text: 'image',
                        msg_date: firestore.FieldValue.serverTimestamp(),
                        msg_image_url: url,
                        sender_id: userCred.uid,
                        sender_name: userCred.name ? userCred.name : userCred.email,
                        sender_avatar: userCred.avatar_url ? userCred.avatar_url : '',
                    })
                    .then(() => {
                        console.log('Chat message added!');
                        updateChatroom()
                        setCameraButtonLoading(false)
                    })
                    .catch((error) => {
                        console.log("Firestore database add image chat message error:",error);
                        setCameraButtonLoading(false)
                    });

                });
                taskPutfileStorage.catch((error) => {
                    console.log("Firestore storage upload error #1:",error);
                    setCameraButtonLoading(false)
                })
            
            } catch (error) {
                console.log("Firestore storage upload error #2:",error);
                setCameraButtonLoading(false)
            } 

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
                    renderItem={({item}) => 
                        <ChatMsgListItem 
                            item={item} 
                            currentUser={item.sender_id == userCred.uid ? true : false}
                            imageOnPress={()=>{
                                navigation.navigate('ImageFullsize', {
                                    image_url: item.msg_image_url,
                                });            
                            }} 
                        />}
                    />  
                ):(
                    <View style={styles.basicListStyle}>
                        <Text style={[sharedStyles.errorMsgGrey, {padding:120, textAlign: "center"}]}>Be the first to send a message...</Text>
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
                    <BasicButton title="SEND" style={{marginRight:10, height:40, width:70, paddingBottom:1}} onPress={handleSendChatMsg} />
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