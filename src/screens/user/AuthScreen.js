import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Colors from '../../../constants/Colors';
import * as authActions from '../../../store/actions/authActions';

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

const AuthScreen = ({ navigation }) => {
  const [touched, setIsTouched] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  const signupHandler = async () => {

    if (!formState.formIsValid) {
      setIsTouched(true);
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {
          text: 'Okay'
        }
      ]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (isSignup) {
        await dispatch(
          authActions.signup(
            formState.inputValues.email,
            formState.inputValues.password
          )
        );
      }
      else {
        await dispatch(
          authActions.login(
            formState.inputValues.email,
            formState.inputValues.password
          )
        );
      }
      // navigation.navigate('Shop');
    }
    catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

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

  const toggleIsSignUp = useCallback(() => {
    setIsTouched(true);
    setIsSignup(!isSignup);
    setIsTouched(false);

  }, [setIsSignup, isSignup, setIsTouched]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error occurred!!', error, [{
        text: 'Ok',
        onPress: () => { setError(null) }
      }]);
    }
  }, [error, setError]);


  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={10}
      style={styles.screen}
    >
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <Text style={styles.text}>{isSignup ? 'SignUp' : 'LogIn'} </Text>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=''
              initiallyValid={false}
              required
              touched={touched}
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
              initiallyValid={false}
              required
              touched={touched}
            />
            <View style={styles.buttonContainer}>
              {isLoading ?
                <ActivityIndicator size='large' color={Colors.primary} style={{ alignSelf: 'center' }} /> :
                <Button
                  title={isSignup ? 'Sign Up' : "Log In"}
                  color={Colors.secondary}
                  onPress={signupHandler}
                />}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={isSignup ? 'Switch To Log In' : "Switch to Sign Up"}
                color={Colors.accent}
                onPress={() => { toggleIsSignUp();} }
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export const AuthScreenOptions = {
  headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  },
  text: {
    alignSelf: "center",
    color: Colors.accent,
    fontFamily: 'open-sans-bold',
    fontSize: 20
  }
});

export default AuthScreen;
