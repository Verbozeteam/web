import React from 'react';
import FeaturesPanels from './FeaturesPanels';
import type PanelType from './FeaturesPanels';

import { URLMap } from './URLMap';

type PropsType = {
    expanded?: boolean,
};

type StateType = {};

export default class HotelFeaturesPanels extends React.Component<PropsType, StateType> {
    _panels: Array<PanelType> = [
      {
          name: 'Modernizing Control',
          image: require('../../assets/images/modernizing_control_panel.jpg'),
          link: URLMap.ModernizingControl,
      },
      {
        name: 'Empowering Guests',
        image: require('../../assets/images/empowering_guests_panel.jpg'),
        link: URLMap.EmpoweringGuests,
      },
      {
        name: 'Reimagining Hotels',
        image: require('../../assets/images/reimagining_hotels_panel.jpg'),
        link: URLMap.ReImaginingHotels,
      },
      {
        name: 'Adopting Verboze',
        image: require('../../assets/images/adopting_verboze_panel.jpg'),
        link: URLMap.AdoptingVerboze
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