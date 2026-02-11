import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/user-dashboard', () => {
    return HttpResponse.json({
      user: { name: 'John Doe', email: 'john@example.com' },
      stats: { posts: 42, followers: 1200, following: 350 },
    })
  }),
]
