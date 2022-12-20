import JWT from 'jsonwebtoken';
const secret = `${process.env.JWT_SECRET}` || "secret";
export default class jwt {
    static sign(payload: any, options?: any) {
       payload= JSON.stringify(payload);
        return JWT.sign(payload, secret, options);
    }
    static verify(token: string) {
        return JWT.verify(token, secret);
    }
    //verify and decode
    static decode(token: string) {
        return JWT.decode(token, { complete: true });
    }
}