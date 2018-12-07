import React, { Component } from 'react';
import MultiSelect from '@khanacademy/react-multi-select';
import './MultiselectTag.css';

// TODO: potentially pull this out into a separate file
// TODO: reshape this data
const options = [
    { value: 1, label: "Restaurants", code: ["restaurant"] },
    { value: 2, label: "Points of interest", code: ["point_of_interest"]},
    { value: 3, label: "Bars", code: ["bar"] },
    { value: 4, label: "Clubs", code: ["night_club"] },
    { value: 5, label: "Aquariums", code: ["aquarium"] },
    { value: 6, label: "Amusement parks", code: ["amusement_park"] },
    { value: 7, label: "Art galleries", code: ["art_gallery"] },
    { value: 8, label: "Bakeries", code: ["bakery"] },
    { value: 9, label: "Cafes", code: ["cafe"] },
    { value: 10, label: "Bookstores", code: ["book_store"] },
    { value: 11, label: "Casinos", code: ["casino"] },
    { value: 12, label: "Stores", code: ["clothing_store", "convenience_store", "department_store", "electronics_store", "home_goods_store", "jewelry_store", "pet_store", "shopping_mall", "shoe_store", "store"] },
    { value: 13, label: "Museums", code: ["museum"] },
    { value: 14, label: "Zoos", code: ["zoo"] },
    { value: 15, label: "Nature", code: ["natural_feature"] },
];

const styles = {
    chip: {
        margin: 2,
        marginRight: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        maxHeight: '100%',
    },
};

class MultiselectTags extends Component {
    constructor (props) {
        super(props);

        this.state = {
            selectedOptions: this.props.typesOfPlaces
        };
    }

    handleSelectedChanged = (selectedOptions) => (
        this.setState({ selectedOptions }, () => {
            this.props.onTypeOfPlacesChanged(selectedOptions);
        })
    )

    handleUnselectItem = (removedVal) => () => (
        this.setState({
        selectedOptions: this.state.selectedOptions
            .filter(option => option !== removedVal)
        })
    )

    renderOption = ({ checked, option, onClick }) => (
        // Potentially replace this with a new component for styling
        <span>
            <span>
                {option.label}
            </span>
            
            <input
                type="checkbox"
                onChange={onClick}
                checked={checked}
                tabIndex="-1"
                className="checkboxOption"
            />
        </span>
    )

    renderSelected = (selected, options) => {
        if (!options.length) {
        return <span>No types available</span>;
        }

        if (!selected.length) {
        return <span>Select types of places ({options.length} available)</span>;
        }

        if (selected.length === options.length) {
        return <span>All types</span>;
        }

        if (selected.length > 3) {
        return <span>Selected {selected.length} types</span>;
        }

        return (
        <div style={styles.wrapper}>
            {selected.map(value => (
            <span key={value}>{options.find(o => value === o.value).label}, </span>
            ))}
        </div>
        )
    }

    render() {
        const { selectedOptions } = this.state;

        return (
            <div>
                <MultiSelect
                    options={options}
                    selected={selectedOptions}
                    ItemRenderer={this.renderOption} 
                    valueRenderer={this.renderSelected}
                    onSelectedChanged={this.handleSelectedChanged}
                />
            </div>
        );
    }
}

export default  MultiselectTags;