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
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';

type PropsType = {
};

type StateType = {
};

export default class Features extends Component<PropsType, StateType> {
	_white_image = require('../../assets/images/white-image.png');

	render() {
		return (
			<div>
				<Segment inverted style={ styles.featureHeaderSegment }>
					<Container text>
						<Header textAlign='center' inverted as='h3' style={{ fontSize: '2em' }}>THIS IS FEATURES PAGE!</Header>
					</Container>
				</Segment>

                <Segment style={ styles.featureSegment } vertical>
                	<Container>
						<Header as='h3' style={{ fontSize: '2em' }}>Retrofitting</Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but it's really
                            true.
                            It took years of gene splicing and combinatory DNA research, but our bananas can really dance.
                        </p>
                	</Container>
                </Segment>

                <Segment inverted style={ styles.featureSegment }>
                	<Container>
                        <Header inverted as='h3' style={{ fontSize: '2em' }}>Control</Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Instead of focusing on content creation and hard work, we have learned how to master the art of doing
                            nothing by providing massive amounts of whitespace and generic content that can seem massive, monolithic
                            and worth your attention.
                        </p>
					    <Grid celled='internally' columns='equal' stackable>
					        <Grid.Row textAlign='center'>
					            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
					                <Header inverted as='h3' style={{ fontSize: '2em' }}>Lights</Header>
					                <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
					            </Grid.Column>
					            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
					                <Header inverted as='h3' style={{ fontSize: '2em' }}>Thermostat</Header>
					                <p style={{ fontSize: '1.33em' }}>
					                    <b>Nan</b> Chief Fun Officer Acme Toys
					                </p>
					            </Grid.Column>
					            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
					                <Header inverted as='h3' style={{ fontSize: '2em' }}>Curtains</Header>
					                <p style={{ fontSize: '1.33em' }}>
					                    <b>Nan</b> Chief Fun Officer Acme Toys
					                </p>
					            </Grid.Column>
					            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
					                <Header inverted as='h3' style={{ fontSize: '2em' }}>And More...</Header>
					                <p style={{ fontSize: '1.33em' }}>
					                    <b>Nan</b> Chief Fun Officer Acme Toys
					                </p>
					            </Grid.Column>
					        </Grid.Row>
					    </Grid>
                    </Container>
                </Segment>

				<Segment style={ styles.featureSegment }>
					<Container>
						<Header as='h3' style={{ fontSize: '2em' }}>Monitoring</Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but it's really
                            true.
                            It took years of gene splicing and combinatory DNA research, but our bananas can really dance.
                        </p>
					</Container>
				</Segment>

            </div>
		);
	};
};

const styles = {
	featureHeaderSegment: {
		padding: '3em 0em',
		borderRadius: 0,
		margin: 0
	},
	featureSegment: {
		padding: '8em 0em',
		borderRadius: 0,
		margin: 0
	}
}