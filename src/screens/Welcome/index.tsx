import React from 'react';
import { Text, View, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {

  const navigation = useNavigation();


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View>{/* Header */}
        <Image source={require('../../../assets/e-reserva.png')}/>
      </View>

      <View>{/* Center */}
        <Text>Reserve Recursos da UEG de seu Conforto</Text>

        <Button
          color="blue"
          title='Acessar'
          onPress={() => navigation.navigate('Login')}
        />
      </View>

      <View>{/* Footer */}
        <Text>Desenvolvido por</Text>
        <Image source={require('../../../assets/boost_ti.png')}/>
      </View>
    </View>
  );
}