import React, {useRef, useState, useEffect, FC} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import {useRoute, RouteProp, ParamListBase} from '@react-navigation/native';
import {getValue, fontSizeKey, scrollingSpeedKey} from '../helpers/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    flexDirection: 'column',
    paddingBottom: 10,
  },
  scrollView: {
    backgroundColor: '#000000',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 10,
  },
  buttonText: {color: '#fffb00', fontSize: 20},
});

interface RootStackParamList extends ParamListBase {
  params: {
    text: string;
  };
}

export const PrompterContainer: FC = () => {
  const route = useRoute() as RouteProp<RootStackParamList, 'params'>;
  const {text} = route.params;
  const refContainer = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const [fontSize, setFontSize] = useState(30);
  const [scrollSpeed, setScrollSpeed] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      const defaultFontSize = await getValue(fontSizeKey);
      if (defaultFontSize !== null) {
        setFontSize(parseInt(defaultFontSize as string, 10));
      }
      const defaultScrollingSpeed = await getValue(scrollingSpeedKey);
      if (defaultScrollingSpeed !== null) {
        setScrollSpeed(parseInt(defaultScrollingSpeed as string, 10));
      }
    };
    fetchData();
  }, []);

  const textStyle = () => {
    return {
      transform: [{rotateY: '180deg'}],
      color: '#ffffff',
      fontSize,
    };
  };

  let scrollOffset = 0;

  const scroll = () => {
    refContainer.current?.scrollTo({
      x: 0,
      y: scrollOffset + scrollSpeed,
      animated: true,
    });
  };

  useEffect(() => {
    if (isScrolling) {
      const interval = setInterval(() => {
        scroll();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isScrolling]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset = event.nativeEvent.contentOffset.y;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={refContainer}
        onScroll={handleScroll}
        scrollEventThrottle={scrollSpeed / 2}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <Text style={textStyle()}>{text}</Text>
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsScrolling(!isScrolling)}>
        <Text style={styles.buttonText}>{isScrolling ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
