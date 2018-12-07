import React, { Component } from 'react';
import TimePicker from 'react-bootstrap-time-picker';

class TimeInput extends Component {
    constructor () {
        super();

        // Set the default time as the current time rounded to the nearest half hour
        // This logic also rounds to the next hour if the minutes would equal 60
        let now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
        this.state = { time: now.getHours() + ":" + now.getMinutes() };

        this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    handleTimeChange (time) {
        this.setState({time : time});
        this.props.onGotNewCloseTime({ hours : Math.floor(time/60/60), minutes : (time/60) % 60 });
    }
    
    render () {
        return(
            <TimePicker
                step={30}
                onChange={this.handleTimeChange}
                value={this.state.time} />
        );
    }
}

export default TimeInput;