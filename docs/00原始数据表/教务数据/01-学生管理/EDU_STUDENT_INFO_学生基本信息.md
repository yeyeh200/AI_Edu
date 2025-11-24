# EDU_STUDENT_INFO 学生基本信息表

## 基本信息

- **表名**：`EDU_STUDENT_INFO`（原表名：`V_BRW_Student`）
- **中文名称**：学生基本信息
- **用途**：存储学生的基本个人信息，包括入学信息、联系方式、家庭背景等，是教务系统的核心基础数据表
- **字段数量**：50个
- **数据类别**：教务系统 - 学生管理模块

## 字段定义

| 字段名 | 原字段名 | 数据类型 | 长度 | 是否为空 | 主键 | 默认值 | 备注 |
|--------|----------|----------|------|----------|------|--------|------|
| rxnj | 入校年份 | char | - | YES | NO | - | - |
| user_xh | 学号 | char | - | NO | YES | - | 学生唯一标识 |
| xm | 姓名 | char | - | YES | NO | - | - |
| xmpy | 姓名拼音 | char | - | YES | NO | - | - |
| cym | 曾用名 | char | - | YES | NO | - | - |
| xb | 性别 | char | - | YES | NO | - | 1男，2女 |
| csrq | 出生日期 | datetime | - | YES | NO | - | - |
| sfzh | 身份证号 | char | - | YES | NO | - | - |
| gkksh | 高考考生号 | char | - | YES | NO | - | - |
| zkzh | 准考证号 | char | - | YES | NO | - | - |
| mz | 民族 | char | - | YES | NO | - | - |
| jg | 籍贯 | char | - | YES | NO | - | - |
| sysf | 生源省份 | char | - | YES | NO | - | - |
| sydq | 生源地区 | char | - | YES | NO | - | - |
| lxdz | 联系地址 | char | - | YES | NO | - | - |
| yzbm | 邮政编码 | char | - | YES | NO | - | - |
| lxr | 联系人 | char | - | YES | NO | - | - |
| lxdh | 联系电话 | char | - | YES | NO | - | - |
| mobile | 手机号码 | char | - | YES | NO | - | - |
| email | 电子邮箱 | char | - | YES | NO | - | - |
| zzmm | 政治面貌 | char | - | YES | NO | - | - |
| ZZMMM | 政治面貌代码 | char | - | YES | NO | - | - |
| rxrq | 入校日期 | char | - | YES | NO | - | - |
| rxcj | 入学成绩 | char | - | YES | NO | - | - |
| gatq_m | 港澳台侨码 | char | - | YES | NO | - | - |
| gatqW | 港澳台侨 | char | - | YES | NO | - | - |
| bxxs | 办学形式 | char | - | YES | NO | - | - |
| jkzk | 健康状况 | char | - | YES | NO | - | - |
| bz | 备注 | char | - | YES | NO | - | - |
| nj | 年级 | char | - | YES | NO | - | - |
| yxmc | 院(系)/部 | char | - | YES | NO | - | - |
| zymc | 专业 | char | - | YES | NO | - | - |
| bjmc | 班级 | char | - | YES | NO | - | - |
| xz | 学制 | char | - | YES | NO | - | - |
| xjzt | 学制范围内学籍状态 | char | - | YES | NO | - | - |
| sfzx | 学制范围内是否在校 | char | - | YES | NO | - | 1是，0否 |
| pyccmc | 培养层次 | char | - | YES | NO | - | - |
| bjdm_user | 班级代码 | char | - | YES | NO | - | - |
| zydm_user | 专业代码 | char | - | YES | NO | - | - |
| yxdm_user | 院(系)/部代码 | char | - | YES | NO | - | - |
| Scharea | 校区名称 | char | - | YES | NO | - | - |
| CSD | 出生地 | char | - | YES | NO | - | - |
| HYZK | 婚姻状态 | char | - | YES | NO | - | - |
| xslbm | 学生类别码 | char | - | YES | NO | - | - |
| GKZSZP | 高考招生照片 | - | - | YES | NO | - | 新增字段 |
| RXHZP | 入学后照片 | - | - | YES | NO | - | 新增字段 |
| BYZP | 毕业照片 | - | - | YES | NO | - | 新增字段 |
| SFZZPZM | 身份证照片(正) | - | - | YES | NO | - | 新增字段 |
| SFZZPFM | 身份证照片(反) | - | - | YES | NO | - | 新增字段 |
| Xsbq | 学生标签 | - | - | YES | NO | - | 是否交换生 |

## 字段详细说明

### 主键字段
- **user_xh**：学生学号，唯一标识符，主键

### 基本个人信息
- **xm**：学生真实姓名
- **xmpy**：姓名拼音，用于系统检索和显示
- **cym**：曾用名，记录学生姓名变更历史
- **xb**：性别（1男，2女）
- **csrq**：出生日期
- **sfzh**：身份证号码，唯一身份标识
- **CSD**：出生地

### 入学相关信息
- **rxnj**：入校年份
- **rxrq**：入校日期
- **rxcj**：入学成绩
- **gkksh**：高考考生号
- **zkzh**：准考证号
- **bxxs**：办学形式

### 联系信息
- **lxdz**：联系地址
- **yzbm**：邮政编码
- **lxr**：联系人姓名
- **lxdh**：联系电话
- **mobile**：手机号码
- **email**：电子邮箱

### 地域和背景信息
- **mz**：民族
- **jg**：籍贯
- **sysf**：生源省份
- **sydq**：生源地区
- **gatq_m**：港澳台侨码
- **gatqW**：港澳台侨标识

### 学籍和培养信息
- **nj**：年级
- **yxmc**：院(系)/部名称
- **zymc**：专业名称
- **bjmc**：班级名称
- **xz**：学制
- **xjzt**：学制范围内学籍状态
- **sfzx**：学制范围内是否在校（1是，0否）
- **pyccmc**：培养层次
- **xslbm**：学生类别码

### 编码信息
- **bjdm_user**：班级代码
- **zydm_user**：专业代码
- **yxdm_user**：院(系)/部代码
- **Scharea**：校区名称

### 政治和其他信息
- **zzmm**：政治面貌
- **ZZMMM**：政治面貌代码
- **jkzk**：健康状况
- **HYZK**：婚姻状态
- **bz**：备注信息
- **Xsbq**：学生标签（是否交换生）

### 照片信息（新增字段）
- **GKZSZP**：高考招生照片
- **RXHZP**：入学后照片
- **BYZP**：毕业照片
- **SFZZPZM**：身份证照片（正面）
- **SFZZPFM**：身份证照片（反面）

## 数据约束

1. **主键约束**：`user_xh` 字段必须唯一且非空
2. **唯一约束**：`sfzh` 身份证号应保持唯一性
3. **检查约束**：`xb` 只能是 1 或 2
4. **检查约束**：`sfzx` 只能是 0 或 1
5. **检查约束**：`xjzt` 应符合预设状态值
6. **检查约束**：`gatqW` 应符合预设标识

## 索引建议

- **主键索引**：`user_xh` - 主键自动创建唯一索引
- **唯一索引**：`sfzh` - 身份证号唯一索引
- **复合索引**：`nj + bjdm_user` - 用于按年级班级查询
- **复合索引**：`zydm_user + yxdm_user` - 用于按专业院系统计
- **复合索引**：`rxnj + xjzt` - 用于按入学年份和学籍状态筛选
- **姓名索引**：`xm` - 用于按姓名搜索
- **拼音索引**：`xmpy` - 用于拼音检索

## 数据关联关系

### 主要外键关联
- **院系表**：通过 `yxdm_user` 关联院系信息
- **专业表**：通过 `zydm_user` 关联专业信息
- **班级表**：通过 `bjdm_user` 关联班级信息
- **课程表**：通过学号关联选课信息
- **成绩表**：通过学号关联成绩信息

### 业务关联
- 与 **学生异动表**关联：记录学生学籍变更历史
- 与 **学生状态表**关联：记录每学期学生状态
- 与 **选课结果表**关联：记录学生选课信息
- 与 **成绩表**关联：记录学生成绩信息

## 使用示例

### SQL查询示例

```sql
-- 查询某年级的所有学生
SELECT user_xh, xm, xb, zymc, bjmc
FROM EDU_STUDENT_INFO
WHERE nj = '2024' AND sfzx = '1'
ORDER BY user_xh;

-- 查询某专业的学生统计
SELECT zymc, COUNT(*) as student_count,
       SUM(CASE WHEN xb = '1' THEN 1 ELSE 0 END) as male_count,
       SUM(CASE WHEN xb = '2' THEN 1 ELSE 0 END) as female_count
FROM EDU_STUDENT_INFO
WHERE zymc = '计算机科学与技术'
GROUP BY zymc;

-- 查询学生详细信息
SELECT s.user_xh, s.xm, s.xb, s.csrq, s.mobile, s.email,
       y.yxmc, s.zymc, s.bjmc
FROM EDU_STUDENT_INFO s
WHERE s.user_xh = '2024001001';
```

### 数据插入示例

```sql
INSERT INTO EDU_STUDENT_INFO (
    user_xh, xm, xb, csrq, sfzh, mobile, email,
    nj, yxmc, zymc, bjmc, xz, sfzx, pyccmc,
    bjdm_user, zydm_user, yxdm_user
) VALUES (
    '2024001001', '张三', '1', '2000-01-01', '110101200001011234',
    '13800138000', 'zhangsan@university.edu.cn',
    '2024', '计算机学院', '计算机科学与技术', '计算机2024-1班',
    '4', '1', '本科', 'CS202401', 'CS001', 'YX001'
);
```

## 业务逻辑说明

### 学籍管理
1. **新生入学**：学生基本信息录入，初始状态为在校
2. **学籍异动**：转学、休学、复学、退学等状态变更
3. **毕业管理**：毕业资格审核，状态更新为毕业

### 数据一致性
1. **编码一致**：专业、班级、院系编码需与主表保持一致
2. **状态同步**：学籍状态需与实际在校状态同步
3. **照片管理**：不同时期的照片需按规范存储

### 隐私保护
1. **敏感信息**：身份证号、联系方式等需要特殊保护
2. **访问控制**：不同角色对学生信息的访问权限不同
3. **数据安全**：照片等个人信息需要加密存储

## 数据维护建议

### 定期维护
1. **数据校验**：定期检查身份证号、手机号等关键字段格式
2. **状态同步**：定期同步学籍状态与实际在校情况
3. **照片更新**：定期更新学生各阶段照片

### 数据质量
1. **完整性检查**：确保关键字段不为空
2. **一致性检查**：确保关联编码的正确性
3. **重复检查**：防止重复录入相同学生信息

---

**数据来源**：教务管理系统
**维护单位**：学生管理科
**更新频率**：实时更新学籍状态，定期更新基础信息