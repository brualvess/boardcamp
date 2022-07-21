import {connection} from '../dbStrategy/postgres.js'
import joi from 'joi'
export async function createCategories(req, res){
    const datas = req.body
    const schemaCategorie = joi.object({
        name: joi.string().required()   
    })
    const {error} = schemaCategorie.validate(datas)
    if (error) {
        res.sendStatus(400)
        return
    }
    try{
        const {rows:users} = await connection.query(`SELECT * FROM categories WHERE name = '${datas.name}'`)
        console.log(users)
        if(users.length != 0 ){
            res.sendStatus(409)
            return
        }
    } catch{
        res.sendStatus(500)
        return
    }
   await connection.query(`INSERT INTO categories (name) VALUES ('${datas.name}')`)
    res.sendStatus(201)
}

