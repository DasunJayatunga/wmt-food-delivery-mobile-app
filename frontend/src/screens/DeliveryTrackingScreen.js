import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import { Colors, Fonts, Spacing, CommonStyles } from '../utils/styles';

// Ordered list of statuses to be shown in the timeline
const STATUS_STEPS = [
  { key: 'confirmed',         label: 'Order Confirmed' },
  { key: 'preparing',         label: 'Being Prepared' },
  { key: 'sent_to_delivery',  label: 'Sent to Delivery' },
  { key: 'waiting_for_pickup',label: 'Driver Waiting for Pickup' },
  { key: 'on_the_way',        label: 'On the Way' },
  { key: 'delivered',         label: 'Delivered' },
];

const DeliveryTrackingScreen = ({ route }) => {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- Fetch delivery status from backend ----------
  const fetchDelivery = async () => {
    try {
      const res = await api.get(`/delivery/${deliveryId}`);
      setDelivery(res.data);
    } catch (err) {
      console.log('FETCH ERROR:', err);          // add this line
      Alert.alert('Error', 'Could not load delivery status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
    // Poll every 10 seconds to get the latest status
    const interval = setInterval(fetchDelivery, 10000);
    return () => clearInterval(interval);
  }, []);

  // ---------- Current step index ----------
  const currentIndex = delivery
    ? STATUS_STEPS.findIndex(step => step.key === delivery.status)
    : -1;

  // ---------- Upload proof of delivery (only when delivered) ----------
  const handleProofUpload = async () => {
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
        Alert.alert('Success', 'Proof uploaded and delivery marked as delivered');
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Unknown error';
        Alert.alert('Upload failed', message);
      }
    }
  };

  // ---------- Loading / Error states ----------
  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />;
  }

  if (!delivery) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Delivery not found</Text>
      </View>
    );
  }

  // ---------- Main UI ----------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Delivery Status</Text>

      {/* Status timeline */}
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex && delivery.status !== 'cancelled';
        const isCurrent = index === currentIndex;
        const isCancelled = delivery.status === 'cancelled' && isCurrent;

        return (
          <View key={step.key} style={styles.stepRow}>
            {/* Circle indicator */}
            <View style={[styles.circle, isCompleted && styles.circleCompleted]}>
              {isCompleted && <Text style={styles.checkmark}>✓</Text>}
            </View>

            {/* Label and badges */}
            <View style={styles.stepTextContainer}>
              <Text style={[styles.stepLabel, (isCompleted || isCurrent) && styles.completedLabel]}>
                {step.label}
              </Text>
              {isCurrent && !isCancelled && (
                <View style={styles.currentBadge}>
                  <Text style={styles.badgeText}>Current</Text>
                </View>
              )}
              {isCancelled && (
                <View style={styles.cancelledBadge}>
                  <Text style={styles.badgeText}>Cancelled</Text>
                </View>
              )}
            </View>
          </View>
        );
      })}

      {/* Proof upload section (only when delivered) */}
      {delivery.status === 'delivered' && (
        <View style={styles.uploadSection}>
          <Button
            title="Upload Proof of Delivery"
            onPress={handleProofUpload}
            color={Colors.primary}
          />
        </View>
      )}
    </ScrollView>
  );
};

// ---------- Styles (merged with shared theme) ----------
const styles = {
  container: {
    ...CommonStyles.screenContainer,
  },
  title: {
    ...CommonStyles.pageTitle,
  },
  stepRow: {
    ...CommonStyles.statusRow,
  },
  circle: {
    ...CommonStyles.statusCircle,
  },
  circleCompleted: {
    ...CommonStyles.statusCircleCompleted,
  },
  checkmark: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  stepTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepLabel: {
    ...CommonStyles.statusLabel,
  },
  completedLabel: {
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  currentBadge: {
    ...CommonStyles.badge,
    backgroundColor: Colors.primary,
  },
  cancelledBadge: {
    ...CommonStyles.badge,
    backgroundColor: Colors.danger,
  },
  badgeText: {
    ...CommonStyles.badgeText,
  },
  uploadSection: {
    marginTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: Spacing.md,
  },
  error: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: Fonts.sizes.large,
    color: Colors.danger,
  },
};

export default DeliveryTrackingScreen;
