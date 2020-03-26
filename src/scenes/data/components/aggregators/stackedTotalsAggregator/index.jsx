import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setAggTotals,
} from '../../../../../redux/actions/actions';
import {
    aggregateStackedTotals,
} from './helpers';
import {
    getDurations,
} from '../helpers';

function StackedTotalsAggregator(props) {
    const eventsWithDuration = getDurations(props.list);
    const totals = aggregateStackedTotals(eventsWithDuration, props.startDateTime, props.endDateTime);

    return null;
}

const mapStateToProps = (state) => ({
    list: state.list,
    startDateTime: state.range.startDateTime,
    endDateTime: state.range.endDateTime,
});

const mapDispatchToProps = {
    setAggTotals,
};

StackedTotalsAggregator.propTypes = {
    list: PropTypes.array.isRequired,
    startDateTime: PropTypes.object.isRequired,
    endDateTime: PropTypes.object.isRequired,
    setAggTotals: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StackedTotalsAggregator);
