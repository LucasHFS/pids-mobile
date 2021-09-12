import React, { useEffect, useState } from 'react';
import { Alert, Text, View, StyleSheet, Modal, Pressable } from 'react-native';
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
import { differenceInDays } from 'date-fns/esm';

export default function Home() {

  const [myReserves, setMyReserves] = useState([]);

  const fetchReserves = async () => {
    try {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await api.get('my_reserves', config);
      setMyReserves(response.data);
    } catch (err) {
      Alert.alert('Falha ao Carregar Reservas')
      console.log(err)
    }
  }

  useEffect(() => {
    fetchReserves();
  }, []);

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalReserve, setModalReserve] = useState({});

  const ShowModal = (item) => {
    setModalVisible(true);
    setModalReserve(item);
  };

  const cancelSelectReserve = () => {
    setModalReserve({});
    setModalVisible(!modalVisible);
  };

  const canCancelReserve = (starts_at: string) => {
    const date = new Date(starts_at)
    return differenceInDays(date, new Date()) >= 3
  }

  const cancelReserve = async () => {
    try {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      console.log(modalReserve.id)
      await api.delete(`/reserves/${modalReserve.id}`, config);
      cancelSelectReserve()
      Alert.alert('Reserva Cancelada')
      await fetchReserves()
    } catch (err) {
      Alert.alert('Falha ao Cancelar Reservas')
      console.log(err)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.divider} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          {
            modalReserve.equipment ? <EquipmentReserveTouchable reserve={modalReserve} onPress={() => {}} /> :
            modalReserve.room ? <RoomReserveTouchable reserve={modalReserve} onPress={() => {}} /> :
            modalReserve.sport_court ? <SportCourtReserveTouchable reserve={modalReserve} onPress={() => {}} /> : null
          }

            <View style={styles.buttonModal}>
              { canCancelReserve(modalReserve.starts_at) ?
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={() => { cancelReserve() }}
                >
                  <Text style={styles.textStyle}>Cancelar Reserva</Text>
                </Pressable>
                : null
              }
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => { cancelSelectReserve() }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>

      </Modal>


      <View style={{ padding: 10, margin: 10 }}>
        <Button
          title="Nova Reserva"
          onPress={() => { navigation.navigate('NewReserve') }}
        />
      </View>

      <View style={{ padding: 10, margin: 5 }}>
        <Text style={styles.textInputH1}>Minhas Reservas:</Text>
        <FlatList
          data={myReserves}
          renderItem={({ item, index, separators }) => (
            <View style={{ padding: 8, margin: 2 }}>
              {
                item.equipment ? <EquipmentReserveTouchable reserve={item} onPress={() => { ShowModal(item) }} /> :
                  item.room ? <RoomReserveTouchable reserve={item} onPress={() => { ShowModal(item) }} /> :
                    item.sport_court ? <SportCourtReserveTouchable reserve={item} onPress={() => { ShowModal(item) }} /> : null
              }
            </View>
          )}
        />
        <View style={styles.divider} />

      </View>
    </View>

  );

}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    justifyContent: 'space-between',
  },
  containerCenter: {
    padding: 10,
    justifyContent: 'space-between',
  },
  textInput: {
    marginTop: 15,
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 17
  },
  divider: {
    padding: 10
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonConfirm: {
    backgroundColor: "#87BDFA",
  },
  buttonClose: {
    backgroundColor: "#FF9391",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  textInputH1: {
    paddingLeft: 13,
    fontWeight: 'bold',
    fontSize: 15
  },
  textInputH2: {
    fontWeight: 'bold',
    fontSize: 12
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    justifyContent: 'flex-start',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonModal: {
    flexDirection: 'row',
  }
});