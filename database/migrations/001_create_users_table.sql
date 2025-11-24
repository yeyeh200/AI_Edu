-- 创建用户表
-- 支持MVP中的简化用户认证系统

-- 用户表
CREATE TABLE users (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 基础信息
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(500),
    role VARCHAR(20) NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher')),

    -- 状态信息
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP,

    -- 审计字段
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

-- 创建索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 添加表注释
COMMENT ON TABLE users IS '用户表 - 存储系统用户信息，支持管理员和教师角色';
COMMENT ON COLUMN users.id IS '用户唯一标识';
COMMENT ON COLUMN users.username IS '用户名，用于登录';
COMMENT ON COLUMN users.email IS '邮箱地址';
COMMENT ON COLUMN users.password_hash IS '密码哈希值';
COMMENT ON COLUMN users.name IS '用户真实姓名';
COMMENT ON COLUMN users.avatar IS '头像URL';
COMMENT ON COLUMN users.role IS '用户角色：admin-管理员，teacher-教师';
COMMENT ON COLUMN users.is_active IS '账户是否激活';
COMMENT ON COLUMN users.is_verified IS '邮箱是否验证';
COMMENT ON COLUMN users.last_login_at IS '最后登录时间';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';
COMMENT ON COLUMN users.created_by IS '创建人ID';
COMMENT ON COLUMN users.updated_by IS '更新人ID';

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();