import { NextResponse } from 'next/server';

export async function GET() {
  // Simulating a small delay to make the loading state visible
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    user: { 
      name: 'John Doe', 
      email: 'john@example.com' 
    },
    stats: { 
      posts: 42, 
      followers: 1200, 
      following: 350 
    },
  });
}
