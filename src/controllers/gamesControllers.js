import {connection} from '../dbStrategy/postgres.js'
import joi from 'joi'

export async function createGames(req,res){
    const datas = req.body
    const schemaCategorie = joi.object({
        name: joi.string().required(),
        image: joi.string().allow(''),
        stockTotal:joi.number().greater(0),
        categoryId: joi.number(),
        pricePerDay: joi.number().greater(0),

    })
     const {error} = schemaCategorie.validate(datas)
    const {rows:verifyIdCategorie} = await connection.query(
        `SELECT * FROM categories WHERE id = ${datas.categoryId}`
        )
    if(error || verifyIdCategorie.length == 0 ){
        res.sendStatus(400)
        return
    }
    const{rows:verifyNameGame} = await connection.query(
        `SELECT * FROM games WHERE name = '${datas.name}'`
    )
    if(verifyNameGame.length != 0){
        res.sendStatus(409)
        return
    }
    await connection.query(
        `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
        VALUES ( 
            '${datas.name}', 
            '${datas.image}', 
             ${datas.stockTotal}, 
             ${datas.categoryId}, 
             ${datas.pricePerDay}
            )`
        )
   res.sendStatus(201)
}
export async function listGames(req,res){
    try{
        const {rows:games} = await connection.query(
            `SELECT 
             games.*,
             categories.name AS "categoryName"
             FROM games 
             JOIN categories
             ON games."categoryId" = categories.id`
         )
        res.send(games)
      }catch{
         res.sendStatus(500)
      }
      
}