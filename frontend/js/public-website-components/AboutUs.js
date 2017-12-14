/* @flow */

import React, { Component } from 'react';
import {
    Header,
    Image,
    Card,
    Icon,
    Segment,
    Grid,
    Container
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
                <Segment style={ styles.teamSegment }>
                    <Container>
                        <Header as='h3' style={{ fontSize: '2em' }}>Team</Header>
                        <br/>
                        <Grid textAlign='center' columns={3} stackable>
                            <Grid.Row>
                                <Grid.Column>
                                    <Card style={ styles.hasanCard }>
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
                                        <Card.Content extra>
                                            <Icon name='mail' />
                                            hbj@verboze.com
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>

                                <Grid.Column>
                                    <Card style={ styles.fituriCard }>
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
                                            </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <Icon name='mail' />
                                            mfituri@verboze.com
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>

                                <Grid.Column>
                                    <Card style={ styles.yusufCard }>
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
                                        <Card.Content extra>
                                            <Icon name='mail' />
                                            ymusleh@verboze.com
                                        </Card.Content>
                                    </Card>
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
    teamSegment: {
        padding: '8em 0em',
        borderRadius: 0,
        margin: 0
    },
    hasanCard: {
        height: '100%'
    },
    fituriCard: {
        height: '100%',
        margin: 'auto'
    },
    yusufCard: {
        height: '100%',
        float: 'right'
    },
    locationSegment: {
        padding: '8em 0em',
        borderRadius: 0,
        margin: 0
    }
}