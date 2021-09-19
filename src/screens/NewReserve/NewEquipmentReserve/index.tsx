import React, { useEffect, useState } from 'react';
import { Alert, Text, View, LogBox, SafeAreaView, ScrollView, TextInput, StyleSheet, Modal, Pressable } from 'react-native';
// import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker'
import DateTimePicker from '@react-native-community/datetimepicker';

import EquipmentTouchable from '../../../components/EquipmentTouchable/index';

import { startHourArray } from '../../../constants/hourArrays';
import { split } from 'lodash';



interface Equipment {
  id: number
  name: string
  description: string
}

interface IarrayHour {
  hour: number,
  minute: number
}


export default function NewEquipmentReserve() {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [hour, setHour] = useState({});
  const [equipments, setEquipments] = useState([]);
  const [show, setShow] = useState(false);
  const [hoursSelectVisible, setHoursSelectVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [equipmentModal, setEquipmentModal] = useState({});

  const fetchEquipments = async (data) => {

    try {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          date: data.date,
          hour: data.hour,
          minute: data.minute
        }
      };

      const response = await api.get('/reserves/equipments/available', config);
      setEquipments(response.data);

    } catch (err) {
      Alert.alert('Falha ao carregar equipamentos!')
      console.log(err)
    }
  }

  const onChange = (event, selectedDate) => {
    setHoursSelectVisible(true);

    if (event.type !== "dismissed") {
      setDate(selectedDate.getTime());
    }

    setShow(false);
  };

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

  const loadEquipment = (time: IarrayHour) => {

    const hourMinute = time.split(':');

    setHour(time);

    const data = {
      date,
      hour: hourMinute[0], //posição 0 encontra-se a hora
      minute: hourMinute[1] //posição 1 encontra-se os minutos 
    }

    fetchEquipments(data)
    setHoursSelectVisible(false);
  };

  const ShowModal = (item) => {
    setModalVisible(true);
    setEquipmentModal(item);
  };

  const createReserve = async (equipment) => {
    try {
      const token = await AsyncStorage.getItem('@EReserva:token');
      const formattedDate = new Date(date);
      
      formattedDate.setHours(hour.split(':')[0])
      formattedDate.setMinutes(hour.split(':')[1])

      const equip = {
        equipment_id: equipment.id,
        starts_at: formattedDate,
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await api.post('/reserves/equipments', equip, config);
      console.log(response.data)
      if (response.data.status === 'accepted') {
        Alert.alert('Reserva Confirmada!');
        setModalVisible(!modalVisible);
        navigation.push("Home");
      }

    } catch (err) {
      Alert.alert('Falha ao realizar Reserva!')
      setModalVisible(!modalVisible);

      // console.log(err)
    }
  }


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
            <Text style={styles.modalText}>Equipamento:{equipmentModal.name ? equipmentModal.name : ''}</Text>
            <Text style={styles.modalText}>Descrição:{equipmentModal.description ? equipmentModal.description : ''}</Text>
            <Text style={styles.modalText}>Horário da Reserva: {hour}</Text>
            <Text style={styles.modalText}>Data da Reserva: {date.getFullYear}</Text>

            <View style={styles.buttonModal}>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => { createReserve(equipmentModal) }}
              >
                <Text style={styles.textStyle}>Confirmar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => { setModalVisible(!modalVisible) }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ padding: 20, margin: 10 }}>
        <View>
          <Button onPress={showDatepicker} title="Selecione a data" />
        </View>

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

        <View style={styles.divider}></View>

        {hoursSelectVisible ? (
          <>
            <Text style={styles.textInput}>Horário</Text>
            <Picker
              selectedValue={hour}
              onValueChange={(item, index) => { loadEquipment(item) }}>
              <Picker.Item label="Selecione um Horário" value={''} />
              {startHourArray.map((hour: IarrayHour) => {
                return <Picker.Item key={hour.hour} label={`${hour.hour}:${hour.minute}`} value={`${hour.hour}:${hour.minute}`} />
              })}
            </Picker>
    
            <View style={styles.divider}></View>
          </>
        ) : null}

        {equipments.length !== 0 ?
          <View>
            <Text style={styles.textInput}>Equipamentos disponíveis:</Text>
            <FlatList
              data={equipments}
              renderItem={({ item, index, separators }) => (
                <View style={{ padding: 20, margin: 10 }}>
                  {/* onPress={() => { }} */}
                  <EquipmentTouchable reserve={item} onPress={() => { ShowModal(item) }} />
                </View>
              )}
            />
          </View>
          :
          null}


      </View>
    </View >
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
    marginTop: 22
  },
  modalView: {
    alignItems: "flex-start",
    margin: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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