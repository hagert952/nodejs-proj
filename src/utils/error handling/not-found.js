export const notfound=(req,res,next)=>{
    return next(new Error("invalid url"
       ,{cause:404}
    ))
 }