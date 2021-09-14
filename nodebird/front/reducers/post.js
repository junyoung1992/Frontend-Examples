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
      {src: "https://w.namu.la/s/ec342db8ac95ebbd7f5905ce52e569eb6c755d8d1e2cf5f5861f235f11a8f8e2ed0ac86d6489ba6138b6b2dd88eae3bfa9dbddd156d1f174b77bf0fddc59964ab6ea57cb57fa9f9efd9677895b3529716214d84f396c6df3083df553b8a12340"},
      {src: "https://w.namu.la/s/a15e02f7c201f40f592838a125932bd79f7f66804ee38a02bc1ce0192a0aead7eb689983f9817ec01b121036e68b3f1c43946cc2c8501288ecb019ecd5645c4f905e3053ed14baf8bb90893b0efe560d6a789c12c8cc24d72be475c82d1bfecdc474f198c364219e10f1fd1baeb20291"},
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
    nickname: '박수현',
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