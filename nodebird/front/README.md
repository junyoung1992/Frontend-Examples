# NodeBird - Front

## Frameworks & Libraries

- React
    - <https://ko.reactjs.org/>
- Next.js
    - <https://nextjs.org/>
- prop-types: Type Check
    - <https://www.npmjs.com/package/prop-types>
- Ant Design: UI
    - <https://ant.design/>
- styled-components: CSS
    - <https://styled-components.com/>
- Redux
    - <https://ko.redux.js.org/>
    - 코드량이 많기 때문에 생산성 측면에서 Redux 공부 후 **Mobx**로 넘어가는 것을 추천
- Next Redux Wrapper
    - <https://github.com/kirill-konshin/next-redux-wrapper>
- React Slick: 이미지 Slider 개발용
    - <https://react-slick.neostack.com>
- Redux Thunk: Redux가 비동기 액션을 dispatch 할 수 있도록 도와줌
    - 여러 개의 dispatch 를 불러올 수 있음
    - 하나의 비동기 액션 안에 여러 개의 동기 액션을 넣을 수도 있음
- Redux Saga
    - <https://redux-saga.js.org>
- Axios
    - <https://axios-http.com>
    - HTTP 통신 라이브러리
    - fetch를 써도 되긴 하는데 강의에서 axios 씀
- Short ID
    - 겹치기 힘든 아이디 값 생성
- immer
    - 불변성 처리
    - immutable.js보다 편함
- Faker
    - 각종 더미데이터 생성
- Babel Plugin Styled Components
    - CSS 서버사이드 렌더링을 위해 사용
- SWR
    - Redux 에서 사용하는 action 을 간단하게 만들어 줌

```
npm install \
    next react react-dom prop-types \
    antd @ant-design/icons styled-components \
    next-redux-wrapper react-redux \
    react-slick \
    redux-saga axios shortid immer faker \
    babel-plugin-styled-components swr \
    --save
```

```
npm install -D 
    eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks \
    babel-eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-react-hooks eslint-plugin-jsx-a11y\
    redux-devtools-extension
```