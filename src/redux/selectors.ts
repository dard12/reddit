import { createSelector } from 'redux-starter-kit';
import _ from 'lodash';

export const userSelector = createSelector({ user: 'login.id' });
export const usernameSelector = createSelector({ username: 'login.username' });

export const createCollectionSelector = (collectionName: string) => {
  return createSelector({ [collectionName]: `collections.${collectionName}` });
};

export const createDocSelector = ({
  collection,
  id,
  prop,
}: {
  collection: string;
  id: string;
  prop: string;
}) => {
  return createSelector(
    [
      createCollectionSelector(collection),
      (state: any, props: any) => props[id],
    ],
    (collections, docId) => ({
      [prop]: _.get(collections[collection], docId),
    }),
  );
};

export const createDocListSelector = ({
  collection,
  filter,
  prop,
}: {
  collection: string;
  filter: string;
  prop: string;
}) => {
  return createSelector(
    [
      createCollectionSelector(collection),
      (state: any, props: any) => props[filter],
    ],
    (collections, filterObj) => {
      const collectionDict = collections[collection];
      const docList = _.filter(collectionDict, filterObj);

      return { [prop]: docList };
    },
  );
};
