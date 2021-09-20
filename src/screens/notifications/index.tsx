import React, { useEffect, useState } from 'react';
import { Alert, Text, View, StyleSheet, Modal } from 'react-native';
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
import { format } from 'date-fns';


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
export default function Notifications() {

  const [myNotifications, setMyNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('@EReserva:token');

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await api.get('messages', config);
        setMyNotifications(response.data);
      } catch (err) {
        Alert.alert('Falha ao Carregar Mensagens')
        console.log(err)
      }
    }

    fetchNotifications();
  }, []);

  const formatNotificationDate = (dirtyDate: string) => {
    const date = new Date(dirtyDate);
    return `${ format(date, 'H:mm') } hrs de ${format(date, 'd/M/yyyy')}`
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10, margin: 5 }}>
        <View style={{padding:20}}/>
        <Text style={styles.textInputH1}>Minhas Notificações:</Text>
        <FlatList
          data={myNotifications}
          renderItem={({ item, index, separators }) => (
            <View style={{ padding: 8, margin: 2 }}>
              {
                <TouchableHighlight
                  key={item.id}
                  onPress={() => {}}
                  >
                  <View style={styles.container}>
                    <Text style={styles.textInput1}>Horário: <Text style={styles.textInput2}> {item ? formatNotificationDate(item.created_at) : null }</Text></Text>
                    <Text style={styles.textInput1}>Mensagem:<Text style={styles.textInput2}> {item.body || ''}</Text></Text>
                  </View>
                </TouchableHighlight>
              }
            </View>
          )}
        />
      </View>

    </View>
  );


}

const styles = StyleSheet.create({
  textInputH1: {
    paddingLeft: 13,
    fontWeight: 'bold',
    fontSize: 15
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#87BDFA',
  },
  textInput1: {
    fontWeight: 'bold',
    fontSize: 15
  },
  textInput2: {
    fontWeight: 'normal',
    fontSize: 15
  },
  textInput3: {
    fontWeight: 'normal',
    fontSize: 12
  },
});