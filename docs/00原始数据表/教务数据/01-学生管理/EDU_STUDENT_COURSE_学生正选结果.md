# EDU_STUDENT_COURSE 学生正选结果表

## 基本信息

- **表名**：`EDU_STUDENT_COURSE`（原表名：`V_BRW_SelCourse_ZX`）
- **中文名称**：学生正选结果
- **用途**：记录学生选课的正选结果，包括选课的课程、学分、教师、时间安排等信息
- **字段数量**：18个
- **数据类别**：教务系统 - 学生管理模块

## 字段定义

| 字段名 | 原字段名 | 数据类型 | 长度 | 是否为空 | 主键 | 默认值 | 备注 |
|--------|----------|----------|------|----------|------|--------|------|
| xn | 学年 | char | - | NO | YES | - | 如，2009表示2009-2010学年 |
| xq_id | 学期 | char | - | NO | YES | - | 0第一学期，1第二学期，2第三学期 |
| user_xh | 学号 | char | - | NO | YES | - | 学生唯一标识 |
| xm | 姓名 | char | - | YES | NO | - | - |
| skbj | 上课班级 | char | - | NO | YES | - | - |
| user_kcdm | 课程代码 | char | - | NO | YES | - | - |
| kcmc | 课程名称 | char | - | YES | NO | - | - |
| xf | 学分 | decimal | - | YES | NO | - | - |
| kclb1_mc | 课程类别一 | char | - | YES | NO | - | - |
| kclb2_mc | 课程类别二 | char | - | YES | NO | - | - |
| zfx_flag | 主辅修标志 | char | - | YES | NO | - | 0主修，1辅修 |
| cx_flag | 重修标志 | char | - | YES | NO | - | 1重修 |
| zjjs_gh | 任课教师工号 | char | - | YES | NO | - | - |
| zjjs_xm | 任课教师姓名 | char | - | YES | NO | - | - |
| SHSJ | 上课时间 | char | - | YES | NO | - | 例如：10-17周 四[1-4] 博远A-204 |
| XKLC | 选课轮次 | char | - | YES | NO | - | - |
| SKSJ | 上课时间 | char | - | YES | NO | - | 例如：10-17周 四[1-4] 博远A-204 |

## 字段详细说明

### 主键字段
- **xn**：学年，如2009表示2009-2010学年
- **xq_id**：学期标识（0第一学期，1第二学期，2第三学期）
- **user_xh**：学生学号，唯一标识学生
- **skbj**：上课班级，标识具体的上课班级
- **user_kcdm**：课程代码，唯一标识课程

### 学生信息字段
- **xm**：学生姓名

### 课程信息字段
- **kcmc**：课程名称
- **xf**：学分
- **kclb1_mc**：课程类别一
- **kclb2_mc**：课程类别二

### 选课性质字段
- **zfx_flag**：主辅修标志
  - 0：主修课程
  - 1：辅修课程
- **cx_flag**：重修标志
  - 1：重修课程
  - 0或空：非重修课程

### 教师信息字段
- **zjjs_gh**：任课教师工号
- **zjjs_xm**：任课教师姓名

### 上课安排字段
- **SHSJ**：上课时间描述
- **SKSJ**：上课时间详细描述
- **XKLC**：选课轮次

## 选课性质说明

### 主辅修标志（zfx_flag）
| 标志值 | 说明 | 备注 |
|--------|------|------|
| 0 | 主修 | 必修或主修课程 |
| 1 | 辅修 | 选修或辅修课程 |

### 重修标志（cx_flag）
| 标志值 | 说明 | 备注 |
|--------|------|------|
| 1 | 重修 | 需要重新学习该课程 |
| 0或空 | 首次修读 | 正常的选课学习 |

## 上课时间格式

### 时间格式示例
- **周次**：`10-17周` 表示第10周到第17周
- **星期**：`四` 表示星期四
- **节次**：`[1-4]` 表示第1-4节
- **地点**：`博远A-204` 表示教学楼、教室号

### 完整示例
```
10-17周 四[1-4] 博远A-204 设计创作室(50)
```

表示：第10周到第17周，星期四第1-4节，在博远教学楼A栋204教室（设计创作室，容量50人）

## 课程类别说明

### 课程类别一（kclb1_mc）
- **公共必修课**：全校学生必须修读的课程
- **专业必修课**：专业学生必须修读的核心课程
- **专业选修课**：专业学生可以选择的扩展课程
- **公共选修课**：全校学生可以选择的拓展课程

### 课程类别二（kclb2_mc）
- **理论课**：以理论教学为主的课程
- **实践课**：以实践教学为主的课程
- **实验课**：在实验室进行的课程
- **实习课**：校外或校内实习课程

## 数据约束

1. **复合主键约束**：通常由 `(xn, xq_id, user_xh, skbj, user_kcdm)` 组成复合主键
2. **外键约束**：`user_xh` 应引用学生基本信息表中的有效记录
3. **外键约束**：`zjjs_gh` 应引用教师信息表中的有效记录
4. **检查约束**：`zfx_flag` 只能是 0 或 1
5. **检查约束**：`cx_flag` 只能是 0 或 1
6. **检查约束**：`xq_id` 只能是 0、1 或 2

## 索引建议

- **复合主键索引**：`(xn, xq_id, user_xh, skbj, user_kcdm)` - 主键索引
- **学号索引**：`user_xh` - 用于查询学生的选课情况
- **课程索引**：`user_kcdm` - 用于查询课程的学生选课情况
- **学期索引**：`xn, xq_id` - 用于查询某学期选课情况
- **教师索引**：`zjjs_gh` - 用于查询教师的授课情况

## 数据关联关系

### 主要外键关联
- **学生基本信息表**：通过 `user_xh` 关联学生基本信息
- **课程信息表**：通过 `user_kcdm` 关联课程信息
- **教师信息表**：通过 `zjjs_gh` 关联教师信息

### 业务关联
- 与 **课程安排表**关联：获取详细的上课时间和地点
- 与 **成绩表**关联：记录学生该课程的成绩
- 与 **教材表**关联：记录课程使用的教材

## 使用示例

### SQL查询示例

```sql
-- 查询某学生的选课情况
SELECT xn, xq_id, kcmc, xf, zfx_flag, cx_flag,
       zjjs_xm, SHSJ
FROM EDU_STUDENT_COURSE
WHERE user_xh = '2024001001'
ORDER BY xn, xq_id, kcmc;

-- 查询某课程的选课学生
SELECT c.user_xh, s.xm, c.skbj, c.zfx_flag, c.cx_flag,
       c.SH SJ
FROM EDU_STUDENT_COURSE c
JOIN EDU_STUDENT_INFO s ON c.user_xh = s.user_xh
WHERE c.user_kcdm = 'CS101' AND c.xn = '2024' AND c.xq_id = '0'
ORDER BY s.user_xh;

-- 查询某课程的选课统计
SELECT kcmc, COUNT(*) as student_count,
       SUM(xf) as total_credits,
       SUM(CASE WHEN zfx_flag = '1' THEN 1 ELSE 0 END) as elective_count,
       SUM(CASE WHEN cx_flag = '1' THEN 1 ELSE 0 END) as retake_count
FROM EDU_STUDENT_COURSE
WHERE user_kcdm = 'CS101' AND xn = '2024' AND xq_id = '0'
GROUP BY kcmc;

-- 查询学生选课学分统计
SELECT s.user_xh, s.xm,
       SUM(CASE WHEN zfx_flag = '0' THEN xf ELSE 0 END) as main_credits,
       SUM(CASE WHEN zfx_flag = '1' THEN xf ELSE 0 END) as elective_credits,
       SUM(xf) as total_credits
FROM EDU_STUDENT_COURSE c
JOIN EDU_STUDENT_INFO s ON c.user_xh = s.user_xh
WHERE c.xn = '2024' AND c.xq_id = '0'
GROUP BY s.user_xh, s.xm
ORDER BY total_credits DESC;
```

### 数据插入示例

```sql
INSERT INTO EDU_STUDENT_COURSE (
    xn, xq_id, user_xh, xm, skbj, user_kcdm, kcmc,
    xf, zfx_flag, cx_flag, zjjs_gh, zjjs_xm, SHSJ
) VALUES (
    '2024', '0', '2024001001', '张三', 'CS202401',
    'CS101', '计算机基础', 4.0, '0', '0',
    'T001', '李老师', '1-16周 一、三[1-2] A101'
);
```

## 业务逻辑说明

### 选课流程
1. **选课开放**：系统开放选课功能
2. **学生选课**：学生选择感兴趣的课程
3. **选课审核**：系统或人工审核选课资格
4. **选课确认**：确认最终的选课结果
5. **正选结果**：生成最终的正选结果表

### 选课规则
1. **主辅修限制**：根据培养方案确定主辅修课程数量
2. **时间冲突**：避免上课时间冲突的选课
3. **人数限制**：考虑教室容量和师资配备
4. **前置课程**：确保满足课程的前置要求

### 重修管理
1. **重修资格**：成绩不合格或有重修需求的学生
2. **重修流程**：特殊申请或自动安排重修
3. **重修记录**：标记重修课程便于成绩管理

## 数据维护建议

### 定期维护
1. **数据同步**：确保选课数据与课表数据同步
2. **数据清理**：清理无效或重复的选课记录
3. **数据校验**：检查选课数据的完整性

### 异常处理
1. **冲突处理**：处理选课时间或地点冲突
2. **超员处理**：处理选课人数超限的情况
3. **资格审核**：处理不符合选课资格的申请

## 数据统计分析

### 选课统计
- 按学期统计选课人数和学分
- 按课程统计选课分布情况
- 按专业统计选课偏好分析
- 按教师统计授课负荷

### 选课分析
- 选课热度分析
- 选课时间分布分析
- 选课成功率和退课率
- 选课满意度调查

---

**数据来源**：教务管理系统
**维护单位**：教务处、选课中心
**更新频率**：选课期间实时更新，选课结束后定期更新