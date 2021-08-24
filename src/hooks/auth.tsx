import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage'
import { useEffect } from 'react';
import { Alert } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  roleId: string;
  bondId: string;
}

interface AuthState {
  token: string;
  // user: Record<string, unknown>; // object
  user: User;
}

interface SingInCredentials {
  cpf: string;
  password: string;
}

interface AuthContextData {
  // user: Record<string, unknown>;
  user: User;
  signIn(credentials: SingInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
// variável inicialmente com valor vazio -> forçando {} as AuthContext
// para remover o erro do Typescript

// Outra forma de fazer, mas que poderia dar erros a frente
// const authContext = createContext<AuthContext | null>(null);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@EReserva:token',
        '@EReserva:user',
      ]);

      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) })
      }
    }
    loadStoragedData();
  }, [])

  const signIn = useCallback(async ({ cpf, password }) => {
    const response = await api.post('sessions', {
      cpf,
      password,
    });

    console.log(response.data); 
    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@EReserva:token', token],
      ['@EReserva:user', JSON.stringify(user)]
    ]);
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@EReserva:token',
      '@EReserva:user']);

    setData({} as AuthState);
    Alert.alert('Logout Realizado com sucesso!');
  }, []);

  // Partial serve para receber algumas das informações contidas numa interface
  // const updateUser = useCallback((updatedData: Partial<User>) => {

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@EReserva:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [ setData, data.token ],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };