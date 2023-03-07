/*
* All Firebase Storage services:
* Put file
* Get downloadUrl
*/

import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'react-native-image-picker';

/**
 * Function name: uploadImageFile
 * Function desc: Upload image file taken from gallery or camera to Firebase Storage.
 * @param asset 
 * @returns url: string (image url from Firebase Storage)
 */
export const uploadImageFile = async (asset: ImagePicker.Asset): Promise<string> => {

    try {
        
        var url = ''

        // Ref to where to put the image file on Storage
        const refFileName = '/chat_media/'+asset.fileName;
        const refPutFileStorage = storage().ref(refFileName);

        // Put file on Storage
        const taskPutfileStorage = refPutFileStorage.putFile(asset.uri as string);
        await taskPutfileStorage.then(async () => {
            
            // Get URL of uploaded image
            url = await storage().ref(refFileName).getDownloadURL();
            console.log('Image uploaded to the bucket!', url);    

        }).catch((error) => {
            console.log("Firestore storage upload error catch#1:",error);
        });

        // Return image url from Storage
        return Promise.resolve(url);
    
    } catch (err) {
        // If any error in firebase storage upload, throw error.
        throw err;
    } 
}