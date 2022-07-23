import { connection } from '../dbStrategy/postgres.js'
import joi from 'joi'
import dayjs from 'dayjs'

export async function createRentals(req, res){
    const datas = req.body
    const date = dayjs().locale('pt-br').format('YYYY-MM-DD')
    const schemaRentals= joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1).required(),
    })
    const { error } = schemaRentals.validate(datas)
    if (error) {
        res.sendStatus(400)
        return
    }
    const {rows:getIdCustomer} = await connection.query(
        'SELECT * FROM customers WHERE id =$1',[datas.customerId]
    )
    const {rows:getIdGame} = await connection.query(
        'SELECT * FROM games WHERE id =$1',[datas.gameId]
    )
    if(getIdCustomer.length == 0 || getIdGame.length == 0){
        res.sendStatus(400)
        return
    }
    const stockGames = getIdGame[0].stockTotal
    const {rows: rented} =  await connection.query(
        'SELECT * FROM rentals WHERE "gameId" =$1 AND "returnDate" IS NULL',
        [datas.gameId]
    )
    if(rented.length >= stockGames){
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
