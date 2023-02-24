import React from 'react';
import { Text, View, TouchableHighlight} from 'react-native';
import { fontStyles } from '../../assets/styles/fonts';
import { Colors } from '../../assets/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface ChatMsgListItemProps {
    item: any;
    currentUser: boolean;
    onPress?: () => void;
    defaultItemBgColor?: string;
}

export const ChatMsgListItem: React.FC<ChatMsgListItemProps> = props => {

    const { item, currentUser, onPress, defaultItemBgColor } = props;

    return(
            <View style={{alignItems:currentUser ? 'flex-end': 'flex-start'}}>
            <TouchableHighlight onPress={onPress}>
                {currentUser ? (
                    <View style={{flexDirection: 'row', backgroundColor: Colors.green, marginLeft:10, marginRight:10, marginTop:10, borderRadius:15, width: '70%'}}>                              
                            <Text style={{padding: 10,
                                textAlign:'left',
                                color: Colors.black,
                                fontSize: 12,
                                margin:0,...fontStyles.fontRoboto}}>{item.msg_text}</Text>                       
                    </View>  
                  ):(   
                    <View style={{flexDirection: 'row', backgroundColor: Colors.lightGrey, marginLeft:10, marginRight:10, marginTop:10, borderRadius:15, width: '70%'}}>                              
                        <Text style={{padding: 10,
                            textAlign:'left',
                            color: Colors.black,
                            fontSize: 12,
                            margin:0,...fontStyles.fontRoboto}}>{item.msg_text}</Text>                       
                    </View>                 
                    )}     
            </TouchableHighlight>
      
            </View>
       
        
    )
}
