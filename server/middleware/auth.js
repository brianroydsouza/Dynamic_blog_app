import jwt from "jsonwebtoken"
export const auth= (req ,res , next)=>{
    try {
        let token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1];
            let user = jwt.verify(token,process.env.SECRET_KEY )
            req.tokenUserId = user.id
            next()
        }else{
            res.status(401).json({message:'Unauthorized user'})
        }
    } catch (error) {
        res.status(500).json({message:"something went wrong in auth"})
    }
}
