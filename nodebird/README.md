# NodeBird

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
    - fetch를 써도 되긴 하는데 강의에서 axios를 쓰니까 적

```
npm install \
    next react react-dom prop-types \
    antd @ant-design/icons styled-components \
    next-redux-wrapper react-redux \
    react-slick \
    redux-saga axios\
    --save
```

```
npm install -D 
    eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks \
    babel-eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-react-hooks eslint-plugin-jsx-a11y\
    redux-devtools-extension
```