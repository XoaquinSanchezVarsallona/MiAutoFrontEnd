import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Linking,
    TextInput,
    Button, Modal
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

function StarRating({ rating }) {
    const stars = [1, 2, 3, 4, 5].map((value) => {
        let starStyle = styles.emptyStar;
        if (value <= rating) {
            starStyle = styles.filledStar;
        }
        return <Text key={value} style={starStyle}>★</Text>;
    });

    return (
        <View style={styles.starContainer}>
            {stars}
        </View>
    );
}

function InteractiveStarRating({ rating, setRating }) {
    const handlePress = (value) => {
        setRating(value);
    };

    const stars = [1, 2, 3, 4, 5].map((value) => {
        let starStyle = styles.emptyStar;
        if (value <= rating / 2) {
            starStyle = styles.filledStar;
        }
        return (
            <TouchableOpacity key={value} onPress={() => handlePress(value * 2)}>
                <Text style={starStyle}>★</Text>
            </TouchableOpacity>
        );
    });

    return (
        <View style={styles.starContainer}>
            {stars}
        </View>
    );
}


export function VisualStoreProfile({ route }) {
    const [storeData, setStoreData] = useState({
        email: '',
        description: '',
        phoneNumber: '',
        webPageLink: '',
        instagramLink: '',
        googleMapsLink: '',
    });

    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
    })

    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const fetchStoreData = async () => {
        try {
            console.log(route.params.store.storeEmail + "MAILLLL")
            const response = await fetch('http://localhost:9002/getVisualStoreProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: route.params.store.storeEmail,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setStoreData(data);
        } catch (error) {
            console.error('Error fetching store data:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:9002/getReviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: route.params.store.storeEmail,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const fetchUserReview = async () => {
        try {
            const response = await fetch('http://localhost:9002/getUserReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: inputs.userID,
                    email: route.params.store.storeEmail,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setUserReview(data);
        } catch (error) {
            console.error('Error fetching user review:', error);
        }
    };

    const handleOpenURL = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    };


    const handleSubmitRatingAndComment = async () => {
        try {
            const response = await fetch('http://localhost:9002/submitRatingAndComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: inputs.userID,
                    storeEmail: route.params.store.storeEmail,
                    rating,
                    comment,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchReviews(); //refetcheo
            await fetchUserReview();
            const data = await response.json();
            setRating('');
            setComment('');
        } catch (error) {
            console.error('Error submitting rating and comment:', error);
        }
    };

    const handleDeleteReview = async () => {
        try {
            const response = await fetch('http://localhost:9002/DeleteReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: inputs.userID,
                    email: route.params.store.storeEmail,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchReviews(); // Fetch reviews again to update the list
            setUserReview(null); // Clear the user review
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    useEffect(() => {
        fetchStoreData();
        fetchReviews();
    }, []);

    // This effect runs once and fetches the token and user ID
    useEffect(() => {
        async function loadUserProfile() {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const response = await fetch('http://localhost:9002/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        userID: data.userId,
                        username: data.username,
                    }));
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        }
        loadUserProfile().then(r => console.log(r));
    }, []);

    useEffect(() => {
        if (inputs.userID) {
            fetchUserReview(); // Fetch the user's review if userID is available
        }
    }, [inputs.userID]);

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Store Profile</Text>
            </View>
            <ScrollView style={styles.vehiclesList}>
                <Text style={styles.field}>Description: {storeData.description}</Text>
                <Text style={styles.field}>Phone Number: {storeData.phoneNumber}</Text>
                <TouchableOpacity onPress={() => handleOpenURL(storeData.webPageLink)}>
                    <Text style={styles.field}>Web Page: {storeData.webPageLink}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOpenURL(storeData.instagramLink)}>
                    <Text style={styles.field}>Instagram: {storeData.instagramLink}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOpenURL(storeData.googleMapsLink)}>
                    <Text style={styles.field}>Google Maps: {storeData.googleMapsLink}</Text>
                </TouchableOpacity>

                {userReview ? (
                    <View style={styles.userReviewContainer}>
                        <Text style={styles.commentsTitle}>Your Review</Text>
                        <View style={styles.starRatingContainer}>
                            <StarRating rating={userReview.rating / 2} />
                            <Text style={styles.creationDate}>{new Date(userReview.creationDate).toLocaleDateString()}</Text>
                        </View>
                        <Text style={styles.comment}>{userReview.comment}</Text>
                        <View style={styles.userReviewActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={openModal}>
                                <Text style={styles.actionButtonText}>Edit</Text>
                                <ReviewModal
                                    isVisible={isModalVisible}
                                    onClose={closeModal}
                                    fetchReviews={fetchReviews}
                                    fetchUserReview={fetchUserReview}
                                    route={route}
                                    inputs={inputs}
                                    currentReview={userReview}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteReview}>
                                <Text style={styles.actionButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.ratingSection}>
                        <Text style={styles.sectionTitle}>Rate and Comment</Text>
                        <InteractiveStarRating rating={rating} setRating={setRating} />
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter your comment"
                            value={comment}
                            onChangeText={setComment}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRatingAndComment}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Reviews</Text>
                    {reviews.filter(review => {
                        console.log(review.userID + " " + inputs.userID);
                        return String(review.userID) !== String(inputs.userID);
                    }).map((review, index) => (
                        <View key={index} style={styles.commentContainer}>
                            <View style={styles.starRatingContainer}>
                                <StarRating rating={review.rating / 2} />
                                <Text style={styles.creationDate}>{new Date(review.creationDate).toLocaleDateString()}</Text>
                            </View>
                            <Text style={styles.comment}>{review.comment}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const ReviewModal = ({ isVisible, onClose, fetchReviews, fetchUserReview, route, inputs, currentReview }) => {
    const [rating, setRating] = useState(currentReview ? currentReview.rating : 0);
    const [comment, setComment] = useState(currentReview ? currentReview.comment : '');

    useEffect(() => {
        if (currentReview) {
            setRating(currentReview.rating);
            setComment(currentReview.comment);
        }
    }, [currentReview]);

    const handleUpdate = async () => {
        try {
            const url = 'http://localhost:9002/UpdateReview';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: inputs.userID,
                    storeEmail: route.params.store.storeEmail,
                    rating: rating,
                    comment: comment,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchReviews(); // Fetch reviews again to update the list
            await fetchUserReview(); // Fetch user review to update the display
            setRating(0);
            setComment('');
            onClose(); // Close the modal after updating
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.sectionTitle}>Update Review</Text>
                    <InteractiveStarRating rating={rating} setRating={setRating} />
                    <TextInput
                        style={styles.textArea}
                        placeholder="Enter your comment"
                        value={comment}
                        onChangeText={setComment}
                        multiline={true}
                        numberOfLines={4}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                        <Text style={styles.submitButtonText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        paddingTop: 40,
        width: '100%',
    },
    vehiclesList: {
        flex: 1,
        width: '50%',
        marginTop: 10,
        marginBottom: 80,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    field: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
    },
    ratingSection: {
        backgroundColor: 'rgba(30, 144, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        marginVertical: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    commentsSection: {
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        textAlign: 'center',
    },
    commentContainer: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    starRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    creationDate: {
        fontSize: 12,
        color: 'white',
    },
    comment: {
        fontSize: 14,
        color: 'white',
    },
    starContainer: {
        flexDirection: 'row',
    },
    filledStar: {
        color: 'gold',
        fontSize: 20,
    },
    emptyStar: {
        color: 'gray',
        fontSize: 20,
    },
    userReviewActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'rgba(30, 144, 255, 0.9)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    textArea: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});