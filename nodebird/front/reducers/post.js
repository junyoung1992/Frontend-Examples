export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: '김준영',
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스',
    Images: [
      {src: "https://w.namu.la/s/6f3147ad9ff270a34b91569a05f2d67d81c3b6b8d2e317d67365c92cbc6c9ca51ed28a1a92bf9e02f27a151fd95daf81bc03c835661e1bf9fd8d35f264fe84a17f86ebbbc4be963c29884ad73bf28fe30cee3d793d7dd4fb93869a911ceac5bd"},
      {src: "https://w.namu.la/s/6f3147ad9ff270a34b91569a05f2d67d81c3b6b8d2e317d67365c92cbc6c9ca51ed28a1a92bf9e02f27a151fd95daf81bc03c835661e1bf9fd8d35f264fe84a17f86ebbbc4be963c29884ad73bf28fe30cee3d793d7dd4fb93869a911ceac5bd"},
      {src: "https://w.namu.la/s/6f3147ad9ff270a34b91569a05f2d67d81c3b6b8d2e317d67365c92cbc6c9ca51ed28a1a92bf9e02f27a151fd95daf81bc03c835661e1bf9fd8d35f264fe84a17f86ebbbc4be963c29884ad73bf28fe30cee3d793d7dd4fb93869a911ceac5bd"},
    ],
    Comments: [{
      User: {
        nickname: 'nero',
      },
      content: '우와',
    }, {
      User: {
        nickname: 'hero',
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