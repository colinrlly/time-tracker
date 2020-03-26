import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setAggTotals,
} from '../../../../../redux/actions/actions';
import {
    aggregateStackedTotals,
} from './helpers';

function StackedTotalsAggregator(props) {
    if (Object.keys(props.names).length !== 0 && props.names.constructor === Object) {
        const totals = aggregateStackedTotals(
            props.list,
            props.startDateTime,
            props.endDateTime,
            props.names,
        );
    }

    return null;
}

const mapStateToProps = (state) => ({
    list: state.list,
    names: state.names,
    startDateTime: state.range.startDateTime,
    endDateTime: state.range.endDateTime,
});

const mapDispatchToProps = {
    setAggTotals,
};

StackedTotalsAggregator.propTypes = {
    list: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired,
    startDateTime: PropTypes.object.isRequired,
    endDateTime: PropTypes.object.isRequired,
    setAggTotals: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StackedTotalsAggregator);
