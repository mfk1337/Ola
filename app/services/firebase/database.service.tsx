/*
* All Firebase database(Cloud Firestore) services:
* Getting and updating chatrooms
* Getting and add chatmessages
*/

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { UserCredentials } from '../../context/auth.context';

export interface ChatRooms {
    data: FirebaseFirestoreTypes.DocumentData;
    key: string;
}

export interface ChatMessages {
    data: FirebaseFirestoreTypes.DocumentData;
    key: string;
}

export interface ChatMessagesAndLastpointer {
    chatmessages: ChatMessages[];
    lastpointer: FirebaseFirestoreTypes.DocumentData;
}

/**
 * Function name: getChatRoomList
 * Function desc: Get chatroom list from firebase database collection 'chatrooms'
 * @returns array of ChatRooms
 */
export const getChatRoomList = async (): Promise<ChatRooms[]> => {

    console.log("Getting chatroom list...")

    // Chatrooms array to collect firebase Documents.
    const chatrooms: ChatRooms[] = [];

    try {
        // Get Documents from 'chatrooms' collection.
        await firestore()
        .collection('chatrooms')
        .orderBy('new_msg_date', 'desc')
        .get()
        .then(querySnapshot => {      

            querySnapshot.forEach(documentSnapshot => {
                chatrooms.push({
                data: documentSnapshot.data(),
                key: documentSnapshot.id,
                });
            });
            console.log("Got chatroom list...")    
        });

        // Return chatroom list (Documents)
        return Promise.resolve(chatrooms);
        
    } catch (err) {
        // If any error in firebase connection, throw error.
        throw err;
    }
}

/**
 * Function name: updateChatroom
 * Function desc: Update chatroom 'new_msg_date' field everytime a new message is added to the chatroom.
 * @param roomId 
 */
export const updateChatroom = async (roomId: string) => {
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

// NOT USED - UNDER CONSTRUCTION - Get chatroom messages
export const getChatMessages = async (roomId: string): Promise<ChatMessagesAndLastpointer> => {

    console.log("Getting MORE chat messages...")

    // Chatrooms array to collect firebase Documents.
    const msgs: ChatMessages[] = [];
    var lastPointer: any
    var chatMessagesAndLastpointer: ChatMessagesAndLastpointer

    try {
        // Get Documents from 'chatmessages' collection.
        firestore()
        .collection('chatmessages')
        .where("chatroom_id","==",roomId)
        .orderBy('msg_date','desc')
        .limit(50)
        .onSnapshot(querySnapshot => {
            
            querySnapshot.forEach(documentSnapshot => {                
                msgs.push({
                data: documentSnapshot.data(),
                key: documentSnapshot.id,
                });      
            });     
            lastPointer = querySnapshot.docs[querySnapshot.docs.length - 1]
            console.log("Got chat messages...")                                     
            
        }); 

        // Return chatmessages (Documents) and lastpointer to startAfter (for infinit scroll)
        console.log("WTF")
        chatMessagesAndLastpointer = {chatmessages: msgs,lastpointer: lastPointer}
        return Promise.resolve(chatMessagesAndLastpointer);
    
    } catch (err) {
        // If any error in firebase connection, throw error.
        throw err;
    }

}

/**
 * Function name: getMoreChatMessages
 * Function desc: Get more chatroom messages from firebase database collection 'chatmessages'. Used for infinit scroll.
 * @param roomId 
 * @param lastMsgPointer 
 * @returns ChatMessagesAndLastpointer: chatmessages, lastpointer
 */
export const getMoreChatMessages = async (roomId: string, lastMsgPointer: any): Promise<ChatMessagesAndLastpointer> => {

    console.log("Getting MORE chat messages...")

    // Chatrooms array to collect firebase Documents.
    const moreMsgs: ChatMessages[] = [];
    var lastPointer: any
    var chatMessagesAndLastpointer: ChatMessagesAndLastpointer

    try {
        // Get Documents from 'chatmessages' collection.
        await firestore()
        .collection('chatmessages')
        .where("chatroom_id","==",roomId)
        .orderBy('msg_date','desc')
        .limit(20)
        .startAfter(lastMsgPointer)
        .get()
        .then(querySnapshot => {                              

            querySnapshot.forEach(documentSnapshot => {                
                moreMsgs.push({
                data: documentSnapshot.data(),
                key: documentSnapshot.id,
                });
            });         
            lastPointer = querySnapshot.docs[querySnapshot.docs.length - 1]
            console.log("Got MORE chat messages...")    
        
        });

        // Return chatmessages (Documents) and lastpointer to startAfter (for infinit scroll)
        chatMessagesAndLastpointer = {chatmessages: moreMsgs,lastpointer: lastPointer}
        return Promise.resolve(chatMessagesAndLastpointer);
        
    } catch (err) {
        // If any error in firebase connection, throw error.
        throw err;
    }

}

/**
 * Function name: addChatMessage
 * Function desc: Add new chat message to firebase database collection 'chatmessages'
 * @param roomId
 * @param chatMsg
 * @param userCred
 * @param imageUrl
 */
export const addChatMessage = async (roomId: string, chatMsg: string, userCred: UserCredentials, imageUrl?: string) => {

    try {
        // Add document(New chat message) to 'chatmessages' collection.
        await firestore()
        .collection('chatmessages')
        .add({
            chatroom_id: roomId,
            msg_text: chatMsg,
            msg_date: firestore.FieldValue.serverTimestamp(),
            msg_image_url: imageUrl ? imageUrl : '',
            sender_id: userCred.uid,
            sender_name: userCred.name ? userCred.name : userCred.email,
            sender_avatar: userCred.avatar_url ? userCred.avatar_url : '',
        })
        .then(() => {
            console.log('addChatMessage: Chat message added!');
        })
        .catch((error) => {
            console.log("addChatMessage: Firestore database add chat message error:",error);
        });
                
    } catch (err) {
        // If any error in firebase connection, throw error.
        throw err;
    }
     
}

/**
 * Function name: getUserNotiSubs
 * Function desc: Check if the user is subscribed to a chatroom
 * @param user_id 
 * @param chatroom_id 
 * @returns boolean
 */
export const getUserNotiSubs = async (user_id: string, chatroom_id: string): Promise<boolean> => {

    var userSubscribed = false
    await firestore()
    .collection('notisubs')
    .where("user_id","==",user_id)
    .where("chatroom_id","==",chatroom_id)
    .get()
    .then(querySnapshot => {
        if(querySnapshot.size > 0)
        {
            userSubscribed = true
        }
    });

    return Promise.resolve(userSubscribed);

}

/**
 * Function name: subUserToNoti
 * Function desc: Subscribe the user to the chatroom, database only. FCM topic subs is handled in noti.services (subscribeTopic)
 * @param user_id 
 * @param chatroom_id 
 */
export const subUserToNoti = async (user_id: string, chatroom_id: string) => {

    try {
        await firestore()
        .collection('notisubs')
        .add({
            user_id: user_id,
            chatroom_id: chatroom_id,
        })
        .then(() => {
            console.log('subUserToNoti: Chatroom sub was added!');
        })
        .catch((error) => {
            console.log("subUserToNoti: Firestore database add sub error:",error);
        });
                
    } catch (err) {
        // If any error in firebase connection, throw error.
        throw err;
    }

}
/**
 * Function name: getRoomInfo
 * Function desc: Get room name and desc
 * @param roomId 
 * @returns 
 */
export const getRoomInfo = async (roomId: string) => {
    try {
       
        var roomName = ''
        var roomDesc = ''
        await firestore()
        .collection('chatrooms')
        .doc(roomId)
        .get()
        .then(documentSnapshot => {
            if(documentSnapshot.exists){
                roomName = documentSnapshot.get('name');
                roomDesc = documentSnapshot.get('desc');
            }
        });

        return Promise.resolve({name: roomName, desc: roomDesc});
                
    } catch (err) {
        // If any error in firebase connection, throw error.
        throw err;
    }
}