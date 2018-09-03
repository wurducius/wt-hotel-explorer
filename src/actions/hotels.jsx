import { createActionThunk } from 'redux-thunk-actions';

const fetchHotelsData = createActionThunk('FETCH', () => fetch(`${process.env.WT_READ_API}/hotels`).then((data) => {
  console.log(data);
  return data.json();
}));

export default {
  fetchHotelsData,
};
