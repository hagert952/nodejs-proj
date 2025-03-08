import nodemailer from 'nodemailer';
export const sendEmail=async({to,subject,html})=>{
    //transporter >> generate 
 const transporter=   nodemailer.createTransport({
        //service >>outlook , gmail , yahoo>> 500M
        host:"smtp.gmail.com",
        port:587 ,
        secure:false,//true >>tls encryption
        auth:{
            user:process.env.EMAIL,
          
            pass:process.env.PASSWORD
        }
    })

const info= await transporter.sendMail({
from:`"saraha app"<${process.env.EMAIL}>`
,to
,subject,
html
})
console.log(info);
if(info.rejected.length>0)return false;
return true;
}