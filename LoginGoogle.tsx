import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';

const LoginGoogle: React.FC = () => {
  const [user, setUser] = React.useState(null);

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = AuthSession.getRedirectUrl();
      const result = await AuthSession.startAsync({
        authUrl: `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=email%20profile`,
      });
      if (result.type === 'success') {
        const { code } = result.params;
        const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `code=${code}&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=${encodeURIComponent(redirectUrl)}&grant_type=authorization_code`,
        });
        const { access_token } = await response.json();
        const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <Text>Welcome, {}</Text>
      ) : (
        <TouchableOpacity onPress={signInWithGoogle} style={styles.googleSignInButton}>
          <Text style={styles.googleSignInButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleSignInButton: {
    backgroundColor: '#dd4b39',
    padding: 10,
    borderRadius: 5,
  },
  googleSignInButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default  {LoginGoogle};