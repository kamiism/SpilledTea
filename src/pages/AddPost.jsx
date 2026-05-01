import React from 'react'
import { Container, PostForm } from '../components'

function AddPost() {
  return (
    <div className='py-10 bg-[var(--color-eva-black)] min-h-[80vh]'>
      <Container>
        <div className="animate-slide-up">
          <PostForm />
        </div>
      </Container>
    </div>
  )
}

export default AddPost