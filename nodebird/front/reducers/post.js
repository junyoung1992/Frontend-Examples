import {
  ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE, ADD_POST_REQUEST, ADD_POST_SUCCESS,
} from '../stringLabel/action';

export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: '김준영',
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스',
    Images: [
      { src: 'https://blog.kakaocdn.net/dn/v3FCz/btq5gFqsH4j/f2ETyx8RRSfdrfE3zSZuE0/img.jpg' },
      { src: 'https://blog.kakaocdn.net/dn/v48mT/btq5gxe1JBp/iH7xWYNgMc3W7zIrhIkB7K/img.jpg' },
      { src: 'https://blog.kakaocdn.net/dn/cvlei7/btq5tx68El2/mbfae2ISIlr5sApDC0Fu3K/img.jpg' },
    ],
    Comments: [{
      User: {
        nickname: '강광배',
      },
      content: '우와',
    }, {
      User: {
        nickname: '혜원',
      },
      content: '광배',
    }],
  }],
  imagePaths: [], // 이미지 경로
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
};

const dummyPost = {
  id: 2,
  content: '더미데이터입니다.',
  User: {
    id: 2,
    nickname: '김준영',
  },
  Images: [],
  Comments: [],
};

export const addPostRequestAction = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addCommentRequestAction = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        addPostLoading: false,
        addPostDone: true,
        mainPosts: [dummyPost, ...state.mainPosts],
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        addCommentLoading: false,
        addCommentDone: true,
      };
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
