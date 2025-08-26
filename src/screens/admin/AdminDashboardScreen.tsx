import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { adminDashboard } from '../../services/adminApi';

const AdminDashboardScreen = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, analyticsRes] = await Promise.all([
          adminDashboard.getDashboardData(),
          adminDashboard.getAnalytics()
        ]);
        setData({
          ...dashboardRes.data,
          ...analyticsRes.data
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a80f5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#4a80f5',
    backgroundGradientFrom: '#4a80f5',
    backgroundGradientTo: '#4a80f5',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Total Collections</Title>
            <Text style={styles.statValue}>{data?.collections?.total_collections || 0}</Text>
            <Text style={styles.statSubtext}>All Time</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Total Amount</Title>
            <Text style={styles.statValue}>${(data?.collections?.total_amount || 0).toLocaleString()}</Text>
            <Text style={styles.statSubtext}>All Time</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Revenue Chart */}
      {data?.monthlyRevenue && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Monthly Revenue</Title>
            <LineChart
              data={{
                labels: data.monthlyRevenue.map((item: any) => item.month.slice(-2)),
                datasets: [{
                  data: data.monthlyRevenue.map((item: any) => item.revenue)
                }]
              }}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {/* Status Distribution */}
      {data?.statusDistribution && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Collections by Status</Title>
            <PieChart
              data={data.statusDistribution.map((item: any) => ({
                name: item.status,
                population: item.count,
                color: getStatusColor(item.status),
                legendFontColor: '#7F7F7F',
                legendFontSize: 15
              }))}
              width={Dimensions.get('window').width - 40}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'verified':
      return '#4CAF50';
    case 'pending':
      return '#FFC107';
    case 'rejected':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    elevation: 3,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
    color: '#333',
  },
  statSubtext: {
    fontSize: 12,
    color: '#666',
  },
  chartCard: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default AdminDashboardScreen;
