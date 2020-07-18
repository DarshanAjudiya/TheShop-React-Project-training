import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const EditProductScreen = ({navigation}) => {
    return (
    <View>
        <Text>this is product overview</Text>    
    </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:"center",
        justifyContent: 'center'
    }
});

export default EditProductScreen;
