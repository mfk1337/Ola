import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store a key and item for checking if Push Noti popup was seen for a specific chatroom.
 * @param roomId 
 */
export const storeDataSeenPushNotiPopup = async (roomId: string) => {
    try {
      await AsyncStorage.setItem('@PushNotiPopup_'+roomId, roomId)
    } catch (e) {
      console.log("storeDataPopupPush error:",e)
    }
}

/**
 * Get key and item for checking if Push Noti popup was seen for a specific chatroom.
 * @param roomId 
 * @returns string roomId
 */
export const getDataSeenPushNotiPopup = async (roomId: string): Promise<string> => {
    try {
        var value = ''

        value = await AsyncStorage.getItem('@PushNotiPopup_'+roomId) as string
        if(value !== null) {
            console.log("getDataSeenPushNotiPopup value:",value)
        }

        return Promise.resolve(value);

    } catch(e) {
        console.log("getDataSeenPushNotiPopup error:",e)
        throw e;
    }
}