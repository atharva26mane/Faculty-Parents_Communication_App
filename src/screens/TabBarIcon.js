// src/components/TabBarIcon.js
import React from 'react';
import { Image } from 'react-native';

export default function TabBarIcon({ name, color, size }) {
  let iconSource;

  if (name === 'account') {
    iconSource = require('../assets/user.png');
  } else if (name === 'account-remove') {
    iconSource = require('../assets/user-minus.png');
  } else if (name === 'bell') {
    iconSource = require('../assets/bell.png');
  } else if (name === 'logout') {
    iconSource = require('../assets/logout.png');
  }

  return (
    <Image
      source={iconSource}
      style={{ width: size, height: size, tintColor: color }}
      resizeMode="contain"
    />
  );
}
