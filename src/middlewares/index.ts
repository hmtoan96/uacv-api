import express from 'express'
import { get, merge } from 'lodash'

import { getUserBySessionToken } from '../db/users'

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params
    const currentUserId = get(req, 'identity._id') as string
    if (!currentUserId) {
      return res.send(403)
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403)
    }
    next()
  } catch (err) {}
}

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies['uacv-auth']
    if (!sessionToken) {
      return res.sendStatus(403)
    }
    const existingUser = await getUserBySessionToken(sessionToken)
    if (!existingUser) {
      return res.sendStatus(403)
    }
    merge(req, { identity: existingUser })
    next()
  } catch (err) {}
}

export const updatedAt = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    merge(req, { updateAt: new Date() })
    next()
  } catch (error) {
    console.log(error)
  }
}
