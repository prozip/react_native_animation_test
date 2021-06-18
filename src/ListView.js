import React, { useRef, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Text, StatusBar } from 'react-native';
import { SpringScrollView } from 'react-native-custom-scroll';

import ItemBlock from './ItemBlock';
import TravelAPI from './store/TravelAPI';
import { parseKey } from './store/parseData';

const ListView = ({ navigation }) => {

    const [posts, updatePosts, getData, header] = TravelAPI();
    const ref = useRef(null);

    const renderItem = ({ item }) => (
        <ItemBlock post={item} id={parseKey(item)} navigation={navigation} />
    );
    useEffect(() => {
        getData()
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <SpringScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                ref={ref}
                onRefresh={() => {
                    ref.current.endRefresh();
                    updatePosts(undefined);
                    getData();
                }}
            >
                {posts ? <View style={styles.itemContainer}>
                    <Text style={styles.date}>{new Date().toDateString()}</Text>
                    <Text style={styles.title}>{header}</Text>
                    <StatusBar translucent backgroundColor='transparent'></StatusBar>
                    <FlatList
                        data={posts}
                        renderItem={renderItem}
                        keyExtractor={item => parseKey(item)}
                    />
                </View> : <View style={styles.itemContainer}>
                        <Text style={styles.date}>{new Date().toDateString()}</Text>
                        <Text style={styles.title}>Loading...</Text>
                        <StatusBar translucent backgroundColor='transparent'></StatusBar>
                    </View>}
            </SpringScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 5
    },
    itemContainer: {
        paddingHorizontal: 25,
        paddingVertical: 55
    },

    date: {
        color: '#989898',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 3
    },
    title: {
        color: '#FFF',
        fontSize: 45,
        fontWeight: '700',
        marginBottom: 20
    }
})

export default ListView;