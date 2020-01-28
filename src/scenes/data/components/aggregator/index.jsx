import { connect } from 'react-redux';
import {
    setAggTotals,
} from '../../../../redux/actions/actions';

function Aggregator(props) {
    props.setAggTotals({ hello: 'hello' });

    return null;
}

const mapStateToProps = (state) => ({
    list: state.list,
});

const mapDispatchToProps = {
    setAggTotals,
};

export default connect(mapStateToProps, mapDispatchToProps)(Aggregator);
