import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setAggTotals,
    setAggTotalTime,
} from '../../../../redux/actions/actions';
import {
    totalsAggregator,
    listFilter,
    totalTimeAggregator,
    getDurations,
} from './helpers';

function Aggregator(props) {
    const list = listFilter(props.list, props.names);
    const eventsWithDuration = getDurations(list);
    const totals = totalsAggregator(eventsWithDuration);
    const totalTime = totalTimeAggregator(eventsWithDuration);

    props.setAggTotals(totals);
    props.setAggTotalTime(totalTime);

    return null;
}

const mapStateToProps = (state) => ({
    list: state.list,
    names: state.names,
});

const mapDispatchToProps = {
    setAggTotals,
    setAggTotalTime,
};

Aggregator.propTypes = {
    list: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired,
    setAggTotals: PropTypes.func.isRequired,
    setAggTotalTime: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Aggregator);
