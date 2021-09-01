import React, { useEffect, useState } from 'react';
import { Alert, Text, View, LogBox, SafeAreaView, ScrollView, TextInput, StyleSheet } from 'react-native';
// import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker'
import DateTimePicker from '@react-native-community/datetimepicker';

import EquipmentReserveTouchable from '../../../components/EquipmentReserveTouchable';

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
  const [equipments, setEquipments] = useState([{}]);
  const [show, setShow] = useState(false);

  const fetchEquipments = async (data) => {

    console.log(data)
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
      console.log(response.data);
    } catch (err) {
      Alert.alert('Falha ao carregar equipamentos!')
      // console.log(err)
    }
  }

  const onChange = (event, selectedDate) => {
    // setHour({});

    setDate(selectedDate.getTime());
    // 

    // const data = currentDate.toString();

    // const arrayDate = data.split(" ");

    // console.log(arrayDate);

    // const day = arrayDate[2];
    // const year = arrayDate[3];

    // console.log(day);
    // console.log(year);


    // data.split("-");
    // console.log(data[]);

    // console.log(currentDate),

    setShow(Platform.OS === 'ios');
    if (selectedDate != undefined) {
      setDate(selectedDate.getTime());
    }
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

  };

  useEffect(() => {
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20, margin: 10 }}>
        <View>
          <Button onPress={showDatepicker} title="Selecione a data" />
        </View>
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

        <Text style={styles.textInput}>Horário</Text>
        <Picker
          selectedValue={hour}
          onValueChange={(item, index) => { loadEquipment(item) }}>
          <Picker.Item label="Selecione um Horário" value={''} />
          {startHourArray.map((hour: IarrayHour) => {
            return <Picker.Item key={hour.hour} label={`${hour.hour}:${hour.minute}`} value={`${hour.hour}:${hour.minute}`} />
          })}
        </Picker>


        {equipments.length != 0 ?

          <View style={{ padding: 20, margin: 10 }}>
            <Text>Equipamentos:</Text>
            <FlatList
              data={equipments}
              renderItem={({ item, index, separators }) => (
                <View style={{ padding: 20, margin: 10 }}>
                  {/* onPress={() => { }} */}
                  <EquipmentReserveTouchable reserve={item} />
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
    padding: 20
  },
});