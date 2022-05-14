import { useEffect, useState } from "react";
import "../styles.css"

function CreateGroup({loginSecret, fetchGroups}) {

    const [name, setName] = useState("");
    const [place_id, setPlace_id ] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const group = {place_id, name}
        
        fetch("https://api.kisi.io/groups", {
            method: "POST",
            headers: ({
                "Content-Type": "application/json",
                "Authorization": `KISI-LOGIN ${loginSecret}`,
              }),
              body: JSON.stringify(group)
        })
        .then(() => {
            console.log("new group created: ", group)
            fetchGroups()
            setName("")
        })
    }

    const createGroup = async () => {
        const response = await fetch("https://api.kisi.io/groups" 
          + new URLSearchParams({limit: 10, offset: 0}).toString() , {
          method: "POST",
          headers: ({
            "Content-Type": "application/json",
            "Authorization": `KISI-LOGIN ${loginSecret}`,
          }),
          body: JSON.stringify()
        })
        .then(response => {
          if(response.ok){
            return response.json()
          }
          throw response;
        })
        .then(data => {
          setData(data);
          setGroups(data);
          console.log(data);
        })
        .catch(error => {
          console.log("Error fetching data: ", error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        })
      }


    // console.log("loginSecret from CreateGroup: ", loginSecret)
  return (
    <div className='flex-row-reverse'>
        <form onSubmit={handleSubmit} >
            <input
                type="text"
                required
                placeholder='Group name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            >

            </input>
            <button className="btn btn-secondary">Add Group</button>
        </form>
    </div>
  )
}

export default CreateGroup