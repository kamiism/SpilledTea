import { useParams } from "react-router-dom"


function User() {
    const {id} = useParams()
  return (
    <div className="flex justify-center bg-amber-50 text-3xl font-bold">User : {id} </div>
  )
}

export default User