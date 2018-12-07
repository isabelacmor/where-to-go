import React, { Component } from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

class RadiusInput extends Component {
    constructor () {
        super();

        this.state = { sliderRadiusValue: 1000 };
    }

    handleRadiusChange = v => {
        this.props.onGotRadiusChange(this.state.sliderRadiusValue);
    };

    componentDidMount () {
        this.setState({ sliderRadiusValue: parseInt(this.props.radius) });
    }

    
    render () {
        return(
            <InputRange
                    formatLabel={sliderRadiusValue => `${sliderRadiusValue}m`}
                    maxValue={50000}
                    minValue={1000}
                    step={1000}
                    value={this.state.sliderRadiusValue}
                    onChange={sliderRadiusValue => this.setState({ sliderRadiusValue })}
                    onChangeComplete={this.handleRadiusChange} />
        );
    }
}

export default RadiusInput;