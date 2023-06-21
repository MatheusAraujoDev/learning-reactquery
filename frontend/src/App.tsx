import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'

export interface IData {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

const getUser = async (id: number) => {
  const request = await fetch(`https://reqres.in/api/users/${id}?delay=1`)
  const response = await request.json()

  if (!request.ok) {
    throw new Error(response.error)
  }

  return response.data as IData
}

function App() {
  const [currentUserId, setCurrentUserId] = useState(1)
  const { data, isError, isLoading, isFetching } = useQuery(
    ['users', currentUserId],
    () => getUser(currentUserId),
    { staleTime: 10 * 1000 }, // tempo para revalidar se os dados em cache estão atualizados
  )

  if (isError) {
    return (
      <section>
        <p>Something went wrong 😕</p>
      </section>
    )
  }

  if (!data || isLoading) {
    return (
      <section>
        <p>Loading ...</p>
      </section>
    )
  }

  return (
    <section>
      <img src={data.avatar} alt="Profile Picture" />
      <p>
        {data.first_name}, {data.last_name} ({data.id})
      </p>
      <p>{data.email}</p>

      <div>
        <button onClick={() => setCurrentUserId((prev) => prev - 1)}>
          Prev
        </button>
        <button onClick={() => setCurrentUserId((prev) => prev + 1)}>
          Next
        </button>
      </div>

      {isFetching && <small>We are revalidating your data...</small>}
    </section>
  )
}

export default App

// fake API utilizada no projeto https://reqres.in/
// docs React Query https://tanstack.com/query/v4/docs/react/quick-start
