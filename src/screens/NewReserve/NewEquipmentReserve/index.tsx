import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
// import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';


interface Equipment {
  id: number
  name: string
  description: string
}

export default function NewEquipmentReserve() {
  const navigation = useNavigation();

  useEffect(() => {
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20, margin: 10 }}>
      </View>    
    </View>
  );
}