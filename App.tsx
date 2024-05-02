import { Button, View } from "react-native";
import { styles } from "./styles";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Car } from "lucide-react-native";

export default function App() {
  const mapRef = useRef<MapView>(null);

  const [locationCurrent, setLocationCurrent] = useState<LocationObject | null>(
    null
  );
  const [locationOrigin, setLocationOrigin] = useState<LocationObject | null>({
    coords: {
      accuracy: 5.006999969482422,
      altitude: 0,
      altitudeAccuracy: 0.5,
      heading: 0,
      latitude: 37.52434,
      longitude: -121.9679017,
      speed: 0,
    },
    mocked: false,
    timestamp: 1714655124943,
  });
  const [locationDestination, setLocationDestination] =
    useState<LocationObject>({
      coords: {
        accuracy: 5.01200008392334,
        altitude: 0,
        altitudeAccuracy: 0.5,
        heading: 0,
        latitude: 37.5317467,
        longitude: -121.958455,
        speed: 0,
      },
      mocked: false,
      timestamp: 1714655148992,
    });

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocationOrigin(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        console.log("response ", response);
        setLocationCurrent(response);
        mapRef.current?.animateCamera({
          // pitch: 70,
          center: response.coords,
        });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {locationOrigin && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: locationOrigin.coords.latitude,
            longitude: locationOrigin.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: locationOrigin.coords.latitude,
              longitude: locationOrigin.coords.longitude,
            }}
          />

          {/* {locationCurrent && (
            <Marker
              coordinate={{
                latitude: locationCurrent.coords.latitude,
                longitude: locationCurrent.coords.longitude,
              }}
            >
              <Car />
            </Marker>
          )} */}

          <Marker
            coordinate={{
              latitude: locationDestination.coords.latitude,
              longitude: locationDestination.coords.longitude,
            }}
          />

          <MapViewDirections
            origin={{
              latitude: locationOrigin.coords.latitude,
              longitude: locationOrigin.coords.longitude,
            }}
            destination={{
              latitude: locationDestination.coords.latitude,
              longitude: locationDestination.coords.longitude,
            }}
            apikey={"AIzaSyCp5jINpT7aMBadxASqV0yRmt3sq4HXRzs"}
            strokeWidth={4}
            strokeColor="#888888"
          />

          {locationCurrent && (
            <MapViewDirections
              origin={{
                latitude: locationCurrent.coords.latitude,
                longitude: locationCurrent.coords.longitude,
              }}
              destination={{
                latitude: locationDestination.coords.latitude,
                longitude: locationDestination.coords.longitude,
              }}
              apikey={"AIzaSyCp5jINpT7aMBadxASqV0yRmt3sq4HXRzs"}
              strokeWidth={4}
              strokeColor="#459BE4"
            />
          )}
        </MapView>
      )}
    </View>
  );
}
