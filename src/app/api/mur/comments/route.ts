import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/database';

// GET - Fetch comments for a specific post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'PostId is required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    const query = `
      SELECT 
        c.*,
        r.company_name as user_name,
        r.email as user_email,
        COUNT(cl.id) as likes_count
      FROM mur_post_comments c
      LEFT JOIN registrations r ON c.user_id = r.id
      LEFT JOIN mur_comment_likes cl ON c.id = cl.comment_id
      WHERE c.post_id = ? AND c.is_deleted = FALSE
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `;
    
    const [comments] = await connection.execute(query, [postId]);
    
    connection.release();
    return NextResponse.json({ comments });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const { postId, userId, content } = await request.json();
    
    if (!postId || !userId || !content) {
      return NextResponse.json(
        { error: 'PostId, userId, and content are required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO mur_post_comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content]
    );
    
    const commentId = (result as any).insertId;
    
    // Fetch the created comment with user info
    const [comment] = await connection.execute(`
      SELECT 
        c.*,
        r.company_name as user_name,
        r.email as user_email
      FROM mur_post_comments c
      LEFT JOIN registrations r ON c.user_id = r.id
      WHERE c.id = ?
    `, [commentId]);
    
    connection.release();
    
    return NextResponse.json({ 
      success: true, 
      comment: (comment as any[])[0],
      message: 'Comment created successfully' 
    });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// PUT - Update a comment
export async function PUT(request: NextRequest) {
  try {
    const { commentId, content, userId } = await request.json();
    
    if (!commentId || !content || !userId) {
      return NextResponse.json(
        { error: 'CommentId, content, and userId are required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Verify user owns the comment
    const [comment] = await connection.execute(
      'SELECT user_id FROM mur_post_comments WHERE id = ? AND is_deleted = FALSE',
      [commentId]
    );
    
    if (!(comment as any[]).length || (comment as any[])[0].user_id !== userId) {
      connection.release();
      return NextResponse.json(
        { error: 'Unauthorized to edit this comment' },
        { status: 403 }
      );
    }
    
    // Update the comment
    await connection.execute(
      'UPDATE mur_post_comments SET content = ? WHERE id = ?',
      [content, commentId]
    );
    
    connection.release();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Comment updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const userId = searchParams.get('userId');
    
    if (!commentId || !userId) {
      return NextResponse.json(
        { error: 'CommentId and userId are required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Verify user owns the comment
    const [comment] = await connection.execute(
      'SELECT user_id FROM mur_post_comments WHERE id = ? AND is_deleted = FALSE',
      [commentId]
    );
    
    if (!(comment as any[]).length || (comment as any[])[0].user_id !== parseInt(userId)) {
      connection.release();
      return NextResponse.json(
        { error: 'Unauthorized to delete this comment' },
        { status: 403 }
      );
    }
    
    // Soft delete the comment
    await connection.execute(
      'UPDATE mur_post_comments SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [commentId]
    );
    
    connection.release();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Comment deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
