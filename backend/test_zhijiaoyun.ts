#!/usr/bin/env deno run

/**
 * 职教云API适配器测试脚本
 * 用于验证职教云API集成是否正常工作
 */

import { ZhijiaoyunService } from './src/services/zhijiaoyunService.ts'

console.log('🌐 职教云API适配器测试')
console.log('=======================\n')

const zhijiaoyunService = new ZhijiaoyunService()

async function testConnection() {
  console.log('🔌 测试API连接...')

  try {
    const healthStatus = await zhijiaoyunService.healthCheck()

    if (healthStatus.status === 'healthy') {
      console.log('✅ API连接成功')
      console.log(`📊 最后同步时间: ${healthStatus.lastSyncTime || '未知'}`)
      return true
    } else {
      console.log('❌ API连接失败')
      console.log(`🔍 错误信息: ${healthStatus.error || '未知错误'}`)
      return false
    }
  } catch (error: any) {
    console.log('💥 连接测试异常')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testUserData() {
  console.log('\n👥 测试用户数据获取...')

  try {
    console.log('📝 获取用户列表...')
    const usersResult = await zhijiaoyunService.getUsers({ page: 1, pageSize: 5 })

    if (usersResult.users.length > 0) {
      console.log(`✅ 获取到 ${usersResult.users.length} 个用户`)
      console.log(`📊 总用户数: ${usersResult.total}`)

      // 显示前几个用户信息
      usersResult.users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.realName} (${user.username}) - ${user.role}`)
      })

      // 测试获取单个用户
      if (usersResult.users.length > 0) {
        const userId = usersResult.users[0].userId
        console.log(`\n🔍 测试获取单个用户 (${userId})...`)
        const user = await zhijiaoyunService.getUser(userId)

        if (user) {
          console.log('✅ 获取单个用户成功')
          console.log(`👤 用户名: ${user.realName}`)
          console.log(`🏢 部门: ${user.departmentName}`)
        } else {
          console.log('❌ 获取单个用户失败')
        }
      }

      return true
    } else {
      console.log('⚠️ 未获取到用户数据（可能是空数据或API问题）')
      return false
    }
  } catch (error: any) {
    console.log('❌ 用户数据获取失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testCourseData() {
  console.log('\n📚 测试课程数据获取...')

  try {
    console.log('📝 获取课程列表...')
    const coursesResult = await zhijiaoyunService.getCourses({ page: 1, pageSize: 5 })

    if (coursesResult.courses.length > 0) {
      console.log(`✅ 获取到 ${coursesResult.courses.length} 个课程`)
      console.log(`📊 总课程数: ${coursesResult.total}`)

      // 显示前几个课程信息
      coursesResult.courses.forEach((course, index) => {
        console.log(`  ${index + 1}. ${course.courseName} (${course.courseCode})`)
        console.log(`     👨‍🏫 教师: ${course.teacherName}`)
        console.log(`     🏫 院系: ${course.departmentName}`)
        console.log(`     📊 学分: ${course.credits}`)
      })

      // 测试获取课程详情
      const courseId = coursesResult.courses[0].courseId
      console.log(`\n🔍 测试获取课程详情 (${courseId})...`)
      const course = await zhijiaoyunService.getCourse(courseId)

      if (course) {
        console.log('✅ 获取课程详情成功')
        console.log(`📚 课程名称: ${course.courseName}`)
        console.log(`⏰ 总学时: ${course.totalHours}`)
        console.log(`👥 当前学生数: ${course.currentStudents}/${course.maxStudents}`)
      } else {
        console.log('❌ 获取课程详情失败')
      }

      return true
    } else {
      console.log('⚠️ 未获取到课程数据（可能是空数据或API问题）')
      return false
    }
  } catch (error: any) {
    console.log('❌ 课程数据获取失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testAttendanceData() {
  console.log('\n📅 测试出勤数据获取...')

  try {
    console.log('📝 获取出勤记录...')
    const attendanceResult = await zhijiaoyunService.getAttendanceRecords({
      page: 1,
      pageSize: 10,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 最近7天
      endDate: new Date().toISOString().split('T')[0]
    })

    if (attendanceResult.records.length > 0) {
      console.log(`✅ 获取到 ${attendanceResult.records.length} 条出勤记录`)
      console.log(`📊 总记录数: ${attendanceResult.total}`)

      // 统计出勤状态
      const statusCount = attendanceResult.records.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      console.log('📊 出勤状态统计:')
      Object.entries(statusCount).forEach(([status, count]) => {
        const statusMap: Record<string, string> = {
          'present': '✅ 出勤',
          'absent': '❌ 缺勤',
          'late': '⏰ 迟到',
          'early_leave': '🏃 早退'
        }
        console.log(`  ${statusMap[status] || status}: ${count} 人次`)
      })

      return true
    } else {
      console.log('⚠️ 未获取到出勤数据（可能是空数据或API问题）')
      return false
    }
  } catch (error: any) {
    console.log('❌ 出勤数据获取失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testStatistics() {
  console.log('\n📊 测试统计数据获取...')

  try {
    console.log('📝 获取平台统计数据...')
    const statistics = await zhijiaoyunService.getStatistics()

    console.log('✅ 获取统计数据成功')
    console.log('📊 平台统计信息:')
    console.log(`  👥 用户总数: ${statistics.userCount.total}`)
    console.log(`    👨‍🏫 教师: ${statistics.userCount.teachers}`)
    console.log(`    🎓 学生: ${statistics.userCount.students}`)
    console.log(`    👑 管理员: ${statistics.userCount.admins}`)
    console.log(`  📚 课程总数: ${statistics.courseCount.total}`)
    console.log(`    ✅ 进行中: ${statistics.courseCount.active}`)
    console.log(`    ✅ 已完成: ${statistics.courseCount.completed}`)
    console.log(`  📅 平均出勤率: ${(statistics.attendanceRate * 100).toFixed(1)}%`)
    console.log(`  🎯 平均成绩: ${statistics.averageScore.toFixed(1)}分`)
    console.log(`  ⭐ 平均评价: ${statistics.evaluationScore.toFixed(1)}分`)

    return true
  } catch (error: any) {
    console.log('❌ 统计数据获取失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testDataSync() {
  console.log('\n🔄 测试数据同步...')

  try {
    console.log('📝 执行增量数据同步...')
    const syncStatus = await zhijiaoyunService.syncData('incremental')

    console.log('✅ 数据同步完成')
    console.log('📊 同步状态:')
    console.log(`  📅 最后同步时间: ${syncStatus.lastSyncTime}`)
    console.log(`  🔄 同步类型: ${syncStatus.syncType}`)
    console.log(`  📊 总记录数: ${syncStatus.totalRecords}`)
    console.log(`  ✅ 成功记录数: ${syncStatus.successRecords}`)
    console.log(`  ❌ 失败记录数: ${syncStatus.failedRecords}`)

    if (syncStatus.errors && syncStatus.errors.length > 0) {
      console.log('⚠️ 同步错误:')
      syncStatus.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`)
      })
    }

    return true
  } catch (error: any) {
    console.log('❌ 数据同步失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 开始职教云API适配器全面测试...\n')

  const tests = [
    { name: 'API连接测试', func: testConnection },
    { name: '用户数据测试', func: testUserData },
    { name: '课程数据测试', func: testCourseData },
    { name: '出勤数据测试', func: testAttendanceData },
    { name: '统计数据测试', func: testStatistics },
    { name: '数据同步测试', func: testDataSync },
  ]

  let successCount = 0
  let failCount = 0

  for (const test of tests) {
    console.log(`\n🧪 执行测试: ${test.name}`)
    console.log('='.repeat(50))

    try {
      const success = await test.func()
      if (success) {
        successCount++
        console.log(`\n✅ ${test.name} - 通过`)
      } else {
        failCount++
        console.log(`\n❌ ${test.name} - 失败`)
      }
    } catch (error: any) {
      failCount++
      console.log(`\n💥 ${test.name} - 异常`)
      console.log(`🔍 错误: ${error.message}`)
    }

    console.log('\n' + '-'.repeat(60))
  }

  // 测试结果统计
  console.log('\n📋 测试结果统计')
  console.log('==================')
  console.log(`✅ 通过: ${successCount} 项测试`)
  console.log(`❌ 失败: ${failCount} 项测试`)
  console.log(`📈 通过率: ${((successCount / tests.length) * 100).toFixed(1)}%`)

  if (failCount === 0) {
    console.log('\n🎉 所有测试通过！职教云API适配器工作正常')
    console.log('💡 提示：可以开始使用数据进行AI分析了')
  } else {
    console.log('\n⚠️ 部分测试失败，请检查：')
    console.log('1. 职教云API配置是否正确')
    console.log('2. 网络连接是否正常')
    console.log('3. API密钥是否有效')
    console.log('4. 职教云平台服务是否可用')
  }

  console.log('\n📞 如需帮助，请查看文档：docs/zhijiaoyun-api.md')
}

// 运行测试
runAllTests().catch(console.error)