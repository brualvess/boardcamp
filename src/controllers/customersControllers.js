import { connection } from '../dbStrategy/postgres.js'
import joi from 'joi'
import DateExtension from '@joi/date'
const Joi = joi.extend(DateExtension)
export async function createCustomers(req, res) {
    const datas = req.body
    const schemaCustomers = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/),
        birthday:Joi.date().format('YYYY-MM-DD')

    })
    const { error } = schemaCustomers.validate(datas)
    if (error) {
        res.sendStatus(400)
        return
    }
    try {
        const { rows: cpf } = await connection.query(
            `SELECT * FROM customers WHERE cpf = '${datas.cpf}'`
        )
        console.log(cpf)
        if (cpf.length != 0 ) {
            res.sendStatus(409)
            return
        }
    } catch {
        res.sendStatus(500)
        return
    }
    
    await connection.query(
        `INSERT INTO customers(
            name,
            phone, 
            cpf, 
            birthday) 
        VALUES ( 
            '${datas.name}', 
            '${datas.phone}', 
             '${datas.cpf}',  
             '${datas.birthday}'
            )`
    )
    res.sendStatus(201)
}