# EDU_STUDENT_BOOK 学生教材对账明细表

## 基本信息

- **表名**：`EDU_STUDENT_BOOK`（原表名：`V_BRW_StudDZ`）
- **中文名称**：学生教材对账明细
- **用途**：记录学生教材的征订、发放、对账等详细信息，用于教材管理和费用核算
- **字段数量**：10个
- **数据类别**：教务系统 - 学生管理模块

## 字段定义

| 字段名 | 原字段名 | 数据类型 | 长度 | 是否为空 | 主键 | 默认值 | 备注 |
|--------|----------|----------|------|----------|------|--------|------|
| xn | 学年 | char | - | NO | NO | - | 如，2009表示2009-2010学年 |
| xq | 学期 | char | - | NO | NO | - | 0第一学期，1第二学期，2第三学期 |
| STUID | 学生ID | char | - | YES | NO | - | - |
| user_xh | 学号 | char | - | NO | NO | - | - |
| BOOKCODE | 教材代码 | char | - | NO | NO | - | - |
| bookname | 教材名称 | char | - | YES | NO | - | - |
| PRICE | 单价 | numeric | - | YES | NO | - | - |
| DISCOUNT | 折扣 | numeric | - | YES | NO | - | - |
| outnum | 数量 | numeric | - | YES | NO | - | - |
| yardmoney | 码洋 | numeric | - | YES | NO | - | - |
| realmoney | 实洋 | numeric | - | YES | NO | - - |

## 字段详细说明

### 主键字段
- **xn**：学年，如2009表示2009-2010学年
- **xq**：学期标识（0第一学期，1第二学期，2第三学期）
- **STUID**：学生ID，内部唯一标识符
- **user_xh**：学生学号，业务唯一标识符
- **BOOKCODE**：教材代码，唯一标识教材

### 学生信息字段
- **STUID**：学生内部ID
- **user_xh**：学生学号

### 教材信息字段
- **BOOKCODE**：教材代码
- **bookname**：教材名称

### 价格和数量字段
- **PRICE**：教材单价
- **DISCOUNT**：折扣比例（如0.8表示8折）
- **outnum**：发放数量

### 费用计算字段
- **yardmoney**：码洋（单价 × 数量）
- **realmoney**：实洋（码洋 × 折扣）

## 费用计算说明

### 码洋计算
```
码洋 = PRICE × outnum
```
码洋是指教材的原价总金额，不考虑折扣因素。

### 实洋计算
```
实洋 = yardmoney × DISCOUNT
```
实洋是指学生实际需要支付的金额，考虑折扣因素。

### 示例计算
- 教材单价：50.00元
- 数量：1本
- 折扣：0.8（8折）
- 码洋：50.00 × 1 = 50.00元
- 实洋：50.00 × 0.8 = 40.00元

## 学期说明

| 学期值 | 学期名称 | 时间范围 |
|--------|----------|----------|
| 0 | 第一学期 | 9月-1月 |
| 1 | 第二学期 | 2月-6月 |
| 2 | 第三学期 | 7月-8月（夏季学期） |

## 数据约束

1. **复合主键约束**：通常由 `(xn, xq, user_xh, BOOKCODE)` 组成复合主键
2. **外键约束**：`user_xh` 应引用学生基本信息表中的有效记录
3. **外键约束**：`BOOKCODE` 应引用教材信息表中的有效记录
4. **数值约束**：`PRICE`、`DISCOUNT`、`outnum`、`yardmoney`、`realmoney` 应为非负数
5. **检查约束**：`DISCOUNT` 通常在 0-2 之间

## 索引建议

- **复合主键索引**：`(xn, xq, user_xh, BOOKCODE)` - 主键索引
- **学号索引**：`user_xh` - 用于查询学生的教材使用情况
- **教材索引**：`BOOKCODE` - 用于查询教材的使用情况
- **学期索引**：`xn, xq` - 用于按学期查询教材统计
- **班级索引**：通过学号关联班级统计

## 数据关联关系

### 主要外键关联
- **学生基本信息表**：通过 `user_xh` 关联学生基本信息
- **教材信息表**：通过 `BOOKCODE` 关联教材详细信息

### 业务关联
- 与 **教材收订视图**关联：获取教材收订计划
- 与 **课程安排表**关联：根据课程确定教材需求
- 与 **缴费记录表**关联：记录教材费用缴纳情况

## 使用示例

### SQL查询示例

```sql
-- 查询某学生某学期教材使用情况
SELECT xn, xq, bookname, PRICE, DISCOUNT, outnum,
       yardmoney, realmoney
FROM EDU_STUDENT_BOOK
WHERE user_xh = '2024001001' AND xn = '2024' AND xq = '0'
ORDER BY bookname;

-- 查询某教材的使用统计
SELECT xn, xq, COUNT(*) as student_count,
       SUM(outnum) as total_quantity,
       SUM(yardmoney) as total_yardmoney,
       SUM(realmoney) as total_realmoney
FROM EDU_STUDENT_BOOK
WHERE BOOKCODE = 'BK001'
GROUP BY xn, xq
ORDER BY xn, xq;

-- 查询某学期教材费用统计
SELECT xn, xq,
       SUM(yardmoney) as total_yardmoney,
       SUM(realmoney) as total_realmoney,
       SUM(yardmoney - realmoney) as total_discount
FROM EDU_STUDENT_BOOK
WHERE xn = '2024'
GROUP BY xq
ORDER BY xq;

-- 查询班级教材使用情况
SELECT s.bjmc, b.bookname, SUM(b.outnum) as total_quantity,
       SUM(b.realmoney) as total_cost
FROM EDU_STUDENT_BOOK b
JOIN EDU_STUDENT_INFO s ON b.user_xh = s.user_xh
WHERE b.xn = '2024' AND b.xq = '0'
GROUP BY s.bjmc, b.bookname
ORDER BY s.bjmc, b.bookname;
```

### 数据插入示例

```sql
INSERT INTO EDU_STUDENT_BOOK (
    xn, xq, STUID, user_xh, BOOKCODE, bookname,
    PRICE, DISCOUNT, outnum, yardmoney, realmoney
) VALUES (
    '2024', '0', 'STU001', '2024001001', 'BK001',
    '高等数学（第七版）', 50.00, 0.8, 1, 50.00, 40.00
);
```

### 费用计算查询

```sql
-- 计算某学生教材总费用
SELECT user_xh,
       SUM(yardmoney) as total_yardmoney,
       SUM(realmoney) as total_realmoney,
       ROUND(AVG(DISCOUNT), 2) as avg_discount
FROM EDU_STUDENT_BOOK
WHERE user_xh = '2024001001' AND xn = '2024'
GROUP BY user_xh;
```

## 业务逻辑说明

### 教材征订流程
1. **需求统计**：根据课程安排统计教材需求
2. **教材选择**：教师选择合适的教材
3. **数量确定**：确定每种教材的征订数量
4. **价格谈判**：与出版社协商价格和折扣
5. **订单下达**：向教材供应商下达订单

### 教材发放流程
1. **库存准备**：检查教材库存情况
2. **班级分发**：按班级或个人分发教材
3. **签收确认**：学生或班主任签收确认
4. **使用记录**：记录教材使用情况
5. **回收处理**：学期结束时回收可再利用教材

### 费用管理
1. **费用计算**：根据数量和价格计算费用
2. **折扣处理**：考虑批量采购折扣
3. **缴费通知**：通知学生缴费时间和金额
4. **费用收取**：收取教材费用
5. **对账核实**：核对收费和发放记录

## 数据维护建议

### 定期维护
1. **数据同步**：确保教材库存与实际发放一致
2. **对账核实**：定期核对教材费用和实际收入
3. **数据清理**：清理错误的或重复的记录

### 异常处理
1. **数量不符**：处理发放数量与征订数量不符的情况
2. **价格变更**：处理教材价格调整的情况
3. **退书处理**：处理学生退课的教材退费

## 数据统计分析

### 使用统计
- 按学期统计教材使用量和费用
- 按专业统计教材使用偏好
- 按教材统计使用频率
- 按班级统计教材费用

### 费用分析
- 教材费用占学费比例分析
- 折扣政策效果分析
- 学生教材负担情况分析
- 教材使用效益评估

---

**数据来源**：教务管理系统
**维护单位**：教务处、教材科
**更新频率**：教材发放时实时更新，学期结束时定期更新