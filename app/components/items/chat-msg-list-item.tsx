/**
 * Chatmessage list item for Flatlist (See also Basiclist)
 * Desc: Custom flatlist item with styling for chat messasges/bubbles
 * 2 types of chat bubbles, green and gray. The green one is for current user and the gray one is for 'other user'
 */

import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import { fontStyles, Colors} from '../../assets/styles';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'; // https://blog.logrocket.com/caching-images-react-native-tutorial-with-examples/
import { isLightTheme } from '../../libs/colorscheme';

interface ChatMsgListItemProps {
    item: any;
    currentUser: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    imageOnPress?: () => void;
}

export const ChatMsgListItem: React.FC<ChatMsgListItemProps> = props => {

    const { item, currentUser, onPress, imageOnPress, onLongPress } = props;

    const defaultAvatar = '../../assets/img/default-avatar.jpg';
    const defaultNoName = 'NoName';

    // Convert timestamp from Firestore with Moment
    var msgDateTime = ''
    if(item.msg_date){
        var msgDate = new Date(item.msg_date.toDate())
        msgDateTime = Moment(msgDate).format("ddd D/M-YY - HH:mm");
    }else{
        msgDateTime = Moment().format("ddd D/M-YY - HH:mm");
    }

    return(
        <View style={{alignItems:currentUser ? 'flex-end': 'flex-start'}}>
            

            {currentUser ? (
                <TouchableOpacity style={{alignItems: 'flex-end'}} onLongPress={onLongPress}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.chatBubbleGreen}>                              
                                {
                                    // If message is of type image and image url is present, then show image in chat bubble.
                                    item.msg_image_url ? (
                                        <TouchableOpacity onPress={imageOnPress} onLongPress={onLongPress}>
                                        <FastImage style={styles.chatBubbleImage} source={{uri: item.msg_image_url}} />
                                        </TouchableOpacity>
                                    ):( // Show normal chat bubble if no image
                                        <Text style={styles.chatBubbleGreenText}>{item.msg_text}</Text>
                                    )
                                }                                                 
                        </View> 

                        {/* User avatar image, if no image show default avatar */}
                        <FastImage source={item.sender_avatar ? {uri: item.sender_avatar} : require(defaultAvatar)} style={styles.chatBubbleGreenAvatar}/>   

                    </View>

                    {/* Chat message stamp: User name, chatmsg time/date */}
                    <Text style={styles.chatBubbleGreenSmallTxt}>{item.sender_name ? item.sender_name : defaultNoName} - {msgDateTime}</Text>          
                </TouchableOpacity>
            ):(
                <View style={{alignItems: 'flex-start'}}>
                     <View style={{flexDirection: 'row'}}>

                        {/* User avatar image, if no image show default avatar */}
                        <FastImage source={item.sender_avatar ? {uri: item.sender_avatar} : require(defaultAvatar)} style={styles.chatBubbleGrayAvatar}/>   

                        <View style={styles.chatBubbleGray}>                              
                                {
                                    // If message is of type image and image url is present, then show image in chat bubble.
                                    item.msg_image_url ? (
                                        <TouchableOpacity onPress={imageOnPress}>
                                        <FastImage style={styles.chatBubbleImage} source={{uri: item.msg_image_url}} />
                                        </TouchableOpacity>
                                    ):( // Show normal chat bubble if no image
                                        <Text style={styles.chatBubbleGrayText}>{item.msg_text}</Text>
                                    )
                                }                 
                        </View> 
                    </View>

                    {/* Chat message stamp: User name, chatmsg time/date */}
                    <Text style={styles.chatBubbleGraySmallTxt}>{item.sender_name ? item.sender_name : defaultNoName} - {msgDateTime}</Text>          
                </View> 
            )}
                 
        </View>
    )
}

// Local stylesheet for this component
const styles = StyleSheet.create({
   
    // Current user, right chat bubble styles
    chatBubbleGreen: {
        backgroundColor: Colors.green,
        overflow:'hidden',
        marginLeft:10,
        marginRight:10,
        marginBottom:2,
        borderRadius:15,
        borderBottomEndRadius:0,
        maxWidth: '70%',     
    },
    chatBubbleGreenText: {
        padding: 10,
        textAlign:'left',
        color: isLightTheme() ? Colors.black : Colors.darkestGrey,
        fontSize: 13,
        margin:0,...fontStyles.fontRoboto
    },
    chatBubbleGreenAvatar: {
        height:36,
        width:36,
        borderRadius:36,
        marginRight: 5
    },
    chatBubbleGreenSmallTxt: {
        fontSize:11,
        color: Colors.medGrey,
        textAlign: 'right',
        marginRight: 50,
        marginBottom: 10,
        ...fontStyles.fontRoboto
    },

    // Other user, left chat bubble styles
    chatBubbleGray: {
        backgroundColor: isLightTheme() ? Colors.lightGrey : Colors.darkGrey,
        overflow:'hidden',
        marginLeft:10,
        marginRight:10,
        marginBottom:2,
        borderRadius:15,
        borderBottomStartRadius:0,
        maxWidth: '70%',   
    },
    chatBubbleGrayText: {
        padding: 10,
        textAlign:'left',
        color: isLightTheme() ? Colors.black : Colors.white,
        fontSize: 13,
        margin:0,...fontStyles.fontRoboto
    },
    chatBubbleGrayAvatar: {
        height:36,
        width:36,
        borderRadius:36,
        marginLeft: 5
    },
    chatBubbleGraySmallTxt: {
        fontSize:11,
        color: Colors.medGrey,
        textAlign: 'right',
        marginLeft: 50,
        marginBottom: 10,
        ...fontStyles.fontRoboto
    },

    // Common chat item styles
    chatBubbleImage: {
        width:'100%',
        height: undefined,
        aspectRatio: 1, 
        resizeMode: 'cover'
    }
    
    
});