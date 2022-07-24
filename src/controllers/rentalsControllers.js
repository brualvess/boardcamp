import { connection } from '../dbStrategy/postgres.js'
import joi from 'joi'
import dayjs from 'dayjs'

export async function createRentals(req, res) {
    const datas = req.body
    const date = dayjs().locale('pt-br').format('YYYY-MM-DD')
    const schemaRentals = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1).required(),
    })
    const { error } = schemaRentals.validate(datas)
    if (error) {
        res.sendStatus(400)
        return
    }
    const { rows: getIdCustomer } = await connection.query(
        'SELECT * FROM customers WHERE id =$1', [datas.customerId]
    )
    const { rows: getIdGame } = await connection.query(
        'SELECT * FROM games WHERE id =$1', [datas.gameId]
    )
    if (getIdCustomer.length == 0 || getIdGame.length == 0) {
        res.sendStatus(400)
        return
    }
    const stockGames = getIdGame[0].stockTotal
    const { rows: rented } = await connection.query(
        'SELECT * FROM rentals WHERE "gameId" =$1 AND "returnDate" IS NULL',
        [datas.gameId]
    )
    if (rented.length >= stockGames) {
        res.sendStatus(400)
        return
    }
    const originalPrice = getIdGame[0].pricePerDay * datas.daysRented
    await connection.query(
        `INSERT INTO rentals(
        "customerId",
        "gameId", 
        "rentDate", 
        "daysRented",
        "returnDate",
        "originalPrice",
        "delayFee"
        ) 
    VALUES ( 
        ${datas.customerId},
        ${datas.gameId},
        '${date}',
        ${datas.daysRented},
        null,
        ${originalPrice},
        null
        )`
    )
    res.sendStatus(201)
}
export async function listRentals(req, res) {
    const customerId = parseInt(req.query.customerId)
    const gameId = parseInt(req.query.gameId)
    try {
        if (customerId) {
            const { rows: getRentals } = await connection.query(
                `SELECT rentals.*,
                 customers.id AS idc,  
                 customers.name AS nc,
                 games.id AS idg,
                 games.name,
                 games."categoryId",
                 categories.name AS cn
                FROM rentals
                JOIN customers
                ON rentals."customerId" = customers.id
                JOIN games
                ON rentals."gameId" = games.id
                JOIN categories 
                ON games."categoryId" = categories.id
                WHERE rentals."customerId" = $1
                `, [customerId]
            )
            const newArray = []
            for (let i = 0; i < getRentals.length; i++) {
                const obj = getRentals[i]
                newArray.push({
                    id: obj.id,
                    customerId: obj.customerId,
                    gameId: obj.gameId,
                    rentDate: obj.rentDate,
                    daysRented: obj.daysRented,
                    returnDate: obj.returnDate,
                    originalPrice: obj.originalPrice,
                    delayFee: obj.delayFee,
                    customer: {
                        id: obj.idc,
                        name: obj.nc
                    },
                    game: {
                        id: obj.idg,
                        name: obj.name,
                        categoryId: obj.categoryId,
                        categoryName: obj.cn
                    }
                })
            }

            res.send(newArray)
            return
        } else if (gameId) {
            const { rows: getRentals } = await connection.query(
                `SELECT rentals.*,
                 customers.id AS idc,  
                 customers.name AS nc,
                 games.id AS idg,
                 games.name,
                 games."categoryId",
                 categories.name AS cn
                FROM rentals
                JOIN customers
                ON rentals."customerId" = customers.id
                JOIN games
                ON rentals."gameId" = games.id
                JOIN categories 
                ON games."categoryId" = categories.id
                WHERE rentals."gameId" = $1
                `, [gameId]
            )
            const newArray = []
            for (let i = 0; i < getRentals.length; i++) {
                const obj = getRentals[i]
                newArray.push({
                    id: obj.id,
                    customerId: obj.customerId,
                    gameId: obj.gameId,
                    rentDate: obj.rentDate,
                    daysRented: obj.daysRented,
                    returnDate: obj.returnDate,
                    originalPrice: obj.originalPrice,
                    delayFee: obj.delayFee,
                    customer: {
                        id: obj.idc,
                        name: obj.nc
                    },
                    game: {
                        id: obj.idg,
                        name: obj.name,
                        categoryId: obj.categoryId,
                        categoryName: obj.cn
                    }
                })
            }

            res.send(newArray)
            return
        } else {
                const { rows: getRentals } = await connection.query(
                    `SELECT rentals.*,
                     customers.id AS idc,  
                     customers.name AS nc,
                     games.id AS idg,
                     games.name,
                     games."categoryId",
                     categories.name AS cn
                    FROM rentals
                    JOIN customers
                    ON rentals."customerId" = customers.id
                    JOIN games
                    ON rentals."gameId" = games.id
                    JOIN categories 
                    ON games."categoryId" = categories.id
                    `
                )
                const newArray = []
                for (let i = 0; i < getRentals.length; i++) {
                    const obj = getRentals[i]
                    newArray.push({
                        id: obj.id,
                        customerId: obj.customerId,
                        gameId: obj.gameId,
                        rentDate: obj.rentDate,
                        daysRented: obj.daysRented,
                        returnDate: obj.returnDate,
                        originalPrice: obj.originalPrice,
                        delayFee: obj.delayFee,
                        customer: {
                            id: obj.idc,
                            name: obj.nc
                        },
                        game: {
                            id: obj.idg,
                            name: obj.name,
                            categoryId: obj.categoryId,
                            categoryName: obj.cn
                        }
                    })
                }
    
                res.send(newArray)
                return
            }
        
    } catch {
        res.sendStatus(500)
    }
}

