import jwt from 'jsonwebtoken'

export class Token {
    private secret = process.env.JWT_SECRET
    constructor(){}
    GenerateToken(userId: string) : string{
        // console.log(process.env.JWT_SECRET)
        const token = jwt.sign({userId},this.secret,{
            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
         })
        return token
    }
    ExtractId(token: string) : string {
        const decode = jwt.verify(token,this.secret) as {userId: string}
        return decode.userId
    }
}