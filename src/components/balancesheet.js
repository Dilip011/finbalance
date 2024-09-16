import React from 'react'
import Balance from "../images/balance.jpg"
import Trading from "../images/trading.jpg"
import { Link } from 'react-router-dom';
import { useUserContext } from './Usercontext';

const Balancesheet = () => {
  const { user } = useUserContext();

  if (!user) {
    return <div>Please log in first.</div>;
  }
  return (
    <div className='department_invoice'>
      

      <div className='department_invoice_outline'>
        <p className='accounting_quote'>Profit and Loss</p>
        <Link to={`/profitandloss/${user[5]}`}>
          <img className='department_invoice_outline_img' src={Balance} alt="Journal" />
        </Link>

        <p className='accounting_quote'>Trading</p>
        <Link to={`/trading/${user[5]}`}>
          <img className='department_invoice_outline_img' src={Trading} alt="Journal" />
        </Link>

        
      </div>

      
    </div>
  )
}

export default Balancesheet;