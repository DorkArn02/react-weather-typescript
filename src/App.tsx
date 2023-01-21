import { Box, Flex, Grid, Heading, HStack, Image, Input, InputGroup, InputLeftElement, Select, Spacer, StackDivider, Text, VStack } from "@chakra-ui/react"
import Bck from "./assets/background.jpg"
import ClearBck from "./assets/clear.webp"
import CloudyBck from "./assets/cloudy.jpg"
import MistBck from "./assets/mist.jpg"
import RainBck from "./assets/rain.jpg"
import SnowBck from "./assets/snow.jpg"
import ThunderBck from "./assets/thunder.jpg"

import axios from "axios"
import React, { useState } from "react"
import { FaSearch, FaWind } from "react-icons/fa"
import { IoWaterOutline } from "react-icons/io5"
import { MdCompress } from "react-icons/md"
import { TbTemperature, TbTemperatureMinus, TbTemperaturePlus } from "react-icons/tb"
import { GeolocationInterface, WeatherData } from "./interfaces"

function App() {

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
  const [city, setCity] = useState<string>("")
  const [results, setResults] = useState<Array<{ label: string, value: { lat: number, lon: number } }>>()
  const [weather, setWeather] = useState<WeatherData>()
  const [metric, setMetric] = useState<boolean>(true)

  const getGeolocation = async (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (city.length === 0) {
      return;
    }
    setResults([])
    if (e.key === "Enter") {
      const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=${API_KEY}`)
      const data = response.data as Array<GeolocationInterface>
      data.map(i => {
        setResults(prev => [...(prev || []), { label: `${i.name}, ${i.country}`, value: { lat: i.lat, lon: i.lon } }])
      })
    }
  }

  const handleClick = async (lat: number, lon: number) => {
    setResults([])
    const measure = metric ? "metric" : "imperial"
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${measure}&appid=${API_KEY}`)
    const data = response.data as WeatherData
    setWeather(data)
  }

  const getBackgroundImage = () => {
    if (weather === undefined) {
      return Bck
    }
    if (weather.weather[0].description.toLowerCase().includes("snow")) {
      return SnowBck
    } else if (weather.weather[0].description.toLowerCase().includes("cloud")) {
      return CloudyBck
    } else if (weather.weather[0].description.toLowerCase().includes("clear")) {
      return ClearBck
    } else if (weather.weather[0].description.toLowerCase().includes("rain")) {
      return RainBck
    } else if (weather.weather[0].description.toLowerCase().includes("thunderstorm")) {
      return ThunderBck
    } else if (weather.weather[0].description.toLowerCase().includes("mist")) {
      return MistBck
    }
  }

  const handleMetric = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWeather(undefined)
    setMetric(e.target.value === "true" ? true : false)
  }

  return (
    <Flex justify={"center"} backgroundSize={"cover"} backgroundPosition={"center"} w={"100%"} minH={"100vh"} backgroundImage={getBackgroundImage() || Bck}>
      <Flex p={2} gap={5} w={["90%", "50%"]} textAlign={"center"} flexDir={"column"}>
        <Heading textShadow={" 4px 4px 8px rgba(66, 68, 90, 1)"} size={["lg", "xl"]} fontWeight={"bold"}>React weather application</Heading>
        <InputGroup flexDir={"column"}>
          <InputGroup>
            <InputLeftElement children={<FaSearch />} />
            <Input onChange={(e) => setCity(e.target.value)} onKeyDown={getGeolocation} backgroundColor={"rgba(51, 51, 51, 0.7)"} placeholder={"City name..."} />
            <Select onChange={handleMetric} backgroundColor={"rgba(51, 51, 51, 0.7)"} w={["80%", "55%", "25%"]}>
              <option value={"true"}>&deg;C</option>
              <option value={"false"}>&deg;F</option>
            </Select>
          </InputGroup>
          {results && results.length !== 0 ?
            <VStack boxShadow={"lg"} p={2} maxH={"40vh"} overflowY={"auto"} gap={0} mt={3} divider={<StackDivider />} backgroundColor={"rgba(51, 51, 51, 1)"}>
              {results.map((item, k) => {
                return <Box key={k} onClick={() => handleClick(item.value.lat, item.value.lon)} _hover={{ bgColor: "rgb(81, 81, 81)", cursor: "pointer" }} w={"100%"}>
                  <Text>{item.label}</Text>
                </Box>
              })
              }
            </VStack> : ""}
        </InputGroup>
        {weather !== undefined ?
          <>
            <HStack p={2} bgColor="rgba(51, 51, 51, 0.7)">
              <VStack p={2}>
                <Text fontSize={"xl"}>{weather?.name}, {weather?.sys.country}</Text>
                <Image src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}></Image>
                <Text fontSize={"md"}>{weather?.weather[0].description}</Text>
              </VStack>
              <Spacer />
              <Heading fontWeight={"medium"} size={"xl"}>{weather?.main.temp} {metric ? <>&deg;C</> : <>&deg;F</>}</Heading>
            </HStack>
            <Grid templateColumns='repeat(2, 1fr)' gap={3}>
              <VStack p={2} bgColor="rgba(51, 51, 51, 0.7)" justify={"center"}>
                <HStack>
                  <TbTemperatureMinus />
                  <Text>Min</Text>
                </HStack>
                <Heading fontWeight={"medium"} size="md">{weather?.main.temp_min} {metric ? <>&deg;C</> : <>&deg;F</>}</Heading>
              </VStack>
              <VStack p={2} bgColor="rgba(51, 51, 51, 0.7)" justify={"center"}>
                <HStack>
                  <TbTemperaturePlus />
                  <Text>Max</Text>
                </HStack>
                <Heading fontWeight={"medium"} size="md">{weather?.main.temp_max} {metric ? <>&deg;C</> : <>&deg;F</>}</Heading>
              </VStack>
              <VStack p={2} bgColor="rgba(51, 51, 51, 0.7)" justify={"center"}>
                <HStack>
                  <TbTemperature />
                  <Text>Feels like</Text>
                </HStack>
                <Heading fontWeight={"medium"} size="md">{weather?.main.feels_like} {metric ? <>&deg;C</> : <>&deg;F</>}</Heading>
              </VStack>
              <VStack p={2} bgColor="rgba(51, 51, 51, 0.7)" justify={"center"}>
                <HStack>
                  <MdCompress />
                  <Text>Pressure</Text>
                </HStack>
                <Heading fontWeight={"medium"} size="md">{weather?.main.pressure} hPa</Heading>
              </VStack>
              <VStack p={2} bgColor="rgba(51, 51, 51, 0.7)" justify={"center"}>
                <HStack>
                  <IoWaterOutline />
                  <Text>Humidity</Text>
                </HStack>
                <Heading fontWeight={"medium"} size="md">{weather?.main.humidity} %</Heading>
              </VStack>
              <VStack p={2} bgColor="rgba(51, 51, 51, 0.7)" justify={"center"}>
                <HStack>
                  <FaWind />
                  <Text>Wind speed</Text>
                </HStack>
                <Heading fontWeight={"medium"} size="md">{weather?.wind.speed} m/s</Heading>
              </VStack>
            </Grid>
          </>
          : ""}
      </Flex>
    </Flex>
  )
}

export default App
