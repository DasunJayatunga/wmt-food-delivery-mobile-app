import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const DeliveryTrackingScreen = ({ route }) => {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch delivery data
  const fetchDelivery = async () => {
    try {
      const res = await api.get(`/delivery/${deliveryId}`);
      setDelivery(res.data);
    } catch (err) {
      Alert.alert('Error', 'Could not load delivery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
    // Poll every 10 seconds to simulate real-time tracking
    const interval = setInterval(fetchDelivery, 10000);
    return () => clearInterval(interval);
  }, []);

  // Pick an image and upload as proof of delivery
  const pickAndUploadProof = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const formData = new FormData();
      formData.append('proof', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'proof.jpg',
      });

      try {
        const res = await api.put(`/delivery/${deliveryId}/proof`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setDelivery(res.data);
        Alert.alert('Success', 'Proof uploaded! Delivery marked as delivered.');
      } catch (err) {
        Alert.alert('Upload failed', 'Something went wrong');
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!delivery) {
    return <Text>Delivery not found</Text>;
  }

  // Convert MongoDB coordinates [lng, lat] to map {latitude, longitude}
  const driverLocation = delivery.currentLocation?.coordinates
    ? {
        latitude: delivery.currentLocation.coordinates[1],
        longitude: delivery.currentLocation.coordinates[0],
      }
    : null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={
          driverLocation
            ? { ...driverLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 }
            : { latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01 }
        }
      >
        {driverLocation && (
          <Marker coordinate={driverLocation} title="Driver" pinColor="blue" />
        )}
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.status}>Status: {delivery.status}</Text>
        <Text>ETA: {delivery.estimatedTime || 'Calculating...'}</Text>
        {delivery.proofImage && (
          <Image
            source={{ uri: `http://10.0.2.2:5000/${delivery.proofImage}` }}
            style={styles.proofImage}
          />
        )}
        <Button title="Upload Proof of Delivery" onPress={pickAndUploadProof} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  infoCard: { padding: 16, backgroundColor: 'white' },
  status: { fontSize: 18, fontWeight: 'bold' },
  proofImage: { width: 100, height: 100, marginVertical: 8 },
});

export default DeliveryTrackingScreen;
