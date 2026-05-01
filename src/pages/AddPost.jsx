import React from 'react'
import { Container, PostForm } from '../components'

function AddPost() {
  return (
    <div className='py-10'>
      <Container>
        <div className="mb-8 animate-fade-in">
          <h1 
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-taupe)' }}
          >
            Create Post
          </h1>
          <div className="w-12 h-0.5 mt-2" style={{ background: 'var(--color-burgundy)' }}></div>
        </div>
        <div className="animate-slide-up">
          <PostForm />
        </div>
      </Container>
    </div>
  )
}

export default AddPost