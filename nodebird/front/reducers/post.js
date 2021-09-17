export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: '김준영',
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스',
    Images: [
      {src: "https://blog.kakaocdn.net/dn/v3FCz/btq5gFqsH4j/f2ETyx8RRSfdrfE3zSZuE0/img.jpg"},
      {src: "https://blog.kakaocdn.net/dn/v48mT/btq5gxe1JBp/iH7xWYNgMc3W7zIrhIkB7K/img.jpg"},
      {src: "https://blog.kakaocdn.net/dn/cvlei7/btq5tx68El2/mbfae2ISIlr5sApDC0Fu3K/img.jpg"},
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
    }]
  }],
  imagePaths: [], // 이미지 경로
  postAdded: false, // 게재 완료시 true
}

const ADD_POST = 'ADD_POST';
export const addPost = {
  type: ADD_POST,
}
const dummyPost = {
  id: 2,
  content: '더미데이터입니다.',
  User: {
    id: 2,
    nickname: '김준영',
  },
  Images: [],
  Comments: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      }
    default:
      return state;
  }
}

export default reducer;