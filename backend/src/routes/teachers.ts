
import { Hono, type Context } from 'hono';
import { DatabaseService } from '@/services/databaseService';
import type { ApiResponse } from '@/types';

const teachers = new Hono();

// 根据数据库 schema 定义教师接口
interface Teacher {
  id: number;
  username: string;
  name: string;
  email: string;
  department: string | null;
  title: string | null;
  phone: string | null;
  specialization: string | null;
  status: 'active' | 'inactive' | 'on_leave';
  join_date: string | null;
  last_login: string | null;
  evaluation_count: number;
  average_score: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * 获取教师列表（支持分页、搜索、筛选）
 * @param c Hono上下文
 * @returns Promise<Response>
 */
teachers.get('/', async (c: Context) => {
  const { page = '1', pageSize = '10', search, department } = c.req.query();
  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);

  try {
    const db = new DatabaseService();
    let query = 'SELECT *, count(*) OVER() AS total FROM teachers';
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (search) {
      whereClauses.push(`(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR username ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (department) {
      whereClauses.push(`department = $${params.length + 1}`);
      params.push(department);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(pageSizeNum, (pageNum - 1) * pageSizeNum);

    type TeacherWithTotal = Teacher & { total: string };
    const rows = await db.query<TeacherWithTotal>(query, params);

    const total = rows.length > 0 ? Number(rows[0].total) : 0;

    const teacherData = rows.map(({ total, ...rest }) => rest);

    return c.json<ApiResponse<{ teachers: Teacher[]; total: number; page: number; pageSize: number; }>>({
      success: true,
      data: {
        teachers: teacherData,
        total,
        page: pageNum,
        pageSize: pageSizeNum,
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : '未知错误';
    return c.json<ApiResponse<null>>({ success: false, message: '获取教师数据失败', error: errorMessage }, 500);
  }
});

/**
 * 获取所有部门列表
 * @param c Hono上下文
 * @returns Promise<Response>
 */
teachers.get('/departments', async (c: Context) => {
  try {
    const db = new DatabaseService();
    const rows = await db.query<{ department: string }>('SELECT DISTINCT department FROM teachers WHERE department IS NOT NULL ORDER BY department');
    return c.json<ApiResponse<string[]>>({ success: true, data: rows.map((r) => r.department) });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : '未知错误';
    return c.json<ApiResponse<null>>({ success: false, message: '获取部门数据失败', error: errorMessage }, 500);
  }
});

/**
 * 删除指定ID的教师
 * @param c Hono上下文
 * @returns Promise<Response>
 */
teachers.delete('/:id', async (c: Context) => {
  const { id } = c.req.param();
  try {
    const db = new DatabaseService();
    await db.executeSql('DELETE FROM teachers WHERE id = $1', [id]);
    return c.json<ApiResponse<null>>({ success: true, message: '教师删除成功' });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : '未知错误';
    return c.json<ApiResponse<null>>({ success: false, message: '删除教师失败', error: errorMessage }, 500);
  }
});

export default teachers;
