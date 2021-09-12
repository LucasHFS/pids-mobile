import React, { useEffect, useState } from 'react';
import { Alert, Text, View, LogBox, SafeAreaView, ScrollView, TextInput, StyleSheet, Modal, Pressable } from 'react-native';
// import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../services/api';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker'
import DateTimePicker from '@react-native-community/datetimepicker';


import RoomTouchable from '../../../../components/RoomTouchable/index';

import { hourArrayAvailable } from '../../../../constants/hourArraysAvailable';
import { split } from 'lodash';



interface Equipment {
  id: number
  name: string
  description: string
}

interface IarrayHour {
  hour: number,
  minute: number,
  available: boolean
}


export default function NewLabReserve() {
  const navigation = useNavigation();


  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [hour, setHour] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomModal, setRoomModal] = useState({});


  // const fetchSportCourts = async (data) => {

  //   try {
  //     const token = await AsyncStorage.getItem('@EReserva:token');

  //     const config = {
  //       headers: { Authorization: `Bearer ${token}` },
  //       params: {
  //         date: data.date,
  //         hour: data.hour,
  //         minute: data.minute
  //       }
  //     };
  //     const response = await api.get('/reserves/equipments/available', config);
  //     setEquipments(response.data);

  //   } catch (err) {
  //     Alert.alert('Falha ao carregar equipamentos!')
  //     // console.log(err)
  //   }
  // }
  // const fetchEquipments = async (data) => {


  // }

  const onChange = (event, selectedDate) => {
    // setHour({});

    // console.log(event.type)
    if (event.type === "set") {
      setDate(selectedDate); //confirmar, seta a data no state

    }

    if (event.type === "dimissed") { //cancelar do datepicker
      setRoomModal({});
    }


    setShow(false);

    if (event.type === "set") {
      fetcDayAvailability(selectedDate.getTime()); //confirmar, seta a data no state

    }


    //realizar requisição aqui!!!

    // setShow(Platform.OS === 'ios');
    // if (selectedDate != undefined) {
    //   setDate(selectedDate.getTime());
    // }
  };

  const fetcDayAvailability = async (data) => {

    try {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          date: data,
          room_id: roomModal.id,
        }
      };


      const response = await api.get('/reserves/rooms/day-availability', config);
      console.log("day-availability")
      console.log(response.data);
      setHour(response.data);

    } catch (err) {
      Alert.alert('Falha ao carregar salas!')
      // console.log(err)
    }
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const loadRoom = (time: IarrayHour) => {

    const hourMinute = time.split(':');

    setHour(time);


    date.setHours(hourMinute[0]);
    date.setMinutes(hourMinute[1]);


    sendReserveRoom(date.getTime())

  };

  const sendReserveRoom = async (data) => {

    try {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const obj = {
        room_id: roomModal.id,
        starts_at: data,
      }

      const response = await api.post('/reserves/rooms', obj, config);
      if (response.data.status === "accepted") {
        Alert.alert("Reserva da sala solicitada!");
        navigation.navigate("Home");
      }

      if (response.data.status === "pending") {
        Alert.alert("Aguarde a confirmação da reserva!");
        navigation.navigate("Home");
      }

    } catch (err) {
      Alert.alert('Falha ao reservar quadra!');
      // console.log(err)
    }
  }

  useEffect(() => {
    async function fetchSportCourts(): Promise<void> {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await api.get('/rooms', config);

      const result = response.data.filter(room => {
        return room.type === 'lab' || room.type === 'auditorium'
      });

      setRooms(result);

    }
    fetchSportCourts();
  }, [])


  const ShowModal = (item) => {
    setModalVisible(true);
    setRoomModal(item);
  };

  const createReserve = async (room) => {


    try {
      const token = await AsyncStorage.getItem('@EReserva:token');
      const obj = {
        room_id: room.id,
        starts_at: date,
      }



      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await api.post('/reserves/equipments', obj, config);
      // console.log(response.data)
      if (response.data.status === 'accepted') {
        Alert.alert('Reserva Confirmada!');
        setModalVisible(!modalVisible);
      }

    } catch (err) {
      Alert.alert('Falha ao realizar Reserva!')
      setModalVisible(!modalVisible);

      // console.log(err)
    }
  }

  const selectRoom = () => {
    setModalVisible(!modalVisible);
    setRoomModal(roomModal);
    showDatepicker();
  };

  const cancelSelectRoom = () => {
    setRoomModal({});
    setModalVisible(!modalVisible);
  };


  return (
    <View style={{ flex: 1 }}>


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

            <Text style={styles.modalText}>Sala: {roomModal.name ? roomModal.name : ''}</Text>
            <Text style={styles.modalText}>Tipo: {roomModal.type ? roomModal.type : ''}</Text>
            <Text style={styles.modalText}>Descrição:{roomModal.description ? roomModal.description : ''}</Text>
            <Text style={styles.modalText}>Horário da Reserva: {hour}</Text>
            <Text style={styles.modalText}>Data da Reserva: {date.getFullYear}</Text>

            <View style={styles.buttonModal}>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => { selectRoom() }}
              >
                <Text style={styles.textStyle}>Selecionar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => { cancelSelectRoom() }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>

      </Modal>


      {/* 
        <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View> */}

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}


      {rooms.length !== 0 ?

        <View style={styles.containerCenter}>
          <Text style={styles.textInput}>Listagem de salas?</Text>
          <FlatList
            data={rooms}
            renderItem={({ item, index, separators }) => (
              <View style={{ padding: 20, margin: 1 }}>
                {/* onPress={() => { }} */}
                <RoomTouchable reserve={item} onPress={() => { ShowModal(item) }} />
              </View>
            )}
          />
        </View>
        :
        null}



      {/* {console.log(sportCourtModal)} */}

      {/* {sportCourtModal !== "" ?
        <View style={{ padding: 20, margin: 10 }}>
          <View>
            <Button onPress={showDatepicker} title="Selecione a data" />
          </View>
        </View>
        :
        null
      } */}


      {/* {console.log(hour)} */}


      {hourArrayAvailable.length !== 0 ? (
        <View style={{ paddingLeft: 20 }}>
          <Text style={styles.textInput}>Horário: </Text>
          <Picker
            selectedValue={hourArrayAvailable}
            onValueChange={(item, index) => { loadRoom(item) }}
          >
            <Picker.Item label="Selecione um Horário" value={''} />
            {hourArrayAvailable.map((hour: IarrayHour) => {
              return hour.available ? (<Picker.Item key={hour.hour} label={`${hour.hour}:${hour.minute}`} value={`${hour.hour}:${hour.minute}`} />) : null
            })}
          </Picker>
        </View>
      )
        :
        null

      }

      <View style={styles.divider}></View>

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