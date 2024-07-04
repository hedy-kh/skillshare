import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { getUserDetail } from '../Services';
import Colors from '../Utils/Colors';
import Coin from './../../assets/images/coin.png';
import { UserPointsContext } from '../Context/UserPointsContext';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { userPoints, setUserPoints } = useContext(UserPointsContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserDetails(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  const fetchUserDetails = (email) => {
    getUserDetail(email).then(resp => {
      console.log(resp);
      if (resp) {
        setUserDetails(resp.userDetail);
        setUserPoints(resp.userDetail?.point);
      }
    });
  };

  if (!userDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.profileText}>Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={styles.profileImage}
        />
        <Text style={{ color: Colors.WHITE, fontFamily: 'outfit' }}>Welcome,</Text>
        <Text style={styles.mainText}>{user?.fullName}</Text>
        <View style={styles.pointsContainer}>
          <Image source={Coin} style={styles.coinImage} />
          <Text style={styles.userPoints}>{userDetails.point} Points</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 160,
    backgroundColor: Colors.PRIMARY,
    padding: 30,
  },
  profileText: {
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
    fontSize: 30,
  },
  profileContainer: {
    marginTop: -40,
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    color: Colors.GRAY,
    marginTop: 10,
  },
  userEmail: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    color: Colors.GRAY,
    marginTop: 5,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  coinImage: {
    width: 35,
    height: 35,
  },
  userPoints: {
    fontFamily: 'outfit',
    fontSize: 20,
    color: Colors.GRAY,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
});
