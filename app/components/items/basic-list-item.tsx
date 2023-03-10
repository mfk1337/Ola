/**
 * Basic list item for Flatlist (See also Basiclist)
 * Desc: Custom flatlist item with styling
 */

import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontStyles, Colors } from '../../assets/styles';
import { isLightTheme } from '../../libs/colorscheme';


interface BasicListItemProps {
    item: any;
    onPress?: () => void;
}

export const BasicListItem: React.FC<BasicListItemProps> = props => {

    const { item, onPress } = props;

    return(
        <TouchableHighlight onPress={onPress}>

            <View style={styles.listItemContainer}>
                <View style={styles.listItemContainerChild}>               
                    <Text style={styles.listItemTitle}>{item.name}</Text>
                    <Text style={styles.listItemDesc}>{item.desc}</Text>            
                </View>
                <View style={styles.listItemArrowContainer}>
                    <Icon size={34} color={isLightTheme() ? "white" : Colors.darkestGrey} name="chevron-forward" />
                </View>                
            </View>
        </TouchableHighlight>
    )
}

// Local stylesheet for this component
const styles = StyleSheet.create({
   
    listItemContainer: {
        flexDirection: 'row',
        backgroundColor: isLightTheme() ? Colors.lightGreen : Colors.darkGrey,  
    },
    listItemContainerChild: {
        flexDirection: 'column',
        justifyContent:'flex-start',
        marginBottom:0,
        flex: 1
    },
    listItemTitle: {
        padding: 10,
        paddingBottom: 2,
        textAlign:'left',
        color: isLightTheme() ? Colors.black : Colors.green,
        fontSize: 17,
        margin:0,
        ...fontStyles.fontRoboto
    },
    listItemDesc: {
        padding: 10,
        paddingTop: 2,
        textAlign:'left',
        color: isLightTheme() ? Colors.black : Colors.darkestGrey,
        fontSize: 12,
        margin:0,...fontStyles.fontRoboto
    },
    listItemArrowContainer: {
        alignSelf: 'center'
    }
    
});
