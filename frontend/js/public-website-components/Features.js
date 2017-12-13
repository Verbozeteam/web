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
	_retrofitting = require('../../assets/images/retrofitting.png');
	_iphone = require('../../assets/images/iphone.png');
	_pixel = require('../../assets/images/pixel.png');
	_tablet = require('../../assets/images/tablet.png');
	_dashboard = require('../../assets/images/dashboard.png');


	render() {
		return (
			<div>
                <Segment style={ styles.featureSegment } vertical>
                	<Container>
						<Header as='h3' style={{ fontSize: '2em' }}>Retrofitting</Header>
						<Grid>
							<Grid.Row>
	                            <Grid.Column width={8}>
	                                <p style={{ fontSize: '1.33em' }}>
										We install our hardware on top of your current setup without the need to knock down walls or renovate your hotel.
	                                </p>
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

                <Segment inverted style={ styles.featureSegment }>
                	<Container>
                        <Header inverted as='h3' style={{ fontSize: '2em' }}>Control</Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Give your guests the ability to have full control of all aspects of their room and much more. All within reach of their finger tips with our intuitively designed apps.
                        </p>

						<Grid textAlign='center'>
							<Grid.Row>
								<Grid.Column width={2}>
									<Image circular src={ this._white_image }/>
								</Grid.Column>
								<Grid.Column width={2}>
									<Image circular src={ this._white_image }/>
								</Grid.Column>
								<Grid.Column width={2}>
									<Image circular src={ this._white_image }/>
								</Grid.Column>
								<Grid.Column width={2}>
									<Image circular src={ this._white_image }/>
								</Grid.Column>
								<Grid.Column width={2}>
									<Image circular src={ this._white_image }/>
								</Grid.Column>
								<Grid.Column width={2}>
									<Image circular src={ this._white_image }/>
								</Grid.Column>
								<Grid.Column width={2}>
									<Image circular src={ this._white_image }/>
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
					                <p style={{ fontSize: '1.33em' }}>Wall mounted or Portable</p>
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

				<Segment style={ styles.featureSegment }>
					<Container>
						<Header as='h3' style={{ fontSize: '2em' }}>Monitoring</Header>
						<br/>
						<Grid>
							<Grid.Row>
								<Grid.Column floated='left' width={6}>
	                                <Image size='large' src={ this._dashboard } />
	                            </Grid.Column>
	                            <Grid.Column width={8}>
	                                <p style={{ fontSize: '1.33em' }}>
										Give your staff the ability to monitor live status of the hotel.
										<br/>
										Provide them with insights and information
										that will make them more efficient, and help improve the overall exerience for your guests.
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