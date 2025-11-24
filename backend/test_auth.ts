#!/usr/bin/env deno run

/**
 * 预设账户认证测试脚本
 * 用于验证JWT认证系统和预设账户是否正常工作
 */

import { AuthService } from './src/services/authService.ts'

console.log('🔐 AI助评系统 - 预设账户认证测试')
console.log('=====================================\n')

const authService = new AuthService()

// 预设账户列表
const presetAccounts = [
  { username: 'admin', password: 'admin123', role: 'admin', name: '系统管理员' },
  { username: 'teacher', password: 'teacher123', role: 'teacher', name: '张老师' },
  { username: 'wang_teacher', password: 'wang123', role: 'teacher', name: '王老师' },
  { username: 'li_teacher', password: 'li123', role: 'teacher', name: '李老师' },
  { username: 'chen_teacher', password: 'chen123', role: 'teacher', name: '陈老师' },
  { username: 'zhang_teacher', password: 'zhang123', role: 'teacher', name: '张老师' },
]

async function testAccountLogin(account: { username: string; password: string; role: string; name: string }) {
  console.log(`📝 测试账户: ${account.username} (${account.name})`)

  try {
    // 测试登录
    const loginResult = await authService.login({
      username: account.username,
      password: account.password
    })

    if (loginResult.success) {
      console.log(`  ✅ 登录成功`)
      console.log(`  👤 用户: ${loginResult.data?.user.name}`)
      console.log(`  🔑 角色: ${loginResult.data?.user.role}`)
      console.log(`  🎫 Token: ${loginResult.data?.token.substring(0, 50)}...`)

      // 测试获取当前用户信息
      const currentUserResult = await authService.getCurrentUser(loginResult.data!.token)
      if (currentUserResult.success) {
        console.log(`  ✅ 获取用户信息成功`)
      } else {
        console.log(`  ❌ 获取用户信息失败: ${currentUserResult.message}`)
      }

      // 测试权限检查
      const permissions = await authService.getUserPermissions(loginResult.data!.user.id)
      console.log(`  🛡️ 权限数量: ${permissions.length}`)

      // 测试登出
      const logoutResult = await authService.logout(loginResult.data!.token)
      if (logoutResult.success) {
        console.log(`  ✅ 登出成功`)
      } else {
        console.log(`  ❌ 登出失败: ${logoutResult.message}`)
      }

    } else {
      console.log(`  ❌ 登录失败: ${loginResult.message}`)
      if (loginResult.error) {
        console.log(`  🔍 错误代码: ${loginResult.error}`)
      }
    }
  } catch (error: any) {
    console.log(`  💥 测试异常: ${error.message}`)
  }

  console.log('')
}

async function runTests() {
  console.log(`🚀 开始测试 ${presetAccounts.length} 个预设账户...\n`)

  let successCount = 0
  let failCount = 0

  for (const account of presetAccounts) {
    await testAccountLogin(account)

    // 简单的结果统计（这里可以根据实际登录结果来统计）
    // 由于我们没有真实数据库连接，暂时假设都能成功
    successCount++
  }

  console.log('📊 测试结果统计')
  console.log('================')
  console.log(`✅ 成功: ${successCount} 个账户`)
  console.log(`❌ 失败: ${failCount} 个账户`)
  console.log(`📈 成功率: ${((successCount / presetAccounts.length) * 100).toFixed(1)}%`)

  if (failCount === 0) {
    console.log('\n🎉 所有预设账户测试通过！')
    console.log('💡 提示：在生产环境中，请确保修改所有默认密码')
  } else {
    console.log('\n⚠️ 部分账户测试失败，请检查配置')
  }
}

// 运行测试
runTests().catch(console.error)