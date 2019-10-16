import bigint from 'big-integer';
import _ from 'lodash';

export default function getId() {
  return _.toNumber(bigint.randBetween('0', '9223372036854775807'));
}
