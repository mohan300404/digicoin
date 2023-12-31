import React, { useEffect, useState } from 'react'
import { CoinList } from '../../config/api'
import { CryptoState } from '../../CryptoContext'
import axios from 'axios'
import { ThemeProvider } from '@emotion/react'
import { Container, LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography ,createTheme} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { numberWithCommas } from './Carousel'



const CoinsTable = () => {
const [coins,setCoins]=useState([])
const [loading,setLoading]=useState(false)
const [search,setSearch]=useState("")
const [page,setPage]=useState(1)
const navigate=useNavigate();

const{currency,symbol}=CryptoState();

const darkTheme=createTheme({
    palette:{
      primary:{
        main:"#fff",
      },
      mode: "dark",
    },
  })

const fetchCoins=async()=>{
    setLoading(true)
    const {data}=await axios.get(CoinList(currency))
    setCoins(data)
    setLoading(false)
}

useEffect(()=>{
    fetchCoins();   
},[currency])

  const handleSearch=()=>{
    return coins.filter((coin)=>
        coin.name.toLowerCase().includes(search)||
        coin.symbol.toLowerCase().includes(search)
    )  
  }

  return (
    <ThemeProvider theme={darkTheme}>
        <Container style={{   textAlign:"center"
        }}>
        <Typography variant='h4'
        style={{margin:18, fontFamily:"Monsterrat"}}>
            Cryptocurrency Prices by Market Cap
        </Typography>

            <TextField  label="Search for a Crypto Currency" variant='outlined' 
            style={{marginBottom:20,width:"100%"}}
            onChange={(e)=>setSearch(e.target.value)}/>

            <TableContainer>
                {loading ?(
                    <LinearProgress style={{backgroundColor:"gold"}}
                    />
                ):(
                    <Table aria-label="simple table">
                        <TableHead style={{backgroundColor:"#EEBC1D"}}>
                            <TableRow>
                              {["Coin","Price","24 Change","Market Cap"].map((head)=>(
                                <TableCell style={{
                                    color:"black",fontWeight:"700",
                                    fontFamily:"Monsterrat",
                                }}
                            key={head}
                            align={head ==="Coin" ? "":"right"}
                            >{head}</TableCell>
                              ))}  
                            </TableRow>
                        </TableHead>

                      <TableBody>
                        {handleSearch().slice((page-1)*10,(page-1)*10+10).map((row)=>{
                            const profit=row.price_change_percentage_24h > 0;
                        
    return (
        <TableRow onClick={()=>navigate(`/coins/${row.id}`)}
            className='row'
                key={row.name}>
                    <TableCell component="th" scope='row' style={{
                        display:"flex",
                        gap:15,
                        }}>
                        <img src={row?.image} alt={row.name} 
                            height="50"
                            style={{marginBottom:10}}/> 
                        <div style={{display:"flex",flexDirection:"column"}}>
                            <span style={{textTransform:"uppercase",fontSize:22,}}>
                            {row.symbol} 
                            </span>
                             <span style={{color:"darkgrey"}}>{row.name}</span>
                         </div>  
                    </TableCell>
                   <TableCell
                       align="right"
                   >
                   {symbol}{" "}
                    {numberWithCommas(row.current_price.toFixed(2))}
                    </TableCell>
                    <TableCell align='right'
                    style={{
                        color:profit >0 ?"rgb(53, 255, 3)":"rgb(252, 4, 4)",
                        fontWeight:500,
                    }}>
                    {profit && "+"}
                    {row.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell align='right'>
                    {symbol}{" "}
                    {numberWithCommas(row.market_cap.toString().slice(0,-6))}M
                </TableCell>
                </TableRow>
    )
                        })}
                       </TableBody>
                    </Table>
                )}
            </TableContainer>
            <Pagination 
            className='pagination'
            
            style={{
                
                padding:20,
                width:"100%",
                display:"flex",
                justifyContent:"center",
            }}
            count={(handleSearch()?.length/10).toFixed(0)}
            onChange={(_,value)=>{
            setPage(value);
            window.scroll(0,450);
        }}
            />

        </Container>
    </ThemeProvider>
  )
}

export default CoinsTable