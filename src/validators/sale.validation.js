import { check } from "express-validator";
import { validateSchema } from "../helpers/expressValidator.js";
import { param } from "express-validator";
import mongoose from 'mongoose';

const allowedFields = ['date', 'products', 'amount', 'taxes', 'discount', 'idSeller', 'idClient']

export const validateCreateSale = [
    check("date")
        .exists().withMessage("Debe colocar una fecha")
        .matches(/^(\d{2})\/(\d{2})\/(\d{4})$/).withMessage('La fecha debe seguir el formato "día/mes/año" (ejemplo: "10/04/2012")')
        .custom(value => {
            // Validar si la fecha es válida
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(`${year}-${month}-${day}`);
            return (date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year);
        }).withMessage('La fecha proporcionada no es válida'),

    check("products")
        .exists().withMessage("debe elegir los productos")
        .isAlphanumeric().withMessage("Debe colocar productos"),

    check("amount")
        .exists().withMessage("Debe colocar las cantidades de cada producto")
        .isArray().withMessage("El campo debe ser un array")
        .custom((value) => {
            // Verifica que el array no esté vacío
            if (value.length === 0) {
                throw new Error('El array no puede estar vacío');
            }

            // Verifica que cada elemento del array sea un número
            const allNumbers = value.every(item => typeof item === 'number' && !isNaN(item));
            if (!allNumbers) {
                throw new Error('Todos los elementos del array deben ser números');
            }
            
            return true;
        }).withMessage("Todos los elementos del array deben ser números"),

    check("taxes")
        .optional()
        .exists().withMessage("Debe colocar los impuestos")
        .isNumeric().withMessage("Los impuestos solo pueden ser numericos"),

    check("discount")
        .optional()
        .exists().withMessage("Debe colocar los descuentos")
        .isNumeric().withMessage("Los descuentos solo pueden ser numericos"),

    check("idSeller")
        .exists().withMessage("Debe colocar el id del vendedor")
        .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('El ID del vendedor invalido'),

    check("idClient")
        .exists().withMessage("Debe colocar el id del cliente")
        .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('El ID del cliente es invalido'),

    validateSchema(allowedFields)
]

export const validateSaleId = [
    check("idSeller")
        .optional()
        .exists().withMessage("el id de la venta es obligatorio")
        .isAlphanumeric().withMessage("El id es invalido"),

    check("idClient")
        .optional()
        .exists().withMessage("el id de la venta es obligatorio")
        .isAlphanumeric().withMessage("El id es invalido"),

    validateSchema(allowedFields)

]

export const validateDate = [

    check("date")
        .exists().withMessage("Debe colocar una fecha")
        .matches(/^(\d{2})\/(\d{2})\/(\d{4})$/).withMessage('La fecha debe seguir el formato "día/mes/año" (ejemplo: "10/04/2012")')
        .custom(value => {
            // Validar si la fecha es válida
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(`${year}-${month}-${day}`);
            return (date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year);
        }).withMessage('La fecha proporcionada no es válida'),

    validateSchema(allowedFields)

]
