import _ from 'lodash';
import { createReducer } from 'redux-starter-kit';
import { loginAction, logoutAction, loadDocsAction } from './actions';

interface LoginInterface {
  token: string | null;
  id: string | null;
  username: string | null;
}

interface treeNode {
  children: string[];
  parentId?: string;
  subTreeCount: number;
  responseTotal?: number;
  metaTotal?: number;
}
interface Tree {
  [nodeId: string]: treeNode;
}

interface CollectionsInterface {
  [name: string]: { [docId: string]: any };
}

export const loginReducer = createReducer<LoginInterface>(
  {
    token: localStorage.getItem('token'),
    id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
  },
  {
    [loginAction.type]: (state, action) => {
      const { token, id, username } = action.payload;
      state.token = token;
      state.id = id;
      state.username = username;
      localStorage.removeItem('redirect');
    },

    [logoutAction.type]: (state, action) => {
      state.token = null;
      state.id = null;
      state.username = null;
    },
  },
);

export const collectionsReducer = createReducer<CollectionsInterface>(
  {},
  {
    [loadDocsAction.type]: (state, action) => {
      const { docs, name } = action.payload;

      _.each(docs, doc => {
        if (name === 'comment_votes') {
          state[name] = { ...state[name], [doc.comment_id]: doc };
        } else if (name === 'question_votes') {
          state[name] = { ...state[name], [doc.question_id]: doc };
        } else if (name === 'users') {
          state[name] = { ...state[name], [doc.id]: doc, [doc.user_name]: doc };
        } else {
          state[name] = { ...state[name], [doc.id]: doc };
        }
      });
    },
  },
);

export const commentTreeReducer = createReducer<CollectionsInterface>(
  {},
  {
    [loadDocsAction.type]: (state, action) => {
      const { docs, name } = action.payload;

      if (name === 'comments') {
        const questionId = docs[0].question_id;
        // instantiate tree
        if (!state[questionId]) {
          const rootNode: treeNode = {
            children: [],
            parentId: '',
            subTreeCount: 0,
          };

          const newTree: Tree = { [questionId]: rootNode };
          state[questionId] = newTree;
        }
        const newComments = _.filter(docs, d => !state[questionId][d.id]);

        if (newComments.length > 0) {
          // extend trees
          buildTree(state[questionId], docs);
          updateTreeCounts(state[questionId], docs);
        }
      }
    },
  },
);

function buildTree(treeStore: { [nodeId: string]: treeNode }, docs: any) {
  _.each(docs, commentDoc => {
    const id = commentDoc.id;
    let parentId = commentDoc.parent_id;
    if (parentId === id) {
      parentId = commentDoc.question_id;
    }
    const childNode = treeStore[id];
    const parentNode = treeStore[parentId];

    if (!childNode) {
      treeStore[id] = {
        children: [],
        parentId,
        subTreeCount: 0,
      };
    }
    if (!parentNode) {
      treeStore[parentId] = {
        children: [],
        subTreeCount: 0,
      };
    }
    treeStore[parentId].children.push(id);
    treeStore[parentId].children = _.union(treeStore[parentId].children);
    treeStore[id].parentId = parentId;
  });
}

function updateTreeCounts(
  treeStore: { [nodeId: string]: treeNode },
  docs: any,
) {
  if (docs.length === 1) {
    let curId = docs[0].id;
    const leaf = treeStore[curId];
    if (leaf.children.length === 0) {
      treeStore[curId].subTreeCount = 0;
      curId = leaf.parentId;
      while (treeStore[curId] && curId !== treeStore[curId].parentId) {
        treeStore[curId].subTreeCount += 1;
        curId = treeStore[curId].parentId;
      }
      return;
    }
  }
  const rootId: string = docs[0].question_id;
  const handled: { [nodeId: string]: boolean } = { [rootId]: false };
  const stack = [rootId];
  let prevNode = null;
  while (stack.length > 0) {
    const curId = stack[stack.length - 1];
    const curNode = treeStore[curId];
    const subTreeFinished = _.every(curNode.children, c => handled[c]);

    if (subTreeFinished) {
      let subTreeCnt = 0;
      _.each(curNode.children, cid => {
        subTreeCnt += treeStore[cid].subTreeCount + 1;
      });
      treeStore[curId].subTreeCount = subTreeCnt;
      handled[curId] = true;
      stack.pop();
    } else {
      if (prevNode === curNode) {
        break;
      }
      _.each(curNode.children, cid => {
        if (!_.has(handled, cid)) {
          stack.push(cid);
        }
      });
      prevNode = curNode;
    }
  }
}
