'use strict';

import React, { PureComponent, PropTypes } from 'react';
import { StyleSheet, View, Alert, Dimensions, Text, Platform } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon
} from 'native-base';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import TrackingDot from '../res/TrackingDot.png';
import { toggleTrackingAsyncAction, getValidLocationsAsyncAction }  from '../modules/location';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  footer: {
    backgroundColor: '#0C68FB',
  },
  icon: {
    color: '#fff',
    fontSize: 30
  }
});

class HomeScene extends PureComponent {

  static navigationOptions = {
    title: 'Home',
    header: null
  }

  constructor(props) {
    super(props);
    console.log("init props -> ", props);
  }

  componentDidMount() {

    this.props.dispatch(getValidLocationsAsyncAction());
  
  }

  componentWillUnmount() {
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("NextProps -> ", nextProps);
  }

  goToSettings() {
    this.props.navigation.navigate('Menu');
  }

  toggleTracking () {
    this.props.dispatch(toggleTrackingAsyncAction());
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const { locations, stationaries, region, isRunning, authorized, error } = this.props;

    if(error && error.length > 0 )
      Alert.alert('BackgroundGeolocation error', message);

    if(!authorized) {
        Alert.alert(
          'Location services are disabled',
          'Would you like to open location settings?',
          [
            {
              text: 'Yes',
              onPress: () => BackgroundGeolocation.showLocationSettings()
            },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel'
            }
          ]
        );
    }

    return (
      <Container>
        <Content>
          <MapView style={{ width, height: height - 55 }} region={region}>
            {locations.map((location, idx) => (
              <MapView.Marker
                key={idx}
                coordinate={location}
                image={TrackingDot}
              />
            ))}
            {stationaries.map((stationary, idx) => {
              return (
                <MapView.Circle
                  key={idx}
                  center={stationary}
                  radius={stationary.radius}
                  fillColor="#AAA"
                />
              );
            })}
          </MapView>
          <Footer style={styles.footer}>
            <FooterTab>
              <Button onPress={this.toggleTracking.bind(this)}>
                <Icon name={isRunning ? 'pause' : 'play'} style={styles.icon} />
              </Button>
              <Button onPress={this.goToSettings.bind(this)}>
                <Icon name={Platform.OS === 'web' ? 'android-menu' : 'menu'} style={styles.icon} />
              </Button>
            </FooterTab>
          </Footer>
        </Content>
      </Container>
    );
  }
}

console.log(PropTypes);
/*HomeScene.propTypes = {
  locations: PropTypes.arrayOf(React.PropTypes.object),
  stationaries: PropTypes.arrayOf(React.PropTypes.object),
  dispatch: PropTypes.func.isRequired
}*/

HomeScene.defaultProps = {
  locations: [],
  stationaries: [],
}


const mapStateToProps = (state) => {
  console.log("mapStateToProps -> ", state);
  return {
    region: state.location.region,
    locations: state.location.locations,
    stationaries: state.location.stationaries,
    isRunning: state.location.isRunning,
    authorized: state.location.authorized,
    error: state.location.error
  }
}


export default connect(mapStateToProps)(HomeScene);
