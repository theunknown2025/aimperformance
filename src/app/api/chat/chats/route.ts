import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    connection = await getConnection();
    
    // Get chats where user is a participant
    const [chats] = await connection.execute(
      `SELECT 
        c.id,
        c.name,
        c.type,
        c.created_at,
        c.last_message_id,
        m.content as last_message_content,
        m.timestamp as last_message_time,
        m.sender_id as last_message_sender_id,
        u.representative_name as last_message_sender,
        COALESCE(u.is_admin, FALSE) as last_message_is_admin
      FROM chats c
      LEFT JOIN chat_participants cp ON c.id = cp.chat_id
      LEFT JOIN chat_messages m ON c.last_message_id = m.id
      LEFT JOIN registrations u ON m.sender_id = u.id
      WHERE cp.user_id = ?
      ORDER BY COALESCE(m.timestamp, c.created_at) DESC`,
      [userId]
    );

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function POST(request: NextRequest) {
  let connection;
  try {
    const body = await request.json();
    const { name, type, participants } = body;
    
    if (!name || !type || !participants || participants.length === 0) {
      return NextResponse.json({ error: 'Name, type, and participants are required' }, { status: 400 });
    }

    connection = await getConnection();
    
    // Create chat
    const [chatResult] = await connection.execute(
      `INSERT INTO chats (name, type, created_at) VALUES (?, ?, NOW())`,
      [name, type]
    );
    
    const chatId = (chatResult as any).insertId;
    
    // Add participants
    for (const participantId of participants) {
      await connection.execute(
        `INSERT INTO chat_participants (chat_id, user_id, joined_at) VALUES (?, ?, NOW())`,
        [chatId, participantId]
      );
    }

    return NextResponse.json({ chatId });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
