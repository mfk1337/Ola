/*
* All Firebase Cloud messaging services:
* Get perm, subscribe to topics, get FCM tokens.
* UNDER CONSTRUCTION
*/
import messaging from '@react-native-firebase/messaging';

// Request permission to receive notifications
export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
}

// Subscribe to topic, in this case chatrooms.
export const subscribeTopic = async (topic: string) => {
    messaging()
      .subscribeToTopic(topic)
      .then(() => console.log("Subscribed to topic:", topic))
      .catch((e) => {
        console.log(e);
      });
}

// Get Firebase Cloud Messaging token, for testing
export const getFCMToken = async () =>{
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log({token})
}

// Sending push notifications via FCM
export const sendNotiMessage = async (topic: string, msg: string, chatroom: string) => {

    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': 'key=AAAAkiOqduY:APA91bEyDuIQDFnkaJhw8l_N27COusT_mpLCXnxeFvxgU1mzupCOle_kDwlJtSHouHq98JntfgEHsT8R29jVO6RiaD6zIiDSqu9y9BrqHnqKz9XOPKgXwEqFFkcJ6G3inn3PkpvwtBIz',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({          
        "to": "/topics/"+topic,
        "notification": {
            "title": "New chat message in "+chatroom,
            "body": msg
            }              
        }),

      }).then(response => {
            console.log("sendNotiMessage response: ",response);
      })
      .then(json => {
            console.log("sendNotiMessage json: ",json);
      })
      .catch(error => {
            console.log("sendNotiMessage error: ",error);
      });;

}