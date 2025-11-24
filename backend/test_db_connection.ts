import { DatabaseService } from './src/services/databaseService.ts'
import { config } from './src/config/config.ts'

console.log(`Connecting to database at ${config.database.host}:${config.database.port}...`)

const db = new DatabaseService()
try {
    const connected = await db.testConnection()

    if (connected) {
        console.log('Database connection successful!')
        Deno.exit(0)
    } else {
        console.error('Database connection failed!')
        Deno.exit(1)
    }
} catch (error) {
    console.error('Error testing connection:', error)
    Deno.exit(1)
}
