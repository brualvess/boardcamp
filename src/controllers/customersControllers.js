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
        birthday: Joi.date().format('YYYY-MM-DD')

    })
    const { error } = schemaCustomers.validate(datas)
    if (error) {
        res.sendStatus(400)
        return
    }
    try {
        const { rows: cpf } = await connection.query(
            'SELECT * FROM customers WHERE cpf =$1', [datas.cpf]
        )
        if (cpf.length != 0) {
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
export async function listCustomers(req, res) {
    const cpf = req.query.cpf
    if (cpf) {
        const { rows: getCpf } = await connection.query(
            'SELECT * FROM customers WHERE cpf LIKE $1', [cpf + '%']
        )
        res.send(getCpf)
        return
    }
    const { rows: getCpf } = await connection.query(
        'SELECT * FROM customers'
    )
    res.send(getCpf)
}
export async function listWithId(req, res) {
    const id = parseInt(req.params.id)
    const { rows: getUser } = await connection.query(
        'SELECT * FROM customers WHERE  id =$1', [id]
    )
    if (getUser.length != 0) {
        res.send(getUser)
        return
    } else {
        res.sendStatus(404)
        return
    }

}
export async function updateCustomers(req, res) {
    const datas = req.body
    const id = parseInt(req.params.id)
    const schemaCustomers = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/),
        birthday: Joi.date().format('YYYY-MM-DD')
    })
    const { error } = schemaCustomers.validate(datas)
    if (error) {
        res.sendStatus(400)
        return
    }
    try {
        const { rows: cpf } = await connection.query(
            'SELECT * FROM customers WHERE cpf =$1', [datas.cpf]
        )
        if (cpf.length != 0) {
            res.sendStatus(409)
            return
        }
    } catch {
        res.sendStatus(500)
        return
    }
    await connection.query(
        `UPDATE customers SET
         name = $1,
         phone = $2,
         cpf = $3,
         birthday =$4
         WHERE id = $5`,
        [datas.name, datas.phone, datas.cpf, datas.birthday, id]
    )
    res.sendStatus(200)
} 