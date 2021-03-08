import React, {useState, useEffect, useRef} from 'react';
import { TextInput, Text, Button, Alert, View, StyleSheet, LogBox, SafeAreaView, ScrollView} from 'react-native';
import {Picker} from '@react-native-community/picker'
import * as yup from 'yup'
import { Formik } from 'formik'
import Toast from 'react-native-toast-message';
import { TextInputMask } from 'react-native-masked-text';
import { useNavigation } from '@react-navigation/native';


import { isValidCpf } from '../../utils/validations';


import api from '../../services/api';
import { StatusBar } from 'expo-status-bar';

interface Ivalues{
  name: string; email: string; cpf: string; bond: string; course: string; password: string; password_confirmation: string;
}

interface Ibond{
  id:number,
  name: string
}

interface Icourse{
  id:number,
  name: string
}

export default function Register() {
  
  const navigation = useNavigation();

  const [bonds, setBonds] = useState([]);
  const [courses, setCourses] = useState([]);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const bondRef = useRef(null);
  const courseRef = useRef(null);
  const passwordRef = useRef(null) ;
  const password_confirmationRef = useRef(null);
  
  useEffect(() => {
    const fetchBonds = async ()=>{
      try{
        const response = await api.get('bonds');
        setBonds(response.data);
      }catch(err){
        Toast.show({type: 'error', position: 'top',text1:'Erro', text2:'Falha ao Carregar Vínculos'})
        console.log(err)
      }
    }
  
    const fetchCourses = async ()=>{
      try{
        const response = await api.get('courses');
        setCourses(response.data);
      }catch(err){
        Toast.show({type: 'error', position: 'top',text1:'Erro', text2:'Falha ao Carregar Cursos', })
        console.log(err)
      }
    }

    fetchBonds();
    fetchCourses();
  },[])
  
  

  const inputStyle = {
    borderWidth: 1,
    borderColor: '#4e4e4e',
    padding: 12,
    marginBottom: 5,
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required('Digite seu nome!'),
    email: yup
      .string()
      .email('Digite um email válido!')
      .required('Digite seu email!'),
    cpf: yup
      .string()
      .test('cpf valido', 'Cpf Não é válido', value => isValidCpf(value))
      .required('Digite seu CPF!'),
    bond: yup
    .string()
    .required('Selecione um Vínculo a UEG!'),
    course: yup
    .string()
    .required('Selecione o curso vinculado a UEG!'),
    password: yup
      .string()
      .min(6, 'Senha deve possuir no mínimo 6 caracteres!')
      .required('Digite sua senha!'),
    password_confirmation: yup
      .string()
      .min(6, 'Senha deve possuir no mínimo 6 caracteres!')
      .equals([yup.ref('password')], 'Senhas devem ser iguais')
      .required('Confirme sua senha!'),
  })

    const handleRegister = async (values: Ivalues) =>{
      if(values.bond === '1'){
        values.course = '1';
      }

      
      let rawCpf = values.cpf.match(/\d+/g)?.join('')

      try{
        await api.post('/users',{
          name: values.name,
          email: values.email,
          cpf: rawCpf,
          password: values.password,
          bond_id: parseInt(values.bond),
          course_id: parseInt(values.course),
        });

        //put loading
        Toast.show({type: 'success', position: 'top',text1:'Sucesso', text2:'Registro Concluído', visibilityTime: 3000 , onHide: () => navigation.navigate('Main')});
      }catch(err){
        Toast.show({type: 'error', position: 'top',text1:'Erro', text2:'Falha ao Registrar'})
        console.log(err)
      }
    }


    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <StatusBar />
        <SafeAreaView>
          <Formik
            initialValues={{ 
              name:'',
              email: '',
              cpf: '',
              bond:'',
              course:'',
              password: '',
              password_confirmation: '',
            }}

            onSubmit={values => handleRegister(values)}

            validationSchema={validationSchema}
          >
            {({ values, handleChange, setFieldValue, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
              <View style={styles.formContainer}>
                <Text>Nome</Text>
                <TextInput
                  value={values.name}
                  style={inputStyle}
                  ref={nameRef}
                  onSubmitEditing={() => { if(emailRef != null) {emailRef.current!.focus()} }}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                  blurOnSubmit={false}
                  placeholder="nome"
                />
                {touched.name && errors.name &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.name}</Text>
                } 

                <Text>Email</Text>
                <TextInput
                  value={values.email}
                  style={inputStyle}
                  ref={emailRef}
                  onSubmitEditing={() => { if(cpfRef != null) {cpfRef.getElement().current.focus()} }}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  placeholder="sample@email.com"
                />
                {touched.email && errors.email &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.email}</Text>
                }    
                

                <Text>CPF</Text>
                <TextInputMask
                  type={'cpf'}
                  value={values.cpf}
                  ref={cpfRef}
                  style={inputStyle}
                  onChangeText={(text) => {setFieldValue('cpf', text)}}
                  onBlur={() => setFieldTouched('cpf')}
                  placeholder="000.000.000-00"
                />
                {touched.cpf && errors.cpf &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.cpf}</Text>
                }        

                <Text>Vínculo com a UEG</Text>
                <Picker
                  selectedValue={values.bond}
                  ref={bondRef}
                  onValueChange={(item,index) => {setFieldValue('bond',item);setFieldTouched('bond')}}>
                  <Picker.Item label="Selecione um Vínculo" value={''} />              
                  {bonds.map((bond:Ibond) =>{
                    return <Picker.Item key={bond.id} label={bond.name} value={bond.id} />
                  })}
                </Picker>  
                {touched.bond && errors.bond &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.bond}</Text>
                }

              {values.bond !== '1' ? //If there is Bond selects the
              <>
                <Text>Curso</Text>      
                  <Picker
                    selectedValue={values.course}
                    onValueChange={(item,index) => {setFieldValue('course',item); setFieldTouched('course')}}>
                    <Picker.Item label="Selecione um Curso" value={''} />              
                    {courses.map((course:Icourse) =>{
                      return <Picker.Item key={course.id} label={course.name} value={course.id} />
                    })}
                  </Picker>  
                  {touched.course && errors.course &&
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.course}</Text>
                  }
              </>
              : null}
                
                <Text>Senha</Text>  
                <TextInput
                  value={values.password}
                  ref={passwordRef}
                  onSubmitEditing={() => { if(password_confirmationRef != null) {password_confirmationRef.current!.focus()} }}
                  style={inputStyle}
                  onChangeText={handleChange('password')}
                  placeholder="*******"
                  onBlur={() => setFieldTouched('password')}
                  secureTextEntry={true}
                />
                {touched.password && errors.password &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.password}</Text>
                }

                <Text>Confirmação de Senha</Text>
                <TextInput
                  value={values.password_confirmation}
                  ref={password_confirmationRef}
                  style={inputStyle}
                  onChangeText={handleChange('password_confirmation')}
                  placeholder="*******"
                  onBlur={() => setFieldTouched('password_confirmation')}
                  secureTextEntry={true}
                />
                {touched.password_confirmation && errors.password_confirmation &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.password_confirmation}</Text>
                }

                <Button
                  color="#3740FE"
                  title='Registrar-se'
                  disabled={!isValid}
                  onPress={() => handleSubmit()}
                />
              </View>
            )}
          </Formik>
        </SafeAreaView> 
        <Toast  ref={(ref) => Toast.setRef(ref)} />
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    formContainer: {
    padding: 50 
  }
});

LogBox.ignoreAllLogs(false)