import { connect } from 'react-redux';
import {
    setAggTotals,
} from '../../../../redux/actions/actions';
import {
    totalsAggregator,
} from './helpers';

function Aggregator(props) {
    const totals = totalsAggregator(props.list);

    props.setAggTotals(totals);

    return null;
}

const mapStateToProps = (state) => ({
    list: state.list,
});

const mapDispatchToProps = {
    setAggTotals,
};

export default connect(mapStateToProps, mapDispatchToProps)(Aggregator);
