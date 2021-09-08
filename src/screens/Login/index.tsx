import React, { useRef } from 'react';
import { TextInput, Text, Alert, View, StyleSheet, LogBox, SafeAreaView, Image } from 'react-native';
import { useNavigation, Link } from '@react-navigation/native';
import * as yup from 'yup'
import { Formik } from 'formik'
import { isValidCpf } from '../../utils/validations';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import { useAuth } from '../../hooks/auth';

export default function Login() {

  const cpfRef = useRef(null);
  const passwordRef = useRef(null);
  const navigation = useNavigation();


  const inputStyle = {
    // borderBottomWidth: 1,
    borderColor: '#4e4e4e',
    padding: 20,
    marginBottom: 8,
    margin: 5,
    borderRadius: 15,
    borderWidth: 1
  };

  const { signIn } = useAuth();

  return (
    <ScrollView contentInsetAdjustmentBehavior="always">
      <SafeAreaView style={styles.container}>
        <StatusBar />
        {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
        <Formik
          initialValues={{
            cpf: '',
            password: ''
          }}
          onSubmit={(values) => {
            values.cpf = values.cpf.match(/\d+/g)!.join('');
              signIn({
                cpf: values.cpf,
                password: values.password,
              }).then(res=>{
                navigation.navigate('Main')
              }).catch(err=>{
                console.log(err)
                if(err.toString() === 'Error: Request failed with status code 401'){
                  Alert.alert('Combinação de Login e senha incorreta!');
                } else {
                  Alert.alert('Erro inesperado aconteceu!');
                }
              })
          }}
          validationSchema={yup.object().shape({
            cpf: yup
              .string()
              .test('cpf valido', 'CPF Não é válido!', value => isValidCpf(value))
              .required('Digite seu CPF!'),
            password: yup
              .string()
              .min(6, 'Senha deve possuir 6 dígitos ou mais!')
              .required('Digite sua senha!'),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, setFieldValue, touched, isValid, handleSubmit }) => (
            < View style={styles.container}>
              <View style={{ paddingBottom: 20, alignItems: 'center' }}>{/* Header */}
                <Image source={require('../../../assets/e-reserva.png')} />
              </View>
              <Text style={styles.title}>Faça seu login</Text>

              <Text style={styles.textInput}>CPF</Text>

              <TextInputMask
                type={'cpf'}
                value={values.cpf}
                ref={cpfRef}
                onSubmitEditing={() => { if (passwordRef != null) { passwordRef.current!.focus() } }}
                style={inputStyle}
                onChangeText={(text) => { setFieldValue('cpf', text) }}
                onBlur={() => setFieldTouched('cpf')}
                placeholder="000.000.000-00"
              />
              {touched.cpf && errors.cpf &&
                <Text style={{ fontSize: 14, color: '#FF0D10', marginTop: 6 }}>{errors.cpf}</Text>
              }

              <View style={{ padding: 18 }}></View>

              <Text style={styles.textInput}>Password</Text>
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
                <Text style={{ fontSize: 14, color: '#FF0D10', marginTop: 6 }}>{errors.password}</Text>
              }

              <View style={{ padding: 20 }}></View>

              <Button
                title='Login'
                disabled={!isValid}
                onPress={() => handleSubmit()}
              />
            </View>
          )}
        </Formik>
        <View style={{ margin: 10, alignItems: 'center' }}>
          {/* 
          <Button

            title="Criar Conta"
            onPress={() => navigation.navigate('Register')}
          /> */}
          <Link to='/Register'> <Text style={styles.link}> Criar Conta</Text></Link>
        </View>

      </SafeAreaView>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 50
  },
  container: {
    backgroundColor: "#FFFF",
    padding: 30,
    justifyContent: 'space-between',
  },
  divider: {
    padding: 30
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  link: {
    fontWeight: 'bold',
    color: '#808080',
    fontSize: 16
  },
  textInput: {
    fontWeight: 'bold',
    paddingLeft: 6,
    paddingBottom: 4,
    fontSize: 17
  }
});

LogBox.ignoreAllLogs(false)