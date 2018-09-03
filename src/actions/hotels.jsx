import { createActionThunk } from 'redux-thunk-actions';

const fetchHotelsData = createActionThunk('FETCH', () => fetch(`${process.env.WT_READ_API}/hotels`).then(data => data.json()));

const actions = {
  fetchHotelsData,
};

export default actions;
