import React, { useRef, useEffect } from "react";

function usePrevious(value) {
  const ref = useRef();
  if (value === 0) {
    ref.current = 0;
  }
  useEffect(() => {
    if (value != 0) {
      ref.current = value;
    }
  }, [value]);

  return ref.current;
}

export default usePrevious;
