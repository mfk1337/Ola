import React from 'react';
import { Text, View, TouchableHighlight} from 'react-native';
import { fontStyles } from '../../assets/styles/fonts';
import { Colors } from '../../assets/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface BasicListItemProps {
    item: any;
    onPress?: () => void;
    defaultItemBgColor?: string;
}

export const BasicListItem: React.FC<BasicListItemProps> = props => {

    const { item, onPress, defaultItemBgColor } = props;

    return(
        <TouchableHighlight onPress={onPress}>

            <View style={{flexDirection: 'row', backgroundColor: Colors.lightGreen}}>
                <View style={{flexDirection: 'column',justifyContent:'flex-start', marginBottom:0, flex: 1}}>               
                    <Text style={{padding: 10, paddingBottom: 2,
                        textAlign:'left',
                        // Default fontcolor is set to black, but is white when another background color is chosen. Could be more "Smart" by checking contrast etc.
                        color: Colors.black,
                        fontSize: 17,
                        margin:0,...fontStyles.fontRoboto}}>{item.name}</Text>
                    <Text style={{padding: 10, paddingTop: 2,
                        textAlign:'left',
                        // Default fontcolor is set to black, but is white when another background color is chosen. Could be more "Smart" by checking contrast etc.
                        color: Colors.black,
                        fontSize: 12,
                        margin:0,...fontStyles.fontRoboto}}>{item.desc}</Text>            
                </View>
                <View style={{alignSelf: 'center'}}>
                    <Icon size={34} color="white" name="chevron-forward" />
                </View>                
            </View>

            

        </TouchableHighlight>
    )
}
