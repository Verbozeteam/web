import React from 'react';
import FeaturesPanels from './FeaturesPanels';
import type PanelType from './FeaturesPanels';

type PropsType = {
    expanded?: boolean,
};

type StateType = {};

export default class HotelFeaturesPanels extends React.Component<PropsType, StateType> {
    _panels: Array<PanelType> = [
      {
          name: 'Modernizing Control',
          image: require('../../assets/images/modernizing_control_panel.jpg'),
          link: '/modernizing-control'
      },
      {
        name: 'Empowering Guests',
        image: require('../../assets/images/empowering_guests_panel.jpg'),
        link: '/empowering-guests'
      },
      {
        name: 'Reimagining Hotels',
        image: require('../../assets/images/reimagining_hotels_panel.jpg'),
        link: '/reimagining-hotels'
      },
      {
        name: 'Adopting Verboze',
        image: require('../../assets/images/adopting_verboze_panel.jpg'),
        link: '/adopting-verboze'
      }
    ];

    render() {
        return (
            <FeaturesPanels
                expanded={this.props.expanded}
                panels={this._panels}/>
        );
    }
};