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
import { Switch } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


interface Ivalues{
  name: string; email: string; cpf: string; phone: string; bond: string; course: string; password: string; password_confirmation: string;
}

interface Ibond{
  id:number,
  name: string
}

interface Icourse{
  id:number,
  name: string
}

interface InitialValues{
  id: number
  cpf:string
  name:string
  email:string
  phone:string
  bond:string
  course:string
  password:string
  password_confirmation:string
}

export default function AccountSettings() {
  // Todo: Handle Password Changing
  
  const navigation = useNavigation();

  const [bonds, setBonds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialValues>({id: -1, name:'', cpf:'',email:'', phone:'', bond:'',course:'', password: '', password_confirmation: ''});
  
  var cpfRef: TextInputMask | null = null;
  var phoneRef: TextInputMask | null = null;
  const nameRef = useRef(null);
  const emailRef = useRef(null);
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
    
    const _getData = async (key:string) => {
      try {
        const jsonValue = await AsyncStorage.getItem(key)
        const objValue = jsonValue != null ? JSON.parse(jsonValue) : null;
        setInitialValues({
          id: objValue.id,
          cpf: objValue.cpf,
          name: objValue.name,
          email: objValue.email,
          phone: objValue.phone,
          bond: objValue.bond_id,
          course: objValue.course_id,
          password: '',
          password_confirmation: '',
        });

      } catch(e) {
        Toast.show({type: 'error', position: 'top',text1:'Erro', text2:'Falha ao Carregar Dados Internos', })
        console.log(e)
      }
    }
    _getData('@loggedUser');

    fetchBonds();
    fetchCourses();
  },[]);

  const _mergeData = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.mergeItem(key, jsonValue)
    } catch (e) {
      console.log(e)
      Toast.show({ type: 'error', position: 'bottom', text1: 'Erro', text2: 'Falha ao armazenar dados no dispositivos', visibilityTime: 3000 , });
    }
  }

  const inputStyle = {
    borderWidth: 1,
    borderColor: '#4e4e4e',
    padding: 12,
    marginBottom: 5,
  };

  const validationSchema = yup.object().shape({
    cpf: yup
      .string()
      .test('cpf valido', 'Cpf Não é válido', value => isValidCpf(value))
      .required('Digite seu CPF!'),
    name: yup
      .string()
      .required('Digite seu nome!'),
    email: yup
      .string()
      .email('Digite um email válido!')
      .required('Digite seu email!'),
    phone: yup
    .string(),
    bond: yup
    .string()
    .required('Selecione um Vínculo a UEG!'),
    course: yup
    .string()
    .required('Selecione o curso vinculado a UEG!'),
    password: yup
      .string()
      .min(6, 'Senha deve possuir no mínimo 6 caracteres!')
      .notRequired(),
    password_confirmation: yup
      .string()
      .min(6, 'Senha deve possuir no mínimo 6 caracteres!')
      .equals([yup.ref('password')], 'Senhas devem ser iguais')
      .notRequired(),
  })

    const handleUpdate = async (values: Ivalues) =>{
      if(values.bond != '2' && values.bond != '3'){
        values.course = '1';
      }

      
      let rawCpf = values.cpf.match(/\d+/g)?.join('')
      let rawPhone = values.phone.match(/\d+/g)?.join('')

      const password = values.password !== '' ? values.password : null;


    try {


      const response = await api.put(`/users/${initialValues.id}`,{
          name: values.name,
          email: values.email,
          phone: rawPhone,
          cpf: rawCpf,
          password: password,
          bond_id: parseInt(values.bond),
          course_id: parseInt(values.course),
       });

        //todo: insert loading component

        if(response.status === 200){
          Toast.show({type: 'success', position: 'bottom',text1:'Sucesso', text2:'Alteração Concluído', visibilityTime: 3000 , onHide: () => navigation.navigate('Main')});
          const data = response.data;

          _mergeData('@loggedUser', {
            id: data.id,
            name: data.name,
            email: data.email,
            cpf: data.cpf,
            phone: data.phone,
            bond_id: data.bond_id,
            role_id: data.role_id,
            course_id: data.courses[0].id
          });

          setIsEditable(false);
        }

    } catch (error) {

       //mensagens de erro no cadastro
      if (error.response.status == 400) {
        Toast.show({ type: 'error', position: 'bottom', text1: 'Erro', text2: error.response.data[0].message , })
      }
      if (error.response.status == 500) {
        Toast.show({ type: 'error', position: 'bottom', text1: 'Erro', text2: 'Falha ao Alterar Dados. erro Interno do Servidor!' , })
      }
    }
  }

    return (
      <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <StatusBar />
        <SafeAreaView style={styles.formContainer}>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={values => handleUpdate(values)}

            validationSchema={validationSchema}
          >
            {({ values, handleChange, setFieldValue, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
              <View style={styles.formContainer}>

                  <Button
                    color="#3740FE"
                    title="Editar meus Dados"
                    onPress={() => setIsEditable(true)}
                    disabled={isEditable}
                  />

                <Text style={styles.textInput}>Nome</Text>
                <TextInput
                  editable={isEditable}
                  value={values.name}
                  style={inputStyle}
                  ref={nameRef}
                  onSubmitEditing={() => { if(cpfRef != null) {cpfRef.getElement().focus()} }}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                  blurOnSubmit={false}
                  placeholder="nome"
                />
                {touched.name && errors.name &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.name}</Text>
                } 

                <Text style={styles.textInput}>CPF</Text>
                <TextInputMask
                  editable={isEditable}
                  type={'cpf'}
                  value={values.cpf}
                  ref={(ref) => cpfRef = ref}
                  onSubmitEditing={() => { if(emailRef != null) {emailRef.current!.focus()} }}
                  style={inputStyle}
                  onChangeText={(text) => {setFieldValue('cpf', text)}}
                  onBlur={() => setFieldTouched('cpf')}
                  placeholder="000.000.000-00"
                  customTextInputProps={{
                    ref: cpfRef,
                  }}
                />
                {touched.cpf && errors.cpf &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.cpf}</Text>
                }       

                <Text style={styles.textInput}>Email</Text>
                <TextInput
                  editable={isEditable}
                  value={values.email}
                  style={inputStyle}
                  ref={emailRef}
                  onSubmitEditing={() => { if(phoneRef != null) {phoneRef!.getElement()!.focus()} }}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  placeholder="sample@email.com"
                />
                {touched.email && errors.email &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.email}</Text>
                }    

                <Text style={styles.textInput}>Celular</Text>
                <TextInputMask
                  editable={isEditable}
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                  }}
                  ref={(ref) => phoneRef = ref}
                  value={values.phone}
                  style={inputStyle}
                  onChangeText={(text) => {setFieldValue('phone', text)}}
                  onBlur={() => setFieldTouched('phone')}
                  placeholder="(00) 00000-0000"
                />
                {touched.phone && errors.phone &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.phone}</Text>
                }
                
                <Text style={styles.textInput}>Relação com a UEG</Text>
                <Picker
                  enabled={isEditable}
                  selectedValue={values.bond}
                  ref={bondRef}
                  onValueChange={(item,index) => {
                    setFieldValue('bond',item);
                    if(item != 2 && item != '3' && item != ''){
                      setFieldValue('course','1');
                    }else{
                      if(values.course == '1'){
                        setFieldValue('course','1');
                      }
                    }
                  }}>
                  <Picker.Item label="Vínculo com a UEG" value={''} />              
                  {bonds.map((bond:Ibond) =>{
                    return <Picker.Item key={bond.id} label={bond.name} value={bond.id} />
                  })}
                </Picker>  
                {touched.bond && errors.bond &&
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.bond}</Text>
                }

              {values.bond == '2' || values.bond == '3' ? //If there is Bond selects the
              <>
                <Text style={styles.textInput}>Curso Relacionado</Text>      
                  <Picker
                    enabled={isEditable}
                    selectedValue={values.course}
                    ref={courseRef}
                    onValueChange={(item,index) => {setFieldValue('course',item); }}>
                    <Picker.Item label="Selecione um Curso" value={''} />              
                    {courses.map((course:Icourse) =>{
                      return <Picker.Item key={course.id} label={course.name} value={course.id } />
                    })}
                  </Picker>  
                  {touched.course && errors.course &&
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.course}</Text>
                  }
              </>
              : null}
                {isEditable ? 
                  <View style={{display: 'flex', flexDirection: 'row', marginTop: 15}}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={changePassword ? "#81b0ff" : "#767577"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => setChangePassword(!changePassword)}
                      value={changePassword}
                      />
                      <Text style={styles.textInput}>Alterar Senha</Text>
                  </View>
                :null}
                {changePassword ? 
                <>
                  <Text style={styles.textInput}>Nova Senha</Text>  
                  <TextInput
                    editable={isEditable}
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

                  <Text style={styles.textInput}>Confirmação de Nova Senha</Text>
                  <TextInput
                    editable={isEditable}
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
                </>
                :null}
                {isEditable ? 
                <>
                  <View style={styles.divider}></View>
                  <Button
                    color="#3740FE"
                    title='Alterar Dados'
                    disabled={!isValid}
                    onPress={() => handleSubmit()}
                  />
                </>
                : null}
              </View>
            )}
          </Formik>
        </SafeAreaView> 
      </ScrollView>
      <Toast  ref={(ref) => Toast.setRef(ref)} />
      </>
    );
  }
  
  const styles = StyleSheet.create({
    formContainer: {
      padding: 20,
      justifyContent: 'space-between',
    },
    textInput: {
      marginTop: 15,
      fontWeight: 'bold',
      fontSize: 17
    },
    divider: {
      padding: 20
    },
});

LogBox.ignoreAllLogs(false)