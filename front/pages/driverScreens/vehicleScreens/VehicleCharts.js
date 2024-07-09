import React, { useEffect, useState } from 'react';
import {ImageBackground, View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from "react-select";
import arrowImage from '../../../assets/blackArrow.png';

export function VehicleCharts({ navigation, route }) {
    const { vehicle } = route.params;
    const [chartData, setChartData] = useState([]);
    const [chartFilteredData, setChartFilteredData] = useState([])
    const [monthData, setMonthData] = useState([]);
    const [weekData, setWeekData] = useState([]);
    const [usernames, setUsernames] = useState([]);
    const [month, setMonth] = useState(0);
    const [week, setWeek] = useState(1);
    const [year, setYear] = useState(0);
    const [perspective, setPerspective] = useState('')
    const [monthName, setMonthName] = useState('');

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

    const handleOptionChange = async (value) => {
        setPerspective(value);
        if (value === 'months') {
            await setMonthData(groupByMonth);
        } else if (value === 'weeks') {
            await setWeekData(groupByWeek);
        } else if (value === 'years') {
            console.log('Grouped by year ' + value + ':', chartFilteredData)
            setChartFilteredData(chartData);
        }
    }

    const groupByMonth = chartData.reduce((acc, curr) => {
        const month = new Date(curr.date).getMonth();
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(curr);
        return acc;
    }, []);

    const groupByWeek = chartData.reduce((acc, cur) => {
        const date = new Date(cur.date);
        const week = getWeek(date);
        console.log('week: ' + week)
        console.log('date:' + date)
        if (!acc[week]) {
            acc[week] = [];
        }
        acc[week].push(cur);
        console.log(acc)
        return acc;
    }, {});

    function getWeek(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    const incrementPerspective = async () => {
        if (perspective === 'months') {
            if (month === 11) return;
            setMonth(month + 1);
            setChartFilteredData(groupByMonth[month]);
        } else if (perspective === 'weeks') {
            if (week === 53) return;
            setWeek(week + 1);
            setChartFilteredData(groupByWeek[week]);
        }
    }

    const decreasePerspective = () => {
        if (perspective === 'months') {
            if (month === 0) return;
            setMonth(month - 1);
            setChartFilteredData(groupByMonth[month]);
        } else if (perspective === 'weeks') {
            if (week === 1  ) return;
            setWeek(week - 1);
            setChartFilteredData(groupByWeek[week]);
        }
    }

    useEffect(() => {
        setMonthName(getMonthName(month));
    }, [month]);

    useEffect(() => {
        if (monthData[month]) {
            setChartFilteredData(monthData[month]);
        }
    }, [monthData, month]);

    useEffect(() => {
        if (weekData[week]) {
            setChartFilteredData(weekData[week]);
        }
    }, [weekData, week]);

    function getMonthName(month) {
        switch (month) {
            case 0: return 'January';
            case 1: return 'February';
            case 2: return 'March';
            case 3: return 'April';
            case 4: return 'May';
            case 5: return 'June';
            case 6: return 'July';
            case 7: return 'August';
            case 8: return 'September';
            case 9: return 'October';
            case 10: return 'November';
            case 11: return 'December';
            default: return 'Invalid month';
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
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.chartTitle}>Mileage</Text>
                            {perspective === 'months' && (
                                <Text style={styles.interval}>{monthName}</Text>
                            )}
                        </View>
                        <ResponsiveContainer style={{}}>
                            <LineChart
                                data={chartFilteredData.length ? chartFilteredData : [{ date: 'Select an interval', Mileage: 0 }]}
                                margin={{ top: 0, right: 10, left: 10, bottom: 5 }}
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
                <View style={styles.arrows}>
                    <TouchableOpacity onPress={decreasePerspective}>
                        <Image source={arrowImage} style={styles.arrowLeft}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={incrementPerspective} >
                        <Image source={arrowImage} style={styles.arrowRight}/>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        maxWidth: '100%',
        maxHeight: '100%',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chartContainer: {
        flex: 1,
        padding: 10,
        marginTop: 10,
        maxHeight: '100%',
        alignItems: 'center',
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
        flex: 1,
        marginTop: 10,
        padding: 10,
        margin: 2,
        paddingRight: 66,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '60%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    chartTitle: {
        fontSize: 30,
        alignSelf: 'center',
        marginLeft: 60,
        marginBottom: 12,
        marginTop: -8,
    },
    interval: {
        fontSize: 20,
        position: 'absolute',
        right: 5,
    },
    arrowRight: {
        height: 25,
        width: 30,
        marginRight: -80,
        transform: [{ scaleX: -1 }],
    },
    arrowLeft: {
        height: 25,
        width: 30,
        marginLeft: 20,
    },
    arrows: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    }
});
