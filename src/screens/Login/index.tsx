import React, { useRef } from 'react';
import { TextInput, Text, Button, Alert, View, StyleSheet, LogBox, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup'
import { Formik } from 'formik'
import { isValidCpf } from '../../utils/validations';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';


export default function Login() {

  const cpfRef = useRef(null);
  const passwordRef = useRef(null);
  const navigation = useNavigation();


    const inputStyle = {
      borderWidth: 1,
      borderColor: '#4e4e4e',
      padding: 12,
      marginBottom: 5,
    };

    return (
      <SafeAreaView>
        <StatusBar />
        <Toast  ref={(ref) => Toast.setRef(ref)} />
        <Formik
          initialValues={{ 
            cpf: '',
            password: '' 
          }}
          onSubmit={(values) => {
            values.cpf = values.cpf.match(/\d+/g)!.join('')
            navigation.navigate('Main')
          }}
          validationSchema={yup.object().shape({
            cpf: yup
            .string()
            .test('cpf valido', 'Cpf Não é válido', value => isValidCpf(value))
            .required('Digite seu CPF!'),
            password: yup
              .string()
              .min(6, 'Senha deve possuir 6 dígitos ou mais!')
              .required('Digite sua senha!'),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, setFieldValue, touched, isValid, handleSubmit }) => (
            <View style={styles.formContainer}>
              <Text>CPF</Text>
              <TextInputMask
                type={'cpf'}
                value={values.cpf}
                ref={cpfRef}
                onSubmitEditing={() => { if(passwordRef != null) {passwordRef.current!.focus()} }}
                style={inputStyle}
                onChangeText={(text) => {setFieldValue('cpf', text)}}
                onBlur={() => setFieldTouched('cpf')}
                placeholder="000.000.000-00"
              />
              {touched.cpf && errors.cpf &&
                <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.cpf}</Text>
              }                    

              <Text>Password</Text>
              <TextInput
                value={values.password}
                ref={passwordRef}
                style={inputStyle}
                onChangeText={handleChange('password')}
                placeholder="*******"
                onBlur={() => setFieldTouched('password')}
                secureTextEntry={true}
              />
              {touched.password && errors.password &&
                <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.password}</Text>
              }
              <Button
                color="#3740FE"
                title='Login'
                disabled={!isValid}
                onPress={() => handleSubmit()}
              />
            </View>
          )}
        </Formik>
        <Button
          title="Criar Conta"
          onPress={() => navigation.navigate('Register')}
        />
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  formContainer: {
    padding: 50 
  }
});

LogBox.ignoreAllLogs(false)