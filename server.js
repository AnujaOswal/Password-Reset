import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import color from "colors";
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'
import authroute from './routes/authroute.js'

dotenv.config();

 connectDB();

const app = express();

//app.use(bodyParser.json())

app.use(express.json())

if(process.env.NODE_ENV === 'development')
{
    app.use(cors({
        origin:process.env.CLIENT_URL
    }))
    app.use(morgan('dev'));
    //morgan give info of each request
    //cors alllows to deal with react for localhost at port 3000 without errors
}

//loading routes
app.use('/api',authroute);

app.use((req,res,next)=>{
    res.status(404).json({
        success:false,
        message:'page not found'
    })
});
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(color.yellow.underline(`Server-App listening on port ${PORT}`));
})
