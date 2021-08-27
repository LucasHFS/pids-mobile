import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
// import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';

import DateTimePicker from '@react-native-community/datetimepicker';


interface Equipment {
  id: number
  name: string
  description: string
}

export default function NewEquipmentReserve() {
  const navigation = useNavigation();


  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate),
      setShow(Platform.OS === 'ios');
    if (currentDate != undefined) {
      setDate(currentDate);
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

  useEffect(() => {
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
      </View>
    </View >
  );
}