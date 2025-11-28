import crypto from "crypto"
import { MongoClient, type Db, type Filter, type Document } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI!
const DB_NAME = "scalable_web_app"

export interface User {
  _id?: string
  id?: string
  email: string
  passwordHash: string
  name: string
  createdAt: Date
}

export interface Task {
  _id?: string
  id?: string
  userId: string
  title: string
  description: string
  status: "pending" | "completed"
  createdAt: Date
  updatedAt: Date
}

let mongoClient: MongoClient | null = null
let database: Db | null = null

async function getMongoClient(): Promise<MongoClient> {
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI)
    await mongoClient.connect()
    console.log("[v0] MongoDB connected")
  }
  return mongoClient
}

async function getDatabase(): Promise<Db> {
  if (!database) {
    const client = await getMongoClient()
    database = client.db(DB_NAME)
  }
  return database
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

function generateId(): string {
  return crypto.randomUUID()
}

function normalizeUser(user: any): User | null {
  if (!user) return null
  return {
    id: user._id?.toString() || user.id,
    email: user.email,
    passwordHash: user.passwordHash,
    name: user.name,
    createdAt: user.createdAt,
  }
}

function normalizeTask(task: any): Task | null {
  if (!task) return null
  return {
    id: task._id?.toString() || task.id,
    userId: task.userId,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }
}

const dbOperations = {
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const database = await getDatabase()
      const usersCollection = database.collection("users")
      const user = await usersCollection.findOne({ email })
      return user ? normalizeUser(user) : null
    } catch (error) {
      console.error("[v0] Error finding user by email:", error)
      throw error
    }
  },

  async findUserById(id: string): Promise<User | null> {
    try {
      const database = await getDatabase()
      const usersCollection = database.collection("users")
      const user = await usersCollection.findOne({ _id: id as any })
      return user ? normalizeUser(user) : null
    } catch (error) {
      console.error("[v0] Error finding user by id:", error)
      throw error
    }
  },

  async createUser(email: string, password: string, name: string): Promise<User> {
    try {
      const database = await getDatabase()
      const usersCollection = database.collection("users")

      const userId = generateId()
      const user: any = {
        _id: userId,
        email,
        passwordHash: hashPassword(password),
        name,
        createdAt: new Date(),
      }

      await usersCollection.insertOne(user)
      return normalizeUser(user)!
    } catch (error) {
      console.error("[v0] Error creating user:", error)
      throw error
    }
  },

  async verifyUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findUserByEmail(email)
      if (user && verifyPassword(password, user.passwordHash)) {
        return user
      }
      return null
    } catch (error) {
      console.error("[v0] Error verifying user:", error)
      throw error
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const database = await getDatabase()
      const usersCollection = database.collection("users")

      const result = await usersCollection.findOneAndUpdate(
        { _id: id as any },
        { $set: updates },
        { returnDocument: "after" },
      )

      return result ? normalizeUser(result) : null
    } catch (error) {
      console.error("[v0] Error updating user:", error)
      throw error
    }
  },

  async createTask(userId: string, title: string, description: string): Promise<Task> {
    try {
      const database = await getDatabase()
      const tasksCollection = database.collection("tasks")

      const taskId = generateId()
      const task: any = {
        _id: taskId,
        userId,
        title,
        description,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await tasksCollection.insertOne(task)
      return normalizeTask(task)!
    } catch (error) {
      console.error("[v0] Error creating task:", error)
      throw error
    }
  },

  async getTasksByUser(userId: string): Promise<Task[]> {
    try {
      const database = await getDatabase()
      const tasksCollection = database.collection("tasks")
      const tasks = await tasksCollection.find({ userId }).toArray()
      return tasks.map(normalizeTask).filter((t): t is Task => t !== null)
    } catch (error) {
      console.error("[v0] Error getting tasks:", error)
      throw error
    }
  },

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const database = await getDatabase()
      const tasksCollection = database.collection("tasks")
      const task = await tasksCollection.findOne({ _id: id as any })
      return task ? normalizeTask(task) : null
    } catch (error) {
      console.error("[v0] Error getting task by id:", error)
      throw error
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const database = await getDatabase()
      const tasksCollection = database.collection("tasks")

      const result = await tasksCollection.findOneAndUpdate(
        { _id: id as any },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: "after" },
      )

      return result ? normalizeTask(result) : null
    } catch (error) {
      console.error("[v0] Error updating task:", error)
      throw error
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const database = await getDatabase()
      const tasksCollection = database.collection("tasks")
      const result = await tasksCollection.deleteOne({ _id: id as any })
      return result.deletedCount > 0
    } catch (error) {
      console.error("[v0] Error deleting task:", error)
      throw error
    }
  },
}

export const db = dbOperations
