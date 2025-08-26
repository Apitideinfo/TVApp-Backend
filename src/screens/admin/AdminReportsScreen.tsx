import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Title, Button, Menu, useTheme } from 'react-native-paper';
import { adminReports } from '../../services/adminApi';

const AdminReportsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [reportType, setReportType] = useState<'collections' | 'workers'>('collections');
  const theme = useTheme();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await adminReports.getReports({ report_type: reportType });
      const rows = res.data.collections || res.data.workerPerformance || [];
      setData(rows);
    } catch (e) {
      console.error('Failed to load reports', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const handleExport = async () => {
    try {
      await adminReports.exportReport({ report_type: reportType });
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      {reportType === 'collections' ? (
        <>
          <Text style={styles.cell}>{item.date}</Text>
          <Text style={styles.cell}>{item.total_collections}</Text>
          <Text style={styles.cell}>{item.total_amount}</Text>
          <Text style={styles.cell}>{item.verified_count}</Text>
          <Text style={styles.cell}>{item.pending_count}</Text>
        </>
      ) : (
        <>
          <Text style={styles.cell}>{item.worker_name}</Text>
          <Text style={styles.cell}>{item.total_collections}</Text>
          <Text style={styles.cell}>{item.total_amount}</Text>
          <Text style={styles.cell}>{Math.round(item.avg_amount)}</Text>
          <Text style={styles.cell}>{item.verified_collections}</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Reports</Title>
        <View style={styles.actions}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={<Button onPress={() => setMenuVisible(true)} icon="filter">{reportType}</Button>}
          >
            <Menu.Item onPress={() => { setReportType('collections'); setMenuVisible(false); }} title="Collections" />
            <Menu.Item onPress={() => { setReportType('workers'); setMenuVisible(false); }} title="Workers" />
          </Menu>
          <Button mode="contained" onPress={handleExport} style={styles.exportBtn}>
            Export CSV
          </Button>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>
      ) : (
        <>
          <View style={[styles.row, styles.headerRow]}>
            {reportType === 'collections' ? (
              <>
                <Text style={[styles.cell, styles.headerCell]}>Date</Text>
                <Text style={[styles.cell, styles.headerCell]}>Collections</Text>
                <Text style={[styles.cell, styles.headerCell]}>Amount</Text>
                <Text style={[styles.cell, styles.headerCell]}>Verified</Text>
                <Text style={[styles.cell, styles.headerCell]}>Pending</Text>
              </>
            ) : (
              <>
                <Text style={[styles.cell, styles.headerCell]}>Worker</Text>
                <Text style={[styles.cell, styles.headerCell]}>Collections</Text>
                <Text style={[styles.cell, styles.headerCell]}>Amount</Text>
                <Text style={[styles.cell, styles.headerCell]}>Avg</Text>
                <Text style={[styles.cell, styles.headerCell]}>Verified</Text>
              </>
            )}
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, idx) => `${reportType}-${idx}`}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<View style={styles.centered}><Text>No data</Text></View>}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { marginBottom: 16 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  exportBtn: { marginLeft: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 16 },
  row: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 8, backgroundColor: 'white', borderRadius: 8, marginBottom: 8 },
  headerRow: { backgroundColor: '#e9ecef' },
  cell: { flex: 1, color: '#333' },
  headerCell: { fontWeight: 'bold' },
});

export default AdminReportsScreen;


