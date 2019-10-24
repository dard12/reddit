import bigint from 'big-integer';
import _ from 'lodash';

export default function getId() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const id_list: string[] = [];
  _.each(Array(12), i => {
    id_list.push(alphabet[_.random(0, 35)]);
  });
  return id_list.join('');
}
