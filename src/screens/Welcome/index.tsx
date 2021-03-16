import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface LoggedUser {
  id: number
  cpf: string
  name: string
  email: string
  phone: string
  bond: string
  course: string
}



export default function Welcome() {

  const [user, setUser] = useState<LoggedUser>({ id: -1, name: '', cpf: '', email: '', phone: '', bond: '', course: '' });

  useEffect(() => {
    const _getData = async (key: string) => {
      try {
        const jsonValue = await AsyncStorage.getItem(key)
        setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
      } catch (e) {
        console.log(e)
      }
    }
    _getData('@loggedUser');
  }, []);


  const navigation = useNavigation();


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFF" }}>
      <View style={{ padding: 30 }}>{/* Header */}
        <Image source={require('../../../assets/e-reserva.png')} />
      </View>

      <View>{/* Center */}
        <Text style={styles.textBody}>
          Reserve Recursos da UEG de seu Conforto
        </Text>

        <View style={styles.divider}>
          <Button

            title="Acessar"
            onPress={() => {
              if (user && user.id && user.id > 0) {
                navigation.navigate('Main')
              } else {
                navigation.navigate('Login')
              }
            }}
          />
        </View>
      </View>

      {/* Footer */}
      {/* <View style={{ alignItems: 'center' }}>
        <Text style={styles.textFooter}>Desenvolvido por</Text>
        <Image style={{ margin: 10 }} source={require('../../../assets/boost_ti.png')} />
      </View> */}
    </View>
  );
}