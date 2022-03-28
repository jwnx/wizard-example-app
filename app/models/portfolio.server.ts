import type { Portfolio } from "@prisma/client";
import { Err, None, Ok, Option, Result, Some } from "oxide.ts"

import { prisma } from "~/db.server";

export type { Portfolio } from "@prisma/client";

export interface GetPortfolioById {
  readonly pfId: string
  readonly userId: string
}

export async function getPortfolioById({ pfId, userId}: GetPortfolioById): Promise<Option<Portfolio>> {
  const portfolio = await prisma.portfolio.findFirst({
    where: { id: pfId, user: { some: { id: userId } } }
  })

  return portfolio ? Some(portfolio) : None
}

export interface CreateOrUpdatePortfolio {
  readonly id?: string
  readonly name: string
  readonly description: string
  readonly alias: string
  readonly userId: string
}

export async function createOrUpdatePortfolio({ id, name, description, alias, userId }: CreateOrUpdatePortfolio): Promise<Result<Portfolio, unknown>> {
  try {
    const pf = await prisma.portfolio.upsert({
      create: {
        name,
        description,
        alias,
        user: {
          connect: { id: userId }
        }
      },
      update: {
        name,
        description,
        alias,
      },
      where: {
        id,
      }
    })

    return Ok(pf)
  } catch (e) {
    return Err(e)
  }
}

export interface DeletePortfolio {
  readonly pfId: string
  readonly userId: string
}

export async function deletePortfolio({ pfId, userId }: DeletePortfolio): Promise<Result<boolean, unknown>> {
  try {
    const data = await prisma.portfolio.delete({
      where: { id: pfId }
    })

    return Ok(true)
  } catch (e) {
    return Err(e)
  }
}

export interface GetPortfoliosForUser {
  readonly userId: string
}

export async function getPorfoliosForUser({ userId }: GetPortfoliosForUser): Promise<Portfolio[]> {
  const data = await prisma.portfolio.findMany({
    where: {
      user: {
        some: {
          id: userId,
        }
      }
    }
  })

  return data
}

export interface SetDefaultPortfolioForUser {
  readonly pfId: string
  readonly userId: string
}

export async function setDefaultPortfolioForUser({ pfId, userId }: SetDefaultPortfolioForUser): Promise<Result<boolean, unknown>> {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: pfId,
        user: {
          some: {
            id: userId,
          }
        }
      }
    })

    if (portfolio) {
      await prisma.user.update({
        data: {
          defaultPortfolio: portfolio.id,
        },
        where: { id: userId }
      })

      return Ok(true)
    }

    return Err("Portfolio doesn't exist for this user.")
  } catch (e) {
    return Err(e)
  }
}