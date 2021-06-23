import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setAggFilteredTotals,
} from '../../../../../redux/actions';

function FilteredTotalsAggregator(props) {
    useEffect(() => {
        const filteredTotals = (Object.keys(props.names).length !== 0)
            ? props.totals.filter(
                (activity) => props.names[activity.name].selected,
            ) : [];

        props.setAggFilteredTotals(filteredTotals);
    }, [props.totals, props.names]);

    return null;
}

const mapStateToProps = (state) => ({
    totals: state.aggregations.totals,
    names: state.names,
});

const mapDispatchToProps = {
    setAggFilteredTotals,
};

FilteredTotalsAggregator.propTypes = {
    totals: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired,
    setAggFilteredTotals: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilteredTotalsAggregator);
