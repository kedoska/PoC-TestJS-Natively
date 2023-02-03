import {after, before, describe, test} from 'node:test'
import {strictEqual} from 'assert'
import {MongoClient} from 'mongodb'

const initDatabaseClient = () => {
    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return client
}

const validateCreatePayload = (payload) => {
    if (!payload.name) {
        throw new Error('name is required')
    }
}
const createDatabaseEntry = async (client, payload) => {
    const {insertedId} = await client.db('test').collection('users').insertOne(payload)
    return `${insertedId}`
}

const userService = (client) => {

    const create = async (payload) => {

        validateCreatePayload(payload)
        return await createDatabaseEntry(client, payload)
    }

    return {
        create,
    }
}

describe('users/creation', async () => {

    const client = initDatabaseClient()
    const service = userService(client)

    before(async () => {
        await client.connect()
    })

    after(async () => {
        await client.close()
    })

    test('scenario 1, validation error', async () => {
        const payload = {}

        try {
            await service.create(payload)
        }
        catch (error) {
            strictEqual(error.message, 'name is required')
        }
    })

    test('scenario 2, success', async () => {
        const payload = {
            name: 'John Doe',
        }
        const id = await service.create(payload)
        
        console.log(id)
    })
})
