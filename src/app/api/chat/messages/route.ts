import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    connection = await getConnection();
    
    const [messages] = await connection.execute(
      `SELECT 
        m.id,
        m.chat_id,
        m.sender_id,
        m.content,
        m.timestamp,
        u.representative_name as sender_name,
        COALESCE(u.is_admin, FALSE) as is_admin
      FROM chat_messages m
      LEFT JOIN registrations u ON m.sender_id = u.id
      WHERE m.chat_id = ?
      ORDER BY m.timestamp ASC`,
      [chatId]
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
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
    const { chatId, senderId, content } = body;
    
    if (!chatId || !senderId || !content) {
      return NextResponse.json({ error: 'Chat ID, sender ID, and content are required' }, { status: 400 });
    }

    connection = await getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO chat_messages (chat_id, sender_id, content, timestamp)
       VALUES (?, ?, ?, NOW())`,
      [chatId, senderId, content]
    );

    const messageId = (result as any).insertId;

    // Update the last_message_id in the chats table
    await connection.execute(
      `UPDATE chats SET last_message_id = ? WHERE id = ?`,
      [messageId, chatId]
    );

    // Get the inserted message
    const [messages] = await connection.execute(
      `SELECT 
        m.id,
        m.chat_id,
        m.sender_id,
        m.content,
        m.timestamp,
        u.representative_name as sender_name,
        COALESCE(u.is_admin, FALSE) as is_admin
      FROM chat_messages m
      LEFT JOIN registrations u ON m.sender_id = u.id
      WHERE m.id = ?`,
      [messageId]
    );

    return NextResponse.json({ message: (messages as any[])[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
