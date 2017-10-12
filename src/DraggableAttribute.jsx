import React from 'react';
import PropTypes from 'prop-types';

class DraggableAttribute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false, top: 0, left: 0, filterText: ''};
    }

    onCheckboxChange(value, checked) {
        if (checked) {
            this.props.removeValuesFromFilter(this.props.name, [value]);
        }
        else {
            this.props.addValuesToFilter(this.props.name, [value]);
        }
    }

    matchesFilter(x) {
        return x.toLowerCase().trim().includes(this.state.filterText.toLowerCase().trim())
    }

    getFilterBox() {
        return (
            <div className="pvtFilterBox" style={{
                display: 'block', cursor: 'initial',
                top: this.state.top + 'px', left: this.state.left + 'px'}}
            >
                <a onClick={() => this.setState({open: false})}
                    style={{position: 'absolute', right: '5px', top: '5px', fontSize: '18px', cursor: 'pointer'}}
                >×</a>
                <h4>{this.props.name}</h4>
                <p>
                    <input type="text" placeholder="Filter values" className="pvtSearch"
                        value={this.state.filterText}
                        onChange={e => this.setState({filterText: e.target.value})}
                    />
                    <br />
                    <button type="button"
                    onClick={() => this.props.removeValuesFromFilter(this.props.name,
                        Object.keys(this.props.attrValues).filter(this.matchesFilter.bind(this)) )}>
                        Select All
                    </button>
                    <button type="button"
                    onClick={() => this.props.addValuesToFilter(this.props.name,
                        Object.keys(this.props.attrValues).filter(this.matchesFilter.bind(this)) )}>
                        Select None
                    </button>
                </p>

                <div className="pvtCheckContainer">
                    {Object.keys(this.props.attrValues)
                        .sort(this.props.sorter)
                        .filter(this.matchesFilter.bind(this))
                        .map(x =>
                            <label key={x}>
                                <p>
                                    <input type="checkbox"
                                        onChange={e => this.onCheckboxChange(x, e.target.checked)}
                                        checked={!(x in this.props.valueFilter)}
                                    />
                                    {x}
                                </p>
                            </label>)}
                </div>
            </div>);
    }

    render() {
        const filtered = Object.keys(this.props.valueFilter).length !== 0 ? 'pvtFilteredAttribute' : '';
        return <li data-id={this.props.name}>
            <span className={'pvtAttr ' + filtered}>
                {this.props.name}
                <span className="pvtTriangle"
                    onClick={e => this.setState({open: !this.state.open, top: e.clientY, left: e.clientX})}
                > ▾</span>
            </span>

            {this.state.open ? this.getFilterBox() : null}

        </li>;
    }
}


DraggableAttribute.defaultProps = {
    valueFilter: {}
};

DraggableAttribute.propTypes = {
    name: PropTypes.string.isRequired,
    addValuesToFilter: PropTypes.func.isRequired,
    removeValuesFromFilter: PropTypes.func.isRequired,
    attrValues: PropTypes.objectOf(PropTypes.number).isRequired,
    valueFilter: PropTypes.objectOf(PropTypes.bool),
    sorter: PropTypes.func.isRequired
};

export default DraggableAttribute;
