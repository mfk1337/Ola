/**
 * Basic list 
 * Desc: Custom flatlist
 */

import React from 'react';
import { View, ViewStyle, StyleProp, FlatList, ListRenderItem } from 'react-native';

interface BasicListProps {
    style?: StyleProp<ViewStyle>;
    data: any; 
    renderItem: ListRenderItem<any>;
    onRefresh?: () => void;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    refreshing?: boolean;
    inverted?: boolean;
    refref?: any;
    onScroll?: (e: any) => void;
}

export const BasicList: React.FC<BasicListProps> = props => {

    const { style, data, refref, renderItem, onRefresh, onEndReached, onEndReachedThreshold, refreshing, inverted, onScroll } = props;

    return <FlatList style={[style]}
    data={data}
    ref={refref}
    inverted={inverted}
    ItemSeparatorComponent={() => <View style={{height: 3}} />}
    renderItem={renderItem}
    onEndReached={onEndReached}
    onRefresh={onRefresh}
    refreshing={refreshing}
    onEndReachedThreshold={onEndReachedThreshold}
    onScroll={onScroll}
    />  

}