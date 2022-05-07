// export function Role(role: string) {

import { Request, Response, Router } from "express"
import {ClassConstructor,plainToClass} from 'class-transformer'
import { validate, validateSync,ValidationOptions, ValidatorOptions } from "class-validator"
import { UserRole } from "../models/model"

// }

// const AuthMetadataKey = Symbol("auth");

// export function http() {
//     return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         const original = descriptor.value
//         descriptor.value = function(...args: any[]) {
//             let authParameters = Reflect.getOwnMetadata(AuthMetadataKey,target,propertyKey)
//             if (authParameters) {
//                 for (let parameterIndex of authParameters ){
//                     console.log(parameterIndex,args[parameterIndex])
//                 }
//             } 
//             original.apply(this,args)
//         }
//         return descriptor
//     }
// }


// export function Auth() {
//     return function(target: any, key: string | symbol, parameterIndex: number) {
//         let existingAuthParamaters =  Reflect.getOwnMetadata(AuthMetadataKey,target,key) || []
//         existingAuthParamaters.push(parameterIndex)
//         Reflect.defineMetadata(AuthMetadataKey,existingAuthParamaters,target,key)
//     }
// }

const SINGLETON_KEY = "instance"
const RequestKey = Symbol("request")
const ResponseKey = Symbol("response")
const BodyKey = Symbol("body")
// const BodyKey = Symbol("")

//method decorator
export function Auth() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value
        descriptor.value = function (...args: any[]) {
            const requestIndex = Reflect.getOwnMetadata(RequestKey,target,propertyKey)
            const responseIndex = Reflect.getOwnMetadata(ResponseKey,target,propertyKey)
            if (requestIndex !== null && requestIndex !== undefined && responseIndex !== null && responseIndex !== undefined){
                const req = args[requestIndex] as Request
                const res = args[responseIndex] as Response
                if (!req.session.user) {
                    return res.status(401).send({message: "user not authenticated"})
                }
            }
            original.apply(this, args)
        }
        return descriptor 
    }
}

export function Role(role: UserRole) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value
        descriptor.value = function(...args: any[]) {
            const requestIndex = Reflect.getOwnMetadata(RequestKey,target,propertyKey)
            const responseIndex = Reflect.getOwnMetadata(ResponseKey,target,propertyKey)
            if (requestIndex !== null && requestIndex !== undefined && responseIndex !== null && responseIndex !== undefined){
                const req = args[requestIndex] as Request
                const res = args[responseIndex] as Response
                if (!req.session.user) {
                    return res.status(401).send({message: "user not authenticated"})
                }
                if (req.session.user.role !== role){
                    return res.status(401).send({message: "permission denied"})
                }
            }
            original.apply(this,args)
        }
        return descriptor
    }
}

export function VerifyId(auth: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value
        descriptor.value = function (...args: any[]) {
            const requestIndex = Reflect.getOwnMetadata(RequestKey,target,propertyKey)
            const responseIndex = Reflect.getOwnMetadata(ResponseKey,target,propertyKey)
            if (requestIndex !== null && requestIndex !== undefined && responseIndex !== null && responseIndex !== undefined){
                const req = args[requestIndex] as Request
                const res = args[responseIndex] as Response
                if (auth) {
                    if (!req.session.user) {
                        return res.status(401).send({message: "user not authenticated"})
                    }
                    if (!req.params.id){
                        return res.status(400).send({message: "id not provided"})
                    }
                    if (req.session.user.role !== UserRole.ADMIN && req.session.user.id !== req.params.id){
                        return res.status(401).send({message: "access denied"})
                    }
                }else {
                    if (!req.params.id) {
                        return res.status(400).send({message: "id not provided"})
                    }
                }
            }
            original.apply(this, args) 
        }
        return descriptor
    }
}

//method decorator 
export function ValidateBody(classToBeValidated: ClassConstructor<any>,options: ValidatorOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor){
        const original = descriptor.value
        descriptor.value = function (...args: any[]) {
            const requestIndex = Reflect.getOwnMetadata(RequestKey,target,propertyKey)
            const responseIndex = Reflect.getOwnMetadata(ResponseKey,target,propertyKey)
            if (requestIndex !== null && requestIndex !== undefined && responseIndex !== null && responseIndex !== undefined ){
                const req = args[requestIndex] as Request
                const res = args[responseIndex] as Response
                console.log(req.body)
                const objInstance = plainToClass(classToBeValidated,req.body)
                const errors = validateSync(objInstance,options || {})
                if (errors.length !== 0 ){
                    return res.status(403).send(errors[0])
                }
            }
            original.apply(this, args)
        }
        return descriptor
    }
}

//parameter decorator
export function Req() {
    return function (target: any, key: string | symbol, parameterIndex: number) {
        let existingAuthParamaters = Reflect.getOwnMetadata(RequestKey, target, key) || null
        existingAuthParamaters = parameterIndex
        Reflect.defineMetadata(RequestKey,existingAuthParamaters, target, key)
    }
}

export function Res() {
    return function (target: any, key: string | symbol, parameterIndex: number) {
        let existingAuthParamaters = Reflect.getOwnMetadata(ResponseKey, target, key) || null
        existingAuthParamaters = parameterIndex
        Reflect.defineMetadata(ResponseKey,existingAuthParamaters, target, key)
    }
}

// export function body() {
//     return function (target: any, key: string | symbol, parameterIndex: number) {
//         let existingBodyParamaters = Reflect.getOwnMetadata(BodyKey, target, key) || null
//         existingBodyParamaters = parameterIndex
//         Reflect.defineMetadata(BodyKey,existingBodyParamaters, target, key)
//     }
// }

type Constructor = {new (...args: any[]): any}

export function Singelton<T extends Constructor>() {
    return function(baseClass: T){
        return new Proxy(baseClass,{
            construct(target: T,args: any[],newTarget: Function){
                if (target.prototype !== newTarget.prototype) {
                    return Reflect.construct(target,args,newTarget);
                }
                // if our target class does not have an instance, create it
                if (!target[SINGLETON_KEY]) {
                    target[SINGLETON_KEY] = Reflect.construct(target,args,newTarget);
                }
                // return the instance we created!
                return target[SINGLETON_KEY]; 
            }
        })
    }
}