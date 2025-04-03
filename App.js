import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SurahListScreen from './screens/SurahListScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import LastReadListScreen from './screens/LastReadListScreen';
import BookmarkListScreen from './screens/BookmarkListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MyQuranApp' }} />
        <Stack.Screen name="SurahList" component={SurahListScreen} options={{ title: 'Daftar Surah' }} />
        <Stack.Screen name="SurahDetail" component={SurahDetailScreen} options={{ title: 'Detail Surah' }} />
        <Stack.Screen name="LastReadList" component={LastReadListScreen} options={{ title: 'List Terakhir dibaca' }}/>
        <Stack.Screen name="BookmarkList" component={BookmarkListScreen} options={{ title: 'Bookmark Ayat Penting' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
