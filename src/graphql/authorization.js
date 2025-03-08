
export const  isAuthorized=(context,roles)=>{
  
   if(!roles.includes(context.authuser.role)) 
      throw new Error("not authorized!😡",{cause:401})
   
   
       
   }