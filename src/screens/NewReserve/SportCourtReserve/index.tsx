import React, { useEffect, useState } from 'react';
import { Alert, Text, View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { FlatList } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker'
import DateTimePicker from '@react-native-community/datetimepicker';

import SportCourtTouchable from '../../../components/SportCourtTouchable/index';

interface IarrayHour {
  hour: number,
  minute: number,
  available: boolean
}

export default function SportCourtReserve() {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [hour, setHour] = useState({});
  const [hours, setHours] = useState([]);
  const [sportCourts, setSportCourts] = useState([]);
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sportCourtModal, setSportCourtModal] = useState({});

  const onChange = (event, selectedDate) => {
    setHour({});
    if (event.type === "set") {
      setDate(selectedDate); //confirmar, seta a data no state
      fetcDayAvailability(selectedDate.getTime()); //confirmar, seta a data no state
    }

    if (event.type === "dimissed") { //cancelar do datepicker
      setSportCourtModal({});
    }

    setShow(false);
  };

  const fetcDayAvailability = async (data) => {
    try {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          date: data,
          sport_court_id: sportCourtModal.id,
        }
      };

      const response = await api.get('/reserves/sportcourts/day-availability', config);
      setHours(response.data);
    } catch (err) {
      Alert.alert('Falha ao carregar quadras!')
      console.log(err)
    }
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const loadSportCourt = (time: IarrayHour) => {
    const hourMinute = time.split(':');

    setHour(time);

    date.setHours(hourMinute[0]);
    date.setMinutes(hourMinute[1]);

    sendReserveSportCourt(date.getTime());
  };

  const sendReserveSportCourt = async (data) => {
    try {
      const token = await AsyncStorage.getItem('@EReserva:token');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const obj = {
        sport_court_id: sportCourtModal.id,
        starts_at: data,
      }

      const response = await api.post('/reserves/sportcourts', obj, config);
      if (response.data.status === "accepted") {
        Alert.alert("Reserva da quadra solicitada!");
        navigation.push('Home')
      }

    } catch (err) {
      Alert.alert('Falha ao reservar quadra!')
      console.log(err)
    }
  }

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

  const selectSportCourt = () => {
    setModalVisible(!modalVisible);
    setSportCourtModal(sportCourtModal);
    showDatepicker();
  };

  const cancelSelectSportCourt = () => {
    setSportCourtModal({});
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
            <Text style={styles.textInput2}>Equipamento: <Text style={styles.textInput3}>{sportCourtModal.name ? sportCourtModal.name : ''}</Text></Text>
            <Text style={styles.textInput2}>Descrição: <Text style={styles.textInput3}>{sportCourtModal.description ? sportCourtModal.description : ''}</Text></Text>
            <View style={styles.divider} />

            <View style={styles.buttonModal}>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => { selectSportCourt() }}
              >
                <Text style={styles.textStyle}>Selecionar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => { cancelSelectSportCourt() }}
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

      {sportCourts.length > 0 ?
        <>
          <View style={styles.divider} />
          <View style={styles.divider} />

          <Text style={styles.textInput}>Listagem de quadras esportivas:</Text>

          <View style={styles.containerCenter}>
            <FlatList
              data={sportCourts}
              renderItem={({ item, index, separators }) => (
                <View style={{ padding: 10, margin: 1 }}>
                  <SportCourtTouchable reserve={item} onPress={() => { ShowModal(item) }} />
                </View>
              )}
            />
          </View>
        </>
        :
        null}

      {hours.length > 0 ? (
        <View style={{ paddingLeft: 20 }}>
          <Text style={styles.textInput}>Horário:</Text>
          <Picker
            selectedValue={hour}
            onValueChange={(item, index) => { loadSportCourt(item) }}
          >
            <Picker.Item label="Selecione um Horário" value={''} />
            {
              hours.length > 0 ? hours.map((hour: IarrayHour) => {
                return hour.available ? (<Picker.Item key={hour.hour} label={`${hour.hour}:${hour.minute}`} value={`${hour.hour}:${hour.minute}`} />) : null
              }) : null
            }
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
    marginLeft: 18,
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
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
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
  },
  textInput2: {
    fontWeight: 'bold',
    fontSize: 15
  },
  textInput3: {
    fontWeight: 'normal',
    fontSize: 15
  },
});