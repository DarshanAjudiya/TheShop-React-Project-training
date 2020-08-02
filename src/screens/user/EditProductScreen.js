import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { View, StyleSheet, Platform, ScrollView, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as productActions from '../../../store/actions/productsActions';
import Input from '../../components/UI/Input';
import Colors from '../../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const EditProductScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const pid = route.params ? route.params.pid : null;
    const editedProduct = useSelector(state => state.products.userProducts.find(product => product.id === pid));
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    });

    const submitFn = useCallback(
        async () => {
            if (!formState.formIsValid) {
                Alert.alert('Wrong input!', 'Please check the errors in the form.', [
                    { text: 'Okay' }
                ]);
                return;
            }
            setError(null);
            setIsLoading(true);
            try {
                if (editedProduct) {
                    await dispatch(productActions.editProduct(pid, formState.inputValues.title,
                        formState.inputValues.imageUrl,
                        formState.inputValues.description));
                }
                else {
                    await dispatch(productActions.addProduct(formState.inputValues.title,
                        formState.inputValues.imageUrl,
                        formState.inputValues.description,
                        +formState.inputValues.price));
                }
                navigation.goBack();
            }
            catch (err) {
                setError(err);
            }
            setIsLoading(false);
        },
        [pid, dispatch, formState, setError, setIsLoading]
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title="Save"
                        iconName={
                            Platform.OS === 'android' ? 'md-checkmark-circle-outline' : 'ios-checkmark-circle-outline'
                        }
                        onPress={submitFn}
                    />
                </HeaderButtons>
            }
        });
    },
        [submitFn]
    );

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );

    useEffect(() => {
        if (error) {
            Alert.alert('error Occured:', error, [{
                text: 'Ok', style: 'default',
                onPress: () => { setError(null); }
            }]);
        }
    }, [error]);

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={100}
        >
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id="title"
                        label="Title"
                        errorText="Please enter a valid title!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id="imageUrl"
                        label="Image Url"
                        errorText="Please enter a valid image url!"
                        keyboardType="default"
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {editedProduct ? null : (
                        <Input
                            id="price"
                            label="Price"
                            errorText="Please enter a valid price!"
                            keyboardType="decimal-pad"
                            returnKeyType="next"
                            onInputChange={inputChangeHandler}
                            required
                            min={0.1}
                        />
                    )}
                    <Input
                        id="description"
                        label="Description"
                        errorText="Please enter a valid description!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
export const EditProductScreenOptions = ({ route }) => {
    const routeParams = route.params ? route.params : {};
    return {
        headerTitle: routeParams.pid
            ? 'Edit Product'
            : 'Add Product'

    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default EditProductScreen;
