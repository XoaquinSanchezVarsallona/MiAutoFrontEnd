import React, { useEffect, useState } from 'react';
import { ImageBackground, View, Text, StyleSheet } from 'react-native';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function VehicleCharts({ navigation, route }) {
    const { vehicle } = route.params;
    const [chartData, setChartData] = useState([]);
    const [usernames, setUsernames] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:9002/route/${vehicle.patente}`);
            const data = await response.json();

            const formattedData = data.map(item => ({
                date: item.date,
                username: item.username,
                Mileage: parseInt(item.kilometraje, 10),
            }));

            // Sort data by date
            const sortedData = formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Extract unique usernames
            const uniqueUsernames = [...new Set(sortedData.map(item => item.username))];

            // Get all unique dates
            const dates = [...new Set(sortedData.map(item => item.date))];

            // Normalize data to ensure each date has an entry for each username
            const normalizedData = dates.map(date => {
                const dateEntries = { date };
                uniqueUsernames.forEach(username => {
                    const userEntry = sortedData.find(item => item.date === date && item.username === username);
                    dateEntries[username] = userEntry ? userEntry.Mileage : null;
                });
                return dateEntries;
            });

            console.log('Normalized Data:', normalizedData); // Log normalized data before setting state
            setChartData(normalizedData);
            setUsernames(uniqueUsernames);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    useEffect(() => {
        console.log('Chart Data:', chartData); // Log chartData to see if it's updating
        console.log('Usernames:', usernames); // Log usernames to see if they are updating
    }, [chartData, usernames]);

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Charts</Text>
            <View style={styles.content}>
                <View style={styles.chartContainer}>
                    <View style={{ width: '100%', height: 300 }}>
                        <Text style={styles.chartTitle}>Mileage</Text>
                        <ResponsiveContainer>
                            <LineChart
                                data={chartData.length ? chartData : [{ date: 'No Data', Mileage: 0 }]}
                                margin={{ top: 0, right: 20, left: 10, bottom: 5 }}
                            >
                                <XAxis dataKey="date" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend />
                                {usernames.map((username, index) => (
                                    <Line
                                        key={username}
                                        type="monotone"
                                        dataKey={username}
                                        stroke={colors[index % colors.length]}
                                        strokeWidth={3}
                                        name={username}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chartContainer: {
        marginTop: 10,
        width: '100%',
        height: 300,
    },
    content: {
        marginTop: 10,
        padding: 10,
        margin: 2,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '60%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    chartTitle: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 12,
        marginTop: -8,
    },
});
