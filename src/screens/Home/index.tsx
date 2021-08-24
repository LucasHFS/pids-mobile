import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import api from '../../services/api';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';


interface LoggedUser {
  id: number
  cpf: string
  name: string
  email: string
  phone: string
  bond: string
  course: string
}

export default function Home() {

  const [myReserves, setMyReserves] = useState([]);
  const { signIn } = useAuth();
  
  useEffect(() => {
    const fetchBonds = async () => {
      try {
        const token = await AsyncStorage.getItem('@EReserva:token');
    
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await api.get('reserves', config);
        setMyReserves(response.data);
      } catch (err) {
        Alert.alert('Falha ao Carregar Reservas')
        console.log(err)
      }
    }

    fetchBonds();
  }, []);

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20, margin: 10 }}>
        <Button
          title="Nova Reserva"
          onPress={() => navigation.navigate('NewReserve')}
        />
      </View>

      <View style={{ padding: 20, margin: 10 }}>

        <Text>Minhas Reservas de Equipamento</Text>
        <FlatList
          data={myReserves.equipmentsReserves}
          renderItem={({ item, index, separators }) => (
            <TouchableHighlight
              key={item.id}
              onPress={() => {}}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{ backgroundColor: 'white' }}>
                <Text>Status: {item.status}</Text>
                <Text>{item.equipment.name}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>

      <View style={{ padding: 20, margin: 10 }}>
        <Text>Minhas Reservas de Equipamento</Text>
        <FlatList
          data={myReserves.roomsReserves}
          renderItem={({ item, index, separators }) => (
            <TouchableHighlight
              key={item.id}
              onPress={() => {}}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{ backgroundColor: 'white' }}>
                <Text>Status: {item.status}</Text>
                <Text>{item.room.name}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>


      <View style={{ padding: 20, margin: 10 }}>
        <Text>Minhas Reservas de Equipamento</Text>
        <FlatList
          data={myReserves.sportCourtReserves}
          renderItem={({ item, index, separators }) => (
            <TouchableHighlight
              key={item.id}
              onPress={() => {}}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{ backgroundColor: 'white' }}>
                <Text>Status: {item.status}</Text>
                <Text>{item.sportCourt.name}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
    </View>
  );
}