import React from 'react';
import { View, WebView } from 'react-native';

const GameWebView: React.FC<{ url: string }> = ({ url }) => {
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: url }} />
    </View>
  );
};

export default GameWebView;
