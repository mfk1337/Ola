import React from 'react';
import { Text, View, TouchableHighlight} from 'react-native';
import { fontStyles } from '../../assets/styles/fonts';
import { Colors } from '../../assets/styles/colors';
import Moment from 'moment';

interface ChatMsgListItemProps {
    item: any;
    currentUser: boolean;
    onPress?: () => void;
    defaultItemBgColor?: string;
}

export const ChatMsgListItem: React.FC<ChatMsgListItemProps> = props => {

    const { item, currentUser, onPress, defaultItemBgColor } = props;

    //const timedate = new Date(item.msg_date.toDate()).toLocaleString('da-DK',{hour12: false}).format('YYYY-MM-DD hh:mm:ss a');

    //const timedate = new Date(Moment(item.msg_date.toDate()).format("dddd"))

    var now = Moment().format("ddd D/M-YY - HH:mm");

    return(
            <View style={{alignItems:currentUser ? 'flex-end': 'flex-start'}}>
                <View style={{}}>
                    {currentUser ? (
                        
                        <View style={{flexDirection: 'row', backgroundColor: Colors.green, marginLeft:10, marginRight:10, marginBottom:2, borderRadius:15, width: '70%'}}>                              
                                <Text style={{padding: 10,
                                    textAlign:'left',
                                    color: Colors.black,
                                    fontSize: 12,
                                    margin:0,...fontStyles.fontRoboto}}>{item.msg_text}</Text>                       
                        </View>  
                    ):(
                        
                        <View style={{flexDirection: 'row', backgroundColor: Colors.lightGrey, marginLeft:10, marginRight:10, marginBottom:2, borderRadius:15, width: '70%'}}>                              
                            <Text style={{padding: 10,
                                textAlign:'left',
                                color: Colors.black,
                                fontSize: 12,
                                margin:0,...fontStyles.fontRoboto}}>{item.msg_text}</Text>                       
                        </View>
                    )}
                <Text style={{fontSize:11, color: Colors.medGrey, textAlign: 'right', marginRight: 15, marginBottom: 10}}>Fayyaz - {now}</Text>          
                </View>      
            </View>
       
        
    )
}
