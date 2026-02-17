import { useEffect, useState } from "react";

function Github() {
    const [data,setData] = useState([])
    useEffect(()=>{
        fetch('https://api.github.com/users/kamiism')
        .then(response => response.json())
        .then(data =>
        {
            console.log(data);
            setData(data)
        })
    },[])


  return (
    <div className='text-center m-4 bg-amber-50 text-2xl p-4'>Github followers : {data.followers} 
    <img className="text-center" src={data.avatar_url} alt="Git Pfp" width={300} />
    </div>
  )
}

export default Github

export const githubInfoLoader = async () => {
    const response = await fetch('https://api.github.com/users/kamiism')
    return response.json
}