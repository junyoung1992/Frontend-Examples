import { useState, useCallback } from 'react';

// 범용적으로 쓸 수 있도록 변수 명명
export default (initialValue = null) => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  // useState 와 useCallback 을 둘 다 사용하니까
  // setValue 대신 handler 를 리턴
  return [value, handler, setValue];
};
