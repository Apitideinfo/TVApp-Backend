import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Title, Button, TextInput } from 'react-native-paper';
import { useAdmin } from '../../context/AdminContext';

const AdminSettingsScreen = () => {
  const { admin, logout } = useAdmin();

  return (
    <View style={styles.container}>
      <Title>Settings</Title>
      <View style={styles.section}>
        <Text style={styles.label}>Logged in as</Text>
        <Text style={styles.value}>{admin?.username} ({admin?.admin_id})</Text>
      </View>
      <View style={styles.section}>
        <Button mode="contained" onPress={logout}>Logout</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginTop: 12 },
  label: { color: '#666', marginBottom: 6 },
  value: { color: '#333', fontWeight: 'bold' },
});

export default AdminSettingsScreen;


