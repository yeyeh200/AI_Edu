// Test password hashing to verify it matches the database
async function hashPassword(password: string): Promise<string> {
    try {
        const encoder = new TextEncoder()
        const data = encoder.encode(password)
        const hash = await crypto.subtle.digest(
            { name: 'SHA-256' },
            data
        )
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toLowerCase()
    } catch (error) {
        console.error('Password hashing error:', error)
        return ''
    }
}

const testPassword = 'admin123'
const hash = await hashPassword(testPassword)
console.log(`Password: ${testPassword}`)
console.log(`Generated hash: ${hash}`)
console.log(`Expected hash:  240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`)
console.log(`Match: ${hash === '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'}`)
