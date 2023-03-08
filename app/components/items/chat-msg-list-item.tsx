import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { fontStyles, Colors} from '../../assets/styles';
import Moment from 'moment';

interface ChatMsgListItemProps {
    item: any;
    currentUser: boolean;
    onPress?: () => void;
    imageOnPress?: () => void;
}

export const ChatMsgListItem: React.FC<ChatMsgListItemProps> = props => {

    const { item, currentUser, onPress, imageOnPress } = props;

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
                <View style={{alignItems: 'flex-end'}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.chatBubbleGreen}>                              
                                {
                                    item.msg_image_url ? (
                                        <TouchableOpacity onPress={imageOnPress}>
                                        <Image style={styles.chatBubbleImage} source={{uri: item.msg_image_url}} />
                                        </TouchableOpacity>
                                    ):(
                                        <Text style={styles.chatBubbleGreenText}>{item.msg_text}</Text>
                                    )
                                }                                                 
                        </View> 
                        <Image source={item.sender_avatar ? {uri: item.sender_avatar} : require('../../assets/img/default-avatar.jpg')} style={styles.chatBubbleGreenAvatar}/>   
                    </View>
                    <Text style={styles.chatBubbleGreenSmallTxt}>{item.sender_name ? item.sender_name : 'NoName'} - {msgDateTime}</Text>          
                </View>
            ):(
                <View style={{alignItems: 'flex-start'}}>
                     <View style={{flexDirection: 'row'}}>
                        <Image source={item.sender_avatar ? {uri: item.sender_avatar} : require('../../assets/img/default-avatar.jpg')} style={styles.chatBubbleGrayAvatar}/>   
                        <View style={styles.chatBubbleGray}>                              
                                {
                                    item.msg_image_url ? (
                                        <TouchableOpacity onPress={imageOnPress}>
                                        <Image style={styles.chatBubbleImage} source={{uri: item.msg_image_url}} />
                                        </TouchableOpacity>
                                    ):(
                                        <Text style={styles.chatBubbleGrayText}>{item.msg_text}</Text>
                                    )
                                }                 
                        </View> 
                    </View>
                    <Text style={styles.chatBubbleGraySmallTxt}>{item.sender_name ? item.sender_name : 'NoName'} - {msgDateTime}</Text>          
                </View> 
            )}
                 
        </View>
    )
}


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
        color: Colors.black,
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
        backgroundColor: Colors.lightGrey,
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
        color: Colors.black,
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