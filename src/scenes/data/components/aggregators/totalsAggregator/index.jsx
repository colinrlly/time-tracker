import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setAggTotals,
} from '../../../../../redux/actions/actions';
import {
    getDurations,
    totalsAggregator,
} from './helpers';

function TotalsAggregator(props) {
    const eventsWithDuration = getDurations(props.list);
    const totals = totalsAggregator(eventsWithDuration);

    props.setAggTotals(totals);

    return null;
}

const mapStateToProps = (state) => ({
    list: state.list,
});

const mapDispatchToProps = {
    setAggTotals,
};

TotalsAggregator.propTypes = {
    list: PropTypes.array.isRequired,
    setAggTotals: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(TotalsAggregator);
