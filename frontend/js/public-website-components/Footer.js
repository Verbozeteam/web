/* @flow */

import React, { Component } from 'react';
import {
    Segment,
    Container,
    Grid,
    Header,
    List,
    Image
} from 'semantic-ui-react'

import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

// Use it just like a RRv4 link (to can be a string or an object, see RRv4 api for details):
// <HashLink to="/some/path#with-hash-fragment">Link to Hash Fragment</HashLink>

import verboze_logo from '../../assets/images/logo_symbol.png';

export const Footer = () => (

    <Segment inverted vertical style={{ padding: '5em 0em' }}>
        <Container>
            <Grid inverted stackable>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Header inverted as='h4' content='Verboze' />
                        <Image as={ Link } to='/' style={{ width: 50 }} src={ verboze_logo } />

                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header inverted as='h4' content='Features' />
                        <List link inverted>
                            <List.Item as={ HashLink } to='/features#retrofitting'>Retrofitting</List.Item>
                            <List.Item as={ HashLink } to='/features#control'>Control</List.Item>
                            <List.Item as={ HashLink } to='/features#monitoring'>Monitoring</List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header inverted as='h4' content='About' />
                        <List link inverted>
                            <List.Item as={ HashLink } to='/about-us#vision'>Vision</List.Item>
                            <List.Item as={ HashLink } to='/about-us#team'>Team</List.Item>
                            <List.Item as={ HashLink } to='/about-us#location'>Location</List.Item>
                        </List>
                    </Grid.Column>

                    <Grid.Column width={5} floated='right' textAlign='right' >
                        <Header inverted as='h5'>
                            © { new Date().getFullYear() } Verboze. All rights reserved.
                        </Header>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
        </Container>
    </Segment>

);
