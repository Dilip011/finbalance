// import React from 'react'
// import Add_Data_in_form from "../images/Add data.jpg"
// import { db, app } from "./firebaseconfig"
// import { collection, doc, query,where, getDocs, setDoc, serverTimestamp } from "firebase/firestore"
// import { useUserContext } from './Usercontext';


// const Data_entry = () => {
//   const {user} = useUserContext();
  
//   // const usermainid = user[5];

//   async function addData() {
//     let sno = document.sample.sno.value
//     let particulars_for_debit = document.sample.particulars_for_debit.value;
//     let amount_debit = document.sample.amount_debit.value;
//     let particulars_for_credit = document.sample.particulars_for_credit.value;
//     let amount_credit = document.sample.amount_credit.value;
//     let ledger_folio = document.sample.ledger_folio.value;

//     var tr = document.createElement('tr');
//     var td1 = tr.appendChild(document.createElement('td'))
//     var td2 = tr.appendChild(document.createElement('td'));
//     var td3 = tr.appendChild(document.createElement('td'));
//     var td4 = tr.appendChild(document.createElement('td'));
//     var td5 = tr.appendChild(document.createElement('td'));
//     var td6 = tr.appendChild(document.createElement('td'));

//     td1.innerHTML = sno;
//     td2.innerHTML = particulars_for_debit;
//     td3.innerHTML = amount_debit;
//     td4.innerHTML = particulars_for_credit;
//     td5.innerHTML = amount_credit;
//     td6.innerHTML = ledger_folio;

//     document.getElementById("journal_data").appendChild(tr);
//     try {
//       const docRef = doc(collection(db, 'accounts'));
//       const newDocId = docRef.id;
//       await setDoc(docRef, {
//         sno:sno,
//         debit_statement:particulars_for_debit,
//         debit_amount:amount_debit,
//         credit_statement:particulars_for_credit,
//         credit_amount:amount_credit,
//         folio:ledger_folio,
//         // user_id:usermainid,
//         timestamp:serverTimestamp(),
//       })
     
//     } catch (error) {
//       console.error('Error adding data to Firestore: ', error);
//     }
//    }
  

// return (

//     <div>

//       <div id="add_data">
//         <img src={Add_Data_in_form} alt="" className='add_data_in_form' />
//         <form method='post' name='sample'>
//           <input name='sno' type="text" placeholder='SNO' />
//           <input name='particulars_for_debit' type="text" placeholder='Enter the Particulars for Debit' />
//           <input name='amount_debit' type="number" placeholder='Enter the amount the for Debit' />
//           <input name='particulars_for_credit' type="text" placeholder='Enter the Particulars for Credit' />
//           <input name='amount_credit' type="number" placeholder='Enter the amount for Credit' />
//           <input name='ledger_folio' type="text" placeholder='Enter the Ledger Folio' />
//           <input name='data_button' type="button" value="Add Data" onClick={addData} />
//         </form>
//       </div>

//     </div>
//   )
// }

// export default Data_entry;