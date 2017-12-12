/* @flow */

import React, { Component } from 'react';
import {
	Segment,
	Container,
	Grid,
	Header,
	List
} from 'semantic-ui-react'

import { Link } from 'react-router-dom';

export const Footer = () => (

	<Segment inverted vertical style={{ padding: '5em 0em' }}>
	    <Container>
	        <Grid divided inverted stackable>
	            <Grid.Row>
	                <Grid.Column width={3}>
	                    <Header inverted as='h4' content='About' />
	                    <List link inverted>
	                        <List.Item as={ Link } to='/about-us'>Contact Us</List.Item>
	                    </List>
	                </Grid.Column>
	                <Grid.Column width={3}>
	                    <Header inverted as='h4' content='Value' />
	                    <List link inverted>
	                        <List.Item as='a'>For Hotels</List.Item>
	                        <List.Item as='a'>For Guests</List.Item>
	                    </List>
	                </Grid.Column>
	            </Grid.Row>
	        </Grid>
	    </Container>
	</Segment>

);
