// IE 11 에서 실행되지 않던 문제 해결
import produce, { enableES5 } from 'immer';

export default (...args) => {
  enableES5();
  return produce(...args);
};
