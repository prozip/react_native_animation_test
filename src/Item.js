import React from 'react';
import { SharedElement } from 'react-navigation-shared-element';
import { TouchableOpacity, View, Image, StyleSheet, StatusBar, Text } from 'react-native';

const Item = ({ title, id, navigation }) => (
    <TouchableOpacity onPress={() => navigation.push("DetailView", { id: id })}>
        <View style={styles.item}>
            <SharedElement id={id}>
                <Image
                    source={{ uri: 'https://cdn.vox-cdn.com/thumbor/ajQqX6GfVMuJoRYMh2pl3eJsRv0=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/13959855/acastro_190218_1777_apple_streaming_0003.jpg' }}
                    style={{ width: 100, height: 100 }}
                ></Image>
            </SharedElement>

            <Text style={styles.title}>{title}</Text>
        </View>
    </TouchableOpacity>

);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row'
    },
    title: {
        fontSize: 32,
    },
});
export default Item;