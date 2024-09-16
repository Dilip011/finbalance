import React from 'react';
import Journal from "../images/journal.jpeg";
import Ledger from "../images/Ledger.jpeg"
import balance from "../images/balance.jpg"
import trailbalance from '../images/trialbalance.jpg';

import { useUserContext } from './Usercontext';
import { Link } from 'react-router-dom';

const Departement = () => {
  const { user } = useUserContext();

  if (!user) {
    return <div>Please log in first.</div>;
  }

  return (
    <div className='department_invoice'>
      

      <div className='department_invoice_outline'>
        <p className='accounting_quote'>Journal services.</p>
        <Link to={`/Journal/${user[5]}`}>
          <img className='department_invoice_outline_img' src={Journal} alt="Journal" />
        </Link>

        <p className='accounting_quote'>Ledger Services</p>
        <Link to={`/Ledger/${user[5]}`}>
          <img className='department_invoice_outline_img' src={Ledger} alt="Journal" />
        </Link>

        <p className='accounting_quote'>Trial Balance</p>
        <Link to={`/Trialbalance/${user[5]}`}>
          <img className='department_invoice_outline_img' src={trailbalance} alt="Journal" />
        </Link>

        <p className='accounting_quote'>Balance Sheet</p>
        <Link to={`/balancesheet`}>
          <img className='department_invoice_outline_img' src={balance} alt="Journal" />
        </Link>
      </div>

      
    </div>
  );
}

export default Departement;



