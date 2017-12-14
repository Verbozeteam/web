/* @flow */

import React, { Component } from 'react';
import {
    Header,
    Image,
    Card,
    Icon,
    Segment,
    Grid
} from 'semantic-ui-react';

type PropsType = {
};

type StateType = {
};

export default class AboutUs extends Component<PropsType, StateType> {
    _yusuf = require('../../assets/images/yusuf.png');
    _hasan = require('../../assets/images/hasan.png');
    _fituri = require('../../assets/images/fituri.jpg');
    render() {
        return (
            <div>
                <Segment style={ styles.cardsSegment }>
                    <Grid textAlign='center' stackable>
                        <Grid.Row>

                            <Grid.Column width={4}>
                                <Card style={ styles.card }>
                                    <Image src={ this._hasan } />
                                    <Card.Content>
                                        <Card.Header>
                                            Hasan Al-Jawaheri
                                        </Card.Header>
                                        <Card.Meta>
                                            <span className='date'>
                                                Co-Founder&nbsp;&nbsp;|&nbsp;&nbsp;CEO&nbsp;&nbsp;|&nbsp;&nbsp;Systems Engineer
                                            </span>
                                        </Card.Meta>
                                        <Card.Description>
                                            Computer Science and Business Administration from Carnegie Mellon University
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>

                            <Grid.Column width={4}>
                                <Card style={ styles.card }>
                                    <Image src={ this._fituri } />
                                    <Card.Content>
                                        <Card.Header>
                                            Mohammed M. Fituri
                                        </Card.Header>
                                        <Card.Meta>
                                            <span className='date'>
                                                Co-Founder&nbsp;&nbsp;|&nbsp;&nbsp;Mobile&nbsp;&nbsp;|&nbsp;&nbsp;Design
                                            </span>
                                        </Card.Meta>
                                        <Card.Description>
                                            Computer Science and Information Systems from Carnegie Mellon University
                                            <br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>

                            <Grid.Column width={4}>
                                <Card style={ styles.card }>
                                    <Image src={ this._yusuf } />
                                    <Card.Content>
                                        <Card.Header>
                                            Yusuf Musleh
                                        </Card.Header>
                                        <Card.Meta>
                                            <span className='date'>
                                                Co-Founder&nbsp;&nbsp;|&nbsp;&nbsp;Backend&nbsp;&nbsp;|&nbsp;&nbsp;Web
                                            </span>
                                        </Card.Meta>
                                        <Card.Description>
                                            Computer Science and Business Administration from Carnegie Mellon University
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>

                        </Grid.Row>

                    </Grid>
                </Segment>
            </div>
        );
    };
};


const styles = {
    cardsSegment: {
        padding: '12em 0em',
        borderRadius: 0,
        margin: 0
    },
    card: {
        margin: 'auto'
    }
}