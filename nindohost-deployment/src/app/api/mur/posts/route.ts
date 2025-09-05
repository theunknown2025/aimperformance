import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/database';

// GET - Fetch all posts with user info, media, likes, and comments count
export async function GET(request: NextRequest) {
  try {
    const connection = await getConnection();
    
    const query = `
      SELECT 
        p.*,
        r.company_name as user_name,
        r.email as user_email,
        COUNT(DISTINCT pl.id) as likes_count,
        COUNT(DISTINCT pc.id) as comments_count,
        COUNT(DISTINCT pi.id) as images_count,
        COUNT(DISTINCT pd.id) as documents_count
      FROM mur_posts p
      LEFT JOIN registrations r ON p.user_id = r.id
      LEFT JOIN mur_post_likes pl ON p.id = pl.post_id
      LEFT JOIN mur_post_comments pc ON p.id = pc.post_id AND pc.is_deleted = FALSE
      LEFT JOIN mur_post_images pi ON p.id = pi.post_id
      LEFT JOIN mur_post_documents pd ON p.id = pd.post_id
      WHERE p.is_deleted = FALSE
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    
    const [posts] = await connection.execute(query);
    
    // Get media for each post
    const postsWithMedia = await Promise.all(
      (posts as any[]).map(async (post) => {
        const [images] = await connection.execute(
          'SELECT * FROM mur_post_images WHERE post_id = ? ORDER BY created_at ASC',
          [post.id]
        );
        
        const [documents] = await connection.execute(
          'SELECT * FROM mur_post_documents WHERE post_id = ? ORDER BY created_at ASC',
          [post.id]
        );
        
        return {
          ...post,
          images: images,
          documents: documents
        };
      })
    );
    
    connection.release();
    return NextResponse.json({ posts: postsWithMedia });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    const { content, images, documents, userId } = await request.json();
    
    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Content and userId are required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Create the post
    const [result] = await connection.execute(
      'INSERT INTO mur_posts (user_id, content) VALUES (?, ?)',
      [userId, content]
    );
    
    const postId = (result as any).insertId;
    
    // Add images if provided
    if (images && images.length > 0) {
      for (const image of images.slice(0, 5)) { // Max 5 images
        await connection.execute(
          'INSERT INTO mur_post_images (post_id, image_url, image_name, image_size) VALUES (?, ?, ?, ?)',
          [postId, image.url, image.name, image.size]
        );
      }
    }
    
    // Add documents if provided
    if (documents && documents.length > 0) {
      for (const document of documents.slice(0, 5)) { // Max 5 documents
        await connection.execute(
          'INSERT INTO mur_post_documents (post_id, document_url, document_name, document_size, document_type) VALUES (?, ?, ?, ?, ?)',
          [postId, document.url, document.name, document.size, document.type]
        );
      }
    }
    
    connection.release();
    
    return NextResponse.json({ 
      success: true, 
      postId,
      message: 'Post created successfully' 
    });
    
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT - Update a post
export async function PUT(request: NextRequest) {
  try {
    const { postId, content, userId } = await request.json();
    
    if (!postId || !content || !userId) {
      return NextResponse.json(
        { error: 'PostId, content, and userId are required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Verify user owns the post
    const [post] = await connection.execute(
      'SELECT user_id FROM mur_posts WHERE id = ? AND is_deleted = FALSE',
      [postId]
    );
    
    if (!(post as any[]).length || (post as any[])[0].user_id !== userId) {
      connection.release();
      return NextResponse.json(
        { error: 'Unauthorized to edit this post' },
        { status: 403 }
      );
    }
    
    // Update the post
    await connection.execute(
      'UPDATE mur_posts SET content = ? WHERE id = ?',
      [content, postId]
    );
    
    connection.release();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const userId = searchParams.get('userId');
    
    if (!postId || !userId) {
      return NextResponse.json(
        { error: 'PostId and userId are required' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Verify user owns the post
    const [post] = await connection.execute(
      'SELECT user_id FROM mur_posts WHERE id = ? AND is_deleted = FALSE',
      [postId]
    );
    
    if (!(post as any[]).length || (post as any[])[0].user_id !== parseInt(userId)) {
      connection.release();
      return NextResponse.json(
        { error: 'Unauthorized to delete this post' },
        { status: 403 }
      );
    }
    
    // Soft delete the post
    await connection.execute(
      'UPDATE mur_posts SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [postId]
    );
    
    connection.release();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
