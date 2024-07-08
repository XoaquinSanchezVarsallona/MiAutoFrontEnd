import React, { useEffect, useState } from 'react';
import {ImageBackground, View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from "react-select";
import arrowImage from '../../../assets/blackArrow.png';

export function VehicleCharts({ navigation, route }) {
    const { vehicle } = route.params;
    const [chartData, setChartData] = useState([]);
    const [chartFilteredData, setChartFilteredData] = useState([[]])
    const [usernames, setUsernames] = useState([]);
    const [month, setMonth] = useState(0);
    const [week, setWeek] = useState(0);
    const [year, setYear] = useState(0);
    const [perspective, setPerspective] = useState('')

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

    const perspectiveOptions = [
        { value: 'weeks', label: 'Weeks' },
        { value: 'months', label: 'Months' },
        { value: 'years', label: 'Years' }
    ];

    const handleOptionChange = (value) => {
        setPerspective(value);
        if (value === 'months') {
            setChartFilteredData(groupedByMonth[month]);
        } else if (value === 'weeks') {
            setChartFilteredData(groupedByWeek[week]);
        } else if (value === 'years') {
            setChartFilteredData(chartData);
        }
    }

    const groupedByMonth = chartData.reduce((acc, cur) => {
        const month = new Date(cur.date).getMonth(); // getMonth() returns 0-11 for Jan-Dec
        const year = new Date(cur.date).getFullYear();
        const key = `${year}-${month + 1}`; // Create a key like '2024-1' for January 2024
        console.log('Key:', key)
        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(cur);
        console.log('Acc:', acc)
        return acc;
    }, {});

    const groupedByWeek = chartData.reduce((acc, cur) => {
        const week = getWeek(new Date(cur.date)); // getWeek() returns 1-53 for weeks
        const year = new Date(cur.date).getFullYear();
        const key = `${year}-${week}`; // Create a key like '2024-1' for week 1 of 2024

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(cur);
        return acc;
    }, {});

    function getWeek(date) {

    }

    const incrementPerspective = () => {
        if (perspective === 'months') {
            if (month === 12) return;
            setMonth(month + 1);
            setChartFilteredData(groupedByMonth[month]);
        } else if (perspective === 'weeks') {
            if (week === 53) return;
            setWeek(week + 1);
            setChartFilteredData(groupedByWeek[week]);
        }
    }

    const decreasePerspective = () => {
        if (perspective === 'months') {
            if (month === 1) return;
            setMonth(month - 1);
            setChartFilteredData(groupedByMonth[month]);
        } else if (perspective === 'weeks') {
            if (week === 1) return;
            setWeek(week - 1);
            setChartFilteredData(groupedByWeek[week]);
        }
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Charts</Text>
            <View style={[styles.pickerContainer, { overflow: 'visible', zIndex: 9999}]}>
                <Text style={styles.label}>Chart intervals: </Text>
                <Select
                    options={perspectiveOptions}
                    onChange={(selectedOption) => handleOptionChange(selectedOption.value)}
                    value={perspectiveOptions.find(option => option.value === perspective) || 'Select an option'}
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            backgroundColor: 'transparent',
                            color: 'white',
                            borderColor: 'gray',
                            borderWidth: 1,
                            borderRadius: 5,
                            zIndex: 9999,
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: 'white',
                            zIndex: 9999,
                        }),
                        menu: (provided) => ({
                            ...provided,
                            color: 'black',
                            zIndex: 9999,
                            placeholder: 'white',
                        })
                    }}
                />
            </View>
            <View style={styles.content}>
                <View style={styles.chartContainer}>
                    <View style={{ width: '100%', height: 300 }}>
                        <Text style={styles.chartTitle}>Mileage</Text>
                        <ResponsiveContainer>
                            <LineChart
                                data={chartFilteredData.length ? chartFilteredData : [{ date: 'No Data', Mileage: 0 }]}
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
                <TouchableOpacity onPress={incrementPerspective} style={styles.arrowRight}>
                    <Image source={arrowImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={decreasePerspective}  style={styles.arrowLeft} >
                    <Image source={arrowImage}/>
                </TouchableOpacity>
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
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    pickerContainer: {
        marginBottom: 20,
        alignSelf: 'center',
        zIndex: 9999,
        flexDirection: 'row',
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
    arrowRight: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 20,
        height: 12,
        transform: [{ scaleX: -1 }],
    },
    arrowLeft: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 20,
        height: 12,
    },
});
