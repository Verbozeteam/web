/* @flow */

import React, { Component } from 'react';
import {
    Segment,
    Grid,
    Header,
    Button,
    Container,
    Image,
    Divider,
} from 'semantic-ui-react';

import { RoomDemoComponent } from './RoomDemoComponent';

import { Link } from 'react-router-dom';

type PropsType = {
};

type StateType = {
};

export default class Home extends Component<PropsType, StateType> {
    _white_image = require('../../assets/images/white-image.png');
    _technology_complements_luxury = require('../../assets/images/technology_complements_luxury.gif');

    _insights = require('../../assets/images/insights.gif');
    _seamless_exp = require('../../assets/images/seamless_experience.gif');

    render() {
        return (
            <div>
                <RoomDemoComponent />
                <Segment style={{ padding: '8em 0em' }} vertical>
                    <Grid container stackable verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header as='h3' style={{ fontSize: '2em' }}>Technology that complements luxury</Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    Technology doesn't have to negatively impact your luxurious image. In fact, we worked hard
                                    to improve it, by allowing your guests to experience all what you have to offer at their finger tips.
                                </p>
                            </Grid.Column>
                            <Grid.Column floated='right' width={6}>
                                <Image
                                    size='large'
                                    src={ this._technology_complements_luxury }
                                />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column floated='left' width={6}>
                                <Image
                                    size='large'
                                    src={ this._seamless_exp }
                                />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header as='h3' style={{ fontSize: '2em' }}>Seamless experience across branches</Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    Give your guests the same experience whenever they stay at your Hotel, no matter which branch they decide
                                    to visit.
                                    <br/>
                                    Never worry about outliers across your brand, ensure your guests are always happy, using their favorite preset settings.
                                </p>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header as='h3' style={{ fontSize: '2em' }}>Insights to help run your Hotel</Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    Give your staff periodic helpful insights about the current status of the hotel.
                                    Increasing their productivity, and decreasing their response time to any requests or issues that might come along.
                                </p>
                            </Grid.Column>
                            <Grid.Column floated='right' width={6}>
                                <Image
                                    size='large'
                                    src={ this._insights }
                                />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column textAlign='center'>
                                <Button as={ Link } to='/features' size='huge'>Learn More</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    };
};
