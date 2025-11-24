CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100),
    title VARCHAR(100),
    phone VARCHAR(20),
    specialization VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- e.g., 'active', 'inactive', 'on_leave'
    join_date DATE,
    last_login TIMESTAMP,
    evaluation_count INT DEFAULT 0,
    average_score NUMERIC(3, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teachers_department ON teachers(department);
CREATE INDEX idx_teachers_status ON teachers(status);
