import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const currentUserId = searchParams.get('currentUserId');
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Current user ID is required' }, { status: 400 });
    }

    const connection = await getConnection();
    
    let sql = `
      SELECT 
        r.id,
        r.representative_name as name,
        r.email,
        r.company_name as company,
        r.is_validated,
        r.created_at,
        CASE WHEN r.is_validated = 1 THEN 'online' ELSE 'offline' END as status
      FROM registrations r
      WHERE r.id != ? AND r.is_validated = 1
    `;
    
    const params: any[] = [currentUserId];
    
    if (query.trim()) {
      sql += ` AND (
        r.representative_name LIKE ? OR 
        r.company_name LIKE ? OR 
        r.email LIKE ?
      )`;
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    sql += ` ORDER BY r.representative_name ASC`;
    
    const [users] = await connection.execute(sql, params);
    
    // Get activities for each user
    const usersWithActivities = await Promise.all(
      (users as any[]).map(async (user) => {
        const [activities] = await connection.execute(
          `SELECT ra.activity_id, ao.label, ao.category
           FROM registration_activities ra
           JOIN activity_options ao ON ra.activity_id = ao.id
           WHERE ra.registration_id = ?`,
          [user.id]
        );
        
        return {
          ...user,
          activities: (activities as any[]).map(act => act.label)
        };
      })
    );

    return NextResponse.json({ users: usersWithActivities });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
