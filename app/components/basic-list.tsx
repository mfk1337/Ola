import React from 'react';
import { View, ViewStyle, StyleProp, FlatList, ListRenderItem, RefreshControl} from 'react-native';

interface BasicListProps {
    style?: StyleProp<ViewStyle>;
    data: any; 
    renderItem: ListRenderItem<any>;
    onRefresh?: () => void;
    onEndReached?: () => void;
    refreshing?: boolean;
    inverted?: boolean;
    refref?: any;
}

export const BasicList: React.FC<BasicListProps> = props => {

    const { style, data, refref, renderItem, onRefresh, onEndReached, refreshing, inverted } = props;

    return <FlatList style={[style]}
    data={data}
    ref={refref}
    inverted={inverted}
    ItemSeparatorComponent={() => <View style={{height: 3}} />}
    renderItem={renderItem}
    onEndReached={onEndReached}
    onRefresh={onRefresh}
    refreshing={refreshing}
    />  

}