import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import api from '../../services/api';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import SportCourtReserveTouchable from '../../components/SportCourtReserveTouchable';
import RoomReserveTouchable from '../../components/RoomReserveTouchable';
import EquipmentReserveTouchable from '../../components/EquipmentReserveTouchable';


interface LoggedUser {
  id: number
  cpf: string
  name: string
  email: string
  phone: string
  bond: string
  course: string
}

// TODO: estilizar o componente
export default function Home() {

  const [myReserves, setMyReserves] = useState([]);
  const { signIn } = useAuth();
  
  useEffect(() => {
    const fetchReserves = async () => {
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

    fetchReserves();
  }, []);

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20, margin: 10 }}>
        {/* TODO: adicionar um modal para selecionar o tipo da reserva, por enquanto vou usar o de equipamento pra teste */}
        <Button
          title="Nova Reserva"
          onPress={() => { navigation.navigate('NewEquipmentReserve') } }
        />
      </View>
      
      <View style={{ padding: 20, margin: 10 }}>
        <Text>Minhas Reservas</Text>
        <FlatList
          data={myReserves}
          renderItem={({ item, index, separators }) => (
            <View style={{ padding: 20, margin: 10 }}>
              { 
                item.equipment ? <EquipmentReserveTouchable reserve={item} onPress={() => {} } /> : 
                  item.room ? <RoomReserveTouchable reserve={item}  onPress={() => {} } /> : 
                    item.sport_court ? <SportCourtReserveTouchable reserve={item}  onPress={() => {} } /> : null
              }
            </View>
          )}
        />
      </View>

    </View>
  );
}