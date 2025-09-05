import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/database';

// POST - Toggle like on a post
export async function POST(request: NextRequest) {
  try {
    const { postId, userId, type = 'post' } = await request.json();
    
    if (!postId || !userId) {
      return NextResponse.json(
        { error: 'PostId and userId are required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    if (type === 'post') {
      // Check if user already liked the post
      const [existingLike] = await connection.execute(
        'SELECT id FROM mur_post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      
      if ((existingLike as any[]).length > 0) {
        // Unlike the post
        await connection.execute(
          'DELETE FROM mur_post_likes WHERE post_id = ? AND user_id = ?',
          [postId, userId]
        );
        
        connection.release();
        return NextResponse.json({ 
          success: true, 
          liked: false,
          message: 'Post unliked successfully' 
        });
      } else {
        // Like the post
        await connection.execute(
          'INSERT INTO mur_post_likes (post_id, user_id) VALUES (?, ?)',
          [postId, userId]
        );
        
        connection.release();
        return NextResponse.json({ 
          success: true, 
          liked: true,
          message: 'Post liked successfully' 
        });
      }
    } else if (type === 'comment') {
      // Check if user already liked the comment
      const [existingLike] = await connection.execute(
        'SELECT id FROM mur_comment_likes WHERE comment_id = ? AND user_id = ?',
        [postId, userId] // postId is actually commentId here
      );
      
      if ((existingLike as any[]).length > 0) {
        // Unlike the comment
        await connection.execute(
          'DELETE FROM mur_comment_likes WHERE comment_id = ? AND user_id = ?',
          [postId, userId]
        );
        
        connection.release();
        return NextResponse.json({ 
          success: true, 
          liked: false,
          message: 'Comment unliked successfully' 
        });
      } else {
        // Like the comment
        await connection.execute(
          'INSERT INTO mur_comment_likes (comment_id, user_id) VALUES (?, ?)',
          [postId, userId]
        );
        
        connection.release();
        return NextResponse.json({ 
          success: true, 
          liked: true,
          message: 'Comment liked successfully' 
        });
      }
    }
    
    connection.release();
    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

// GET - Check if user liked a post or comment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const commentId = searchParams.get('commentId');
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    if (postId) {
      // Check if user liked the post
      const [like] = await connection.execute(
        'SELECT id FROM mur_post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      
      connection.release();
      return NextResponse.json({ 
        liked: (like as any[]).length > 0 
      });
    } else if (commentId) {
      // Check if user liked the comment
      const [like] = await connection.execute(
        'SELECT id FROM mur_comment_likes WHERE comment_id = ? AND user_id = ?',
        [commentId, userId]
      );
      
      connection.release();
      return NextResponse.json({ 
        liked: (like as any[]).length > 0 
      });
    }
    
    connection.release();
    return NextResponse.json(
      { error: 'PostId or commentId is required' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}
