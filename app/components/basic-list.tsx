import React from 'react';
import { View, ViewStyle, StyleProp, FlatList, ListRenderItem} from 'react-native';

interface BasicListProps {
    style?: StyleProp<ViewStyle>;
    data: any; 
    renderItem: ListRenderItem<any>;
}

export const BasicList: React.FC<BasicListProps> = props => {

    const { style, data, renderItem } = props;

    return <FlatList style={[style]}
    data={data}
    ItemSeparatorComponent={() => <View style={{height: 3}} />}
    renderItem={renderItem}/>  

}