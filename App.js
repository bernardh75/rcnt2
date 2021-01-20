import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import ReloadIcon from './components/ReloadIcon'
import WeatherDetails from './components/WeatherDetails'
import {colors} from './utils/index'

const WEATHER_API_KEY = 'eaa50bc45fece77ede5db9caf30e6690';
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?';

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitsSystem, setUnitsSystem] = useState('metric') //in celius instead of kelvin

  useEffect(() =>{
    load()
  }, [unitsSystem])

  async function load() {
    setCurrentWeather(null)
    setErrorMessage(null)
    try {
      let {status} = await Location.requestPermissionsAsync()
      //console.log(status)
      if (status !== 'granted') {
        setErrorMessage('Access to location is needed to run the app')
        return
      }

      const location = await Location.getCurrentPositionAsync()
      
      const {latitude, longitude} = location.coords

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`

      const response = await fetch(weatherUrl)

      const result = await response.json()

      if (response.ok) {
        setCurrentWeather(result)
      } else {
        setErrorMessage(result.message)
      }
      //alert(`Location : ${location}, Latitude : ${latitude}, Longitude : ${longitude}`)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }
  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <Text><h2>PURE AIR + By Ecoxygen</h2></Text>
          <Image source={require('./assets/pureairhomepng.png')}/>
          <Text><b>Welcome to our main page to control your device</b></Text>
          <Text>Current Weather by your location in Celsius</Text>
          <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem}/>
          <ReloadIcon load={load}/>
          <WeatherInfo currentWeather={currentWeather} />  
        </View>
        <WeatherDetails currentWeather={currentWeather} unitsSystem={unitsSystem}/>
      </View>
    )
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text><h2>PURE AIR + By Ecoxygen</h2></Text>
        <Image source={require('./assets/pureairhomepng.png')}/>
        <Text>Welcome to our main page to control your device</Text>
        <Text>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Text><h2>PURE AIR + By Ecoxygen</h2></Text>
        <Image source={require('./assets/pureairhomepng.png')}/>
        <Text>Welcome to our main page to control your device</Text>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR}/>
        <StatusBar style="auto" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#cceeff',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#cceeff',
  }
});
