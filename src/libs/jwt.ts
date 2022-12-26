import JWT from 'jsonwebtoken';
const secret = `${process.env.JWT_SECRET}` || "secret";
interface ITokenP {
data: any;
status: {
    isValid : boolean
    isExpired : boolean
}
};
export default class jwt {
    static sign(payload: any) {
        // console.log(payload)
        return JWT.sign(payload, secret as JWT.Secret, { expiresIn: "1s"}as JWT.SignOptions);
    }
    static verify(token: string): ITokenP {
        //verify the token and if it is valid, return the decoded token or null
        try {
            return {data:JWT.verify(token, secret as JWT.Secret)
            ,status: {isValid : true, isExpired : false}};
        }
        catch (err){
            if (err.name === "TokenExpiredError") {
                return {data:null,status: {isValid : false, isExpired : true}};
            }
            else {
                return {data:null,status: {isValid : false, isExpired : false}};
            }
        }
    }
}