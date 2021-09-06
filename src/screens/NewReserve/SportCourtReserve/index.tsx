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

import SportCourtTouchable from '../../../components/SportCourtTouchable/index';

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


export default function SportCourtReserve() {
  const navigation = useNavigation();


  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [hour, setHour] = useState({});
  const [sportCourts, setSportCourts] = useState([]);
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sportCourtModal, setSportCourtModal] = useState({});


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

    if (event.type !== "dismissed") {
      setDate(selectedDate.getTime());

    }
    setShow(false);

    // setShow(Platform.OS === 'ios');
    // if (selectedDate != undefined) {
    //   setDate(selectedDate.getTime());
    // }
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

    // const data = {
    //   date,
    //   hour: hourMinute[0], //posição 0 encontra-se a hora
    //   minute: hourMinute[1] //posição 1 encontra-se os minutos 
    // }

    // fetchEquipments(data)

  };

  useEffect(() => {
    async function fetchSportCourts(): Promise<void> {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await api.get('/sportcourts', config);
      setSportCourts(response.data);

    }
    fetchSportCourts();
  }, [])


  const ShowModal = (item) => {
    setModalVisible(true);
    setSportCourtModal(item);
  };

  const createReserve = async (equipment) => {


    try {
      const token = await AsyncStorage.getItem('@EReserva:token');
      const equip = {
        equipment_id: equipment.id,
        starts_at: date,
      }



      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await api.post('/reserves/equipments', equip, config);
      console.log(response.data)
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


  return (
    <View style={{ flex: 1 }}>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >




        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Equipamento:{sportCourtModal.name ? sportCourtModal.name : ''}</Text>
            <Text style={styles.modalText}>Descrição:{sportCourtModal.description ? sportCourtModal.description : ''}</Text>
            {/* <Text style={styles.modalText}>Horário da Reserva: {hour}</Text> 
             <Text style={styles.modalText}>Data da Reserva: {date.getFullYear}</Text> 
            <Text style={styles.modalText}>Data da Reserva</Text> */}


            <View style={styles.buttonModal}>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => { createReserve(equipmentModal) }}
              >
                <Text style={styles.textStyle}>Selecionar</Text>
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


      {sportCourts.length !== 0 ?

        <View style={styles.containerCenter}>
          <Text style={styles.textInput}>Listagem de quadras esportivas:</Text>
          <FlatList
            data={sportCourts}
            renderItem={({ item, index, separators }) => (
              <View style={{ padding: 20, margin: 10 }}>
                {/* onPress={() => { }} */}
                <SportCourtTouchable reserve={item} onPress={() => { ShowModal(item) }} />
              </View>
            )}
          />
        </View>
        :
        null}



      {console.log(sportCourtModal)}

      {sportCourtModal !== undefined ?
        <View style={{ padding: 20, margin: 10 }}>
          <View>
            <Button onPress={showDatepicker} title="Selecione a data" />
          </View>
        </View>
        :
        null
      }

      {/* <Text style={styles.textInput}>Horário</Text>
        <Picker
          selectedValue={hour}
          onValueChange={(item, index) => { loadEquipment(item) }}>
          <Picker.Item label="Selecione um Horário" value={''} />
          {startHourArray.map((hour: IarrayHour) => {
            return <Picker.Item key={hour.hour} label={`${hour.hour}:${hour.minute}`} value={`${hour.hour}:${hour.minute}`} />
          })}
        </Picker> */}

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
    marginLeft: 15,
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