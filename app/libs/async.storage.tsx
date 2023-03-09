import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataSeenPushNotiPopup = async (roomId: string) => {
    try {
      await AsyncStorage.setItem('@seenPushNotiPopupForChatRoom', roomId)
    } catch (e) {
      console.log("storeDataPopupPush error:",e)
    }
}

export const getDataSeenPushNotiPopup = async () => {
    try {
      const value = await AsyncStorage.getItem('@seenPushNotiPopupForChatRoom')
      if(value !== null) {
        console.log("getDataSeenPushNotiPopup value:",value)
        return Promise.resolve(value);
      }
    } catch(e) {
        console.log("getDataSeenPushNotiPopup error:",e)
    }
}