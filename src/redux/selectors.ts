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
