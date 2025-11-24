/**
 * 后端健康检查接口测试
 */
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

/**
 * 测试 /health 接口响应结构
 */
Deno.test("GET /health should return healthy status", async () => {
  const res = await fetch("http://localhost:8000/health");
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.success, true);
  assertEquals(body.data.status, "healthy");
});
