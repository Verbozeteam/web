/* @flow */

import React, { Component } from 'react';
import {
    Header,
    Segment,
    Grid,
    Image,
    Button,
    Container,
    Divider,
    List,
    Div
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';

type PropsType = {
};

type StateType = {
};

export default class Features extends Component<PropsType, StateType> {
    _white_image = require('../../assets/images/white-image.png');
    _retrofitting = require('../../assets/images/retrofitting.gif');
    _iphone = require('../../assets/images/iphone.png');
    _pixel = require('../../assets/images/pixel.png');
    _tablet = require('../../assets/images/tablet.png');
    _monitoring = require('../../assets/images/monitoring.gif');

    _curtains = require('../../assets/images/curtains.png');
    _thermostat = require('../../assets/images/thermostat.png');
    _do_not_disturb = require('../../assets/images/do_not_disturb.png');
    _lights = require('../../assets/images/lights.png');
    _alarm = require('../../assets/images/alarm.png');
    _room_service = require('../../assets/images/room_service.png');
    _electricity = require('../../assets/images/electricity.png');
    _more = require('../../assets/images/more.png');

    render() {
        return (
            <div>
                <Segment style={ styles.featureSegment } vertical id='retrofitting'>
                    <Container>
                        <Header as='h3' style={{ fontSize: '2em' }}>Retrofitting</Header>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <p style={{ fontSize: '1.33em' }}>
                                        We install our hardware on top of your current setup without the need to knock down walls or renovate your hotel.
                                        <br/>
                                        <br/>
                                        <b>What does that mean for you?</b>
                                    </p>
                                    <List>
                                        <List.Item>
                                            <List.Icon size='big' name='settings' color='grey' />
                                            <List.Content>
                                                <p style={{ fontSize: '1.33em' }}>
                                                    Increase the speed of installation and configuration
                                                </p>
                                            </List.Content>
                                        </List.Item>

                                        <List.Item>
                                            <List.Icon size='big' name='object group' color='blue' />
                                            <List.Content>
                                                <p style={{ fontSize: '1.33em' }}>
                                                    Maintain your current layout and design of the room
                                                </p>
                                            </List.Content>
                                        </List.Item>

                                        <List.Item>
                                            <List.Icon size='big' name='money' color='green' />
                                            <List.Content>
                                                <p style={{ fontSize: '1.33em' }}>
                                                    Reduce your costs drastically
                                                </p>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column floated='right' width={6}>
                                    <Image
                                        size='large'
                                        src={ this._retrofitting }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Segment>

                <Segment inverted style={ styles.featureSegment } id='control'>
                    <Container>
                        <Header inverted as='h3' style={{ fontSize: '2em' }}>Control</Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Give your guests the ability to have full control of all aspects of their room and much more. All within reach of their finger tips with our intuitively designed apps.
                        </p>

                        <Grid textAlign='center'>
                            <Grid.Row>
                                <Grid.Column width={2}>
                                    <Image circular src={ this._lights }/>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Image circular src={ this._thermostat }/>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Image circular src={ this._curtains }/>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Image circular src={ this._do_not_disturb }/>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Image circular src={ this._alarm }/>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Image circular src={ this._electricity }/>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Image circular src={ this._room_service }/>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Image circular src={ this._more }/>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                        <Header textAlign='center' inverted as='h3' style={{ fontSize: '2em' }}>controlled via:</Header>
                        <Grid celled='internally' columns='equal' stackable>
                            <Grid.Row textAlign='center'>
                                <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                    <Header inverted as='h3' style={{ fontSize: '2em' }}>Touch screen display</Header>
                                    <Image style={{ margin: 'auto' }} size='large' src={ this._tablet }/>
                                    <br/>
                                    <p style={{ fontSize: '1.33em' }}>Wall mounted or portable</p>
                                </Grid.Column>
                                <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                    <Header inverted as='h3' style={{ fontSize: '2em' }}>Phone</Header>
                                    <Grid columns='equal' stackable>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Image style={{ margin: 'auto' }} size='small' src={ this._iphone }/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Image style={{ margin: 'auto' }} size='small' src={ this._pixel }/>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                    <br/>
                                    <p style={{ fontSize: '1.33em' }}>App available to all guests</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Segment>

                <Segment style={ styles.featureSegment } id='monitoring'>
                    <Container>
                        <Header as='h3' style={{ fontSize: '2em' }}>Monitoring</Header>
                        <br/>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column floated='left' width={6}>
                                    <Image size='large' src={ this._monitoring } />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <p style={{ fontSize: '1.33em' }}>
                                        Give your staff the ability to monitor live status of the hotel.
                                        <br/>
                                        Provide them with insights and information
                                        that will make them more efficient, and help improve the overall experience for your guests.
                                    </p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Segment>
            </div>
        );
    };
};

const styles = {
    featureSegment: {
        padding: '8em 0em',
        borderRadius: 0,
        margin: 0
    }
}
