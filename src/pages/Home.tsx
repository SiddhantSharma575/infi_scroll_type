import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";

type BookType = {
  title : string,
  url : string,
  created_at : string,
  author : string,
  _tags : string[]
}

const Home : React.FC = () => {
  const [currpage,setCurrPage] = useState<number>(48);
  const [allPosts, setAllPosts] = useState<BookType[]>([])
  const [loading,setLoading] = useState<boolean>(false); 
  const [inputVal,setInputVal] = useState<string>("");
  const [limitReach,setLimitReach] = useState<boolean>(false);
  const navigate = useNavigate();
  

  let filteredArray : BookType[] = allPosts;


  useEffect(() => {
    setLoading(true);
    const fetchApi = async() => {
      await axios.get(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${currpage}`)
      .then((response) => {
        setAllPosts(response.data.hits);
        setLoading(false);
      }).catch((error) => {
        console.log("Bad Request")
        setLoading(false); 
      })
    }
    fetchApi();
    window.addEventListener("scroll",handleScroll);
  },[])

    const handleScroll = (e : any) => {
    let top = e.target.documentElement.scrollTop;
    let ihei = window.innerHeight;
    let hei = e.target.documentElement.scrollHeight;

    if (top + ihei >= hei) {
      setCurrPage((prev) => prev + 1);
    }
  };



  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrPage(currpage + 1);
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, [currpage]);

  useEffect(() => {
    let temp :BookType[] = [];
   
    if (currpage !== 0 && limitReach === false) {
       setLoading(true);
      const res = async () => {
        await axios
          .get(
            `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${currpage}`
          )
          .then((response) => {
            temp = response.data.hits;
            setLoading(false);
          })
          .catch((error) => {
            // setError("404 BAD REQUEST");
            setLoading(false);
          });
        // if (temp.length === 0) setLimitReach(true);
        if(temp.length === 0) { 
          setLoading(false);
          setLimitReach(true);
        }
        if (temp.length !== 0) {
          setAllPosts([...allPosts, ...temp]);
        }
      };
      res();
      
    }
  }, [currpage]);

  useEffect(() => {
    console.log(allPosts);
  }, [allPosts])

  if(inputVal.length > 0){
    const newPost : BookType[] = [...allPosts];
    filteredArray = newPost.filter((curr) => curr.author.toLowerCase().includes(inputVal.toLowerCase()) || curr.title.toLowerCase().includes(inputVal.toLowerCase()));

  }

  return (
    <>
      <div className="search_container">
            <input
              type="text"
              placeholder="Enter title or Author"
              value={inputVal}
              onChange={(e : React.FormEvent<HTMLInputElement>) => setInputVal(e.currentTarget.value)}
            />
      </div>
     <div className='post_container'>
        {
          filteredArray.length === 0 && currpage !== 0 ? <h1>NOT FOUND</h1> : filteredArray.map((post) => (
            <div className='each_post' onClick={() => navigate(`/${post.title}`, {
              state : {
                post : post
              }
            })}>
            <h4> Title : {post.title}</h4>
             <p>
                Auhtor URL :{" "}
                <a href={post.url} target="">
                 Author Link
                </a>{" "}
             </p>
             <p>Created At : {post.created_at.substring(0,10)}</p>
             <p>Tags : {post._tags.map((tag) => <span>{tag}</span>)}</p>
             <p>Author : {post.author}</p>
        </div>
          ))
        }
        {loading && <h1>Loading....</h1>}
        {limitReach && <h1>Exceeded the limit</h1>}
     </div>
    </>
  )
}

export default Home;