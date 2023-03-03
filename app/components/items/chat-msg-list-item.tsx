import React from 'react';
import { Text, View, TouchableHighlight, Image, TouchableOpacity} from 'react-native';
import { fontStyles } from '../../assets/styles/fonts';
import { Colors } from '../../assets/styles/colors';
import Moment from 'moment';

interface ChatMsgListItemProps {
    item: any;
    currentUser: boolean;
    onPress?: () => void;
    imageOnPress?: () => void;
    defaultItemBgColor?: string;
}

export const ChatMsgListItem: React.FC<ChatMsgListItemProps> = props => {

    const { item, currentUser, onPress, imageOnPress, defaultItemBgColor } = props;

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
                        <View style={{backgroundColor: Colors.green, overflow:'hidden',  marginLeft:10, marginRight:10, marginBottom:2, borderRadius:15, borderBottomEndRadius:0, maxWidth: '70%',}}>                              
                                
                                {
                                    
                                    item.msg_image_url ? (
                                        <TouchableOpacity onPress={imageOnPress}>
                                        <Image style={{width:'100%', height: undefined, aspectRatio: 1,  resizeMode: 'cover'}} source={{uri: item.msg_image_url}} />
                                        </TouchableOpacity>
                                    ):(
                                        <Text style={{padding: 10,
                                            textAlign:'left',
                                            color: Colors.black,
                                            fontSize: 13,
                                            margin:0,...fontStyles.fontRoboto}}>{item.msg_text}</Text>
                                    )
                                }
                                                 
                        </View> 
                        <Image source={item.sender_avatar ? {uri: item.sender_avatar} : require('../../assets/img/default-avatar.jpg')} style={{height:36, width:36, borderRadius:36,marginRight: 5}}/>   
                    </View>

                    <Text style={{fontSize:11, color: Colors.medGrey, textAlign: 'right', marginRight: 50, marginBottom: 10, ...fontStyles.fontRoboto}}>{item.sender_name ? item.sender_name : 'NoName'} - {msgDateTime}</Text>          
                </View>
            ):(
                <View style={{alignItems: 'flex-start'}}>

                    <View style={{flexDirection: 'row'}}>
                    <Image source={item.sender_avatar ? {uri: item.sender_avatar} : require('../../assets/img/default-avatar.jpg')} style={{height:36, width:36, borderRadius:36,marginLeft: 5}}/>   

                    <View style={{backgroundColor: Colors.lightGrey, overflow:'hidden', marginLeft:10, marginRight:10, marginBottom:2, borderRadius:15, borderBottomStartRadius:0, maxWidth: '70%',}}>                              
                            
                    {
                                    
                                    item.msg_image_url ? (
                                        <TouchableOpacity onPress={imageOnPress}>
                                        <Image style={{width:'100%', height: undefined, aspectRatio: 1,  resizeMode: 'cover'}} source={{uri: item.msg_image_url}} />
                                        </TouchableOpacity>
                                    ):(
                                        <Text style={{padding: 10,
                                            textAlign:'left',
                                            color: Colors.black,
                                            fontSize: 13,
                                            margin:0,...fontStyles.fontRoboto}}>{item.msg_text}</Text>
                                    )
                                }
                            
                            
                                                    
                    </View> 
                    </View>

                    <Text style={{fontSize:11, color: Colors.medGrey, textAlign: 'right', marginLeft: 50, marginBottom: 10, ...fontStyles.fontRoboto}}>{item.sender_name ? item.sender_name : 'NoName'} - {msgDateTime}</Text>          
                </View> 
            )}
                 
        </View>
    )
}
