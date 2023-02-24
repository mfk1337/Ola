import React from 'react';
import { View, ViewStyle, StyleProp, FlatList, ListRenderItem, RefreshControl} from 'react-native';

interface BasicListProps {
    style?: StyleProp<ViewStyle>;
    data: any; 
    renderItem: ListRenderItem<any>;
    onRefresh?: () => void;
    refreshing?: boolean;
}

export const BasicList: React.FC<BasicListProps> = props => {

    const { style, data, renderItem, onRefresh,refreshing } = props;

    return <FlatList style={[style]}
    data={data}
    ItemSeparatorComponent={() => <View style={{height: 3}} />}
    renderItem={renderItem}
    onRefresh={onRefresh}
    refreshing={refreshing}
    />  

}