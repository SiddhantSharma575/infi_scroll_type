import React from 'react'
import {useLocation} from "react-router-dom";

const Post : React.FC = () => {
  const {state} = useLocation();
  let obj:String = JSON.stringify(state.post);
  return (
    <div>{obj}</div>
  )
}

export default Post;