import React from 'react'
import { collection,query, where, getDocs,orderBy, deleteDoc } from "firebase/firestore"
import { useParams } from 'react-router-dom';
import { db } from './firebaseconfig';
import { useState, useEffect, useCallback, useRef } from 'react';


const Journalentry = () => {
  const [debitAmount, setDebitAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [tableRow, setTableRow] = useState([]);

  const { data } = useParams();
  if (!data) {
    console.log("please login in first")
  }

  function splitStringIntoLines(text) {
    return text.replace(/ {3,}/g, '\n');
  }

  function splitStringIntoLinesAndConvertToNumber(text) {
    const elements = text.split(/\s+/);
    let result = '';

    for (const element of elements) {
      const numberValue = parseFloat(element);
      if (!isNaN(numberValue) && isFinite(numberValue)) {
        result += numberValue + '\n';
      } else {
        result += element + ' ';
      }
    }
    return result.trim();
  }

  

  let isDataPopulated = useRef(false);
  // fetchAndPopulateTable(data);
  // loadInitialData(data);

  const fetchAndPopulateTable = useCallback(async (user_id) => {
    if (isDataPopulated.current) {
      return;
    }

    const collectionRef = collection(db, 'accounts');
    const q = query(collectionRef, where('user_id', '==', user_id), orderBy("timestamp", 'asc'));
    const querySnapshot = await getDocs(q);

    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      /*data.debit_statement = splitStringIntoLines(data.debit_statement);*/
      dataArray.push(data);
    });
    setTableRow(dataArray);

    isDataPopulated.current = true;


  }, []);
  loadInitialData(data);

  function loadInitialData(user_id) {
    fetchAndPopulateTable(user_id);
  }





  // const getAmountForMatchingUser = useCallback(async (user_id) => {
  //   try {
  //     const collectionRef = collection(db, 'accounts');
  //     const q = query(collectionRef, where('user_id', '==', user_id), orderBy("timestamp", 'asc'));
  //     const querySnapshot = await getDocs(q);
  //     let totaldebit = 0;
  //     let totalcredit = 0;
  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       if ('credit_amount' in data && 'debit_amount' in data) {
  //         totaldebit += Number(data.debit_amount);
  //         totalcredit += Number(data.credit_amount);
  //       }

  //     });


  //   console.log('Total Debit:', totaldebit);
  //   console.log('Total Credit:', totalcredit);
  //     setDebitAmount(totaldebit);
  //     setCreditAmount(totalcredit);
  //   } catch (error) {
  //     console.error('Error getting documents:', error);
  //     return [];
  //   }


  // }, []);
  const getAmountForMatchingUser = useCallback(async (user_id) => {
    try {
      const collectionRef = collection(db, 'accounts');
      const q = query(collectionRef, where('user_id', '==', user_id), orderBy("timestamp", 'asc'));
      const querySnapshot = await getDocs(q);
      let totaldebit = 0;
      let totalcredit = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Assuming you have 'debit_amount' and 'credit_amount' fields
        const fields = ['debit_amount', 'credit_amount'];

        fields.forEach((fieldName) => {
          if (fieldName in data) {
            const values = data[fieldName].split(/\s+/); // Split by one or more spaces
            values.forEach((value) => {
              const amount = parseFloat(value);
              if (!isNaN(amount)) {
                if (fieldName === 'debit_amount') {
                  totaldebit += amount;
                } else if (fieldName === 'credit_amount') {
                  totalcredit += amount;
                }
              }
            });
          }
        });
      });

      setDebitAmount(totaldebit);
      setCreditAmount(totalcredit);
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }, []);

  const handleDelete = async (snoToDelete) => {
    try {
      const q = query(collection(db, 'accounts'), where('sno', '==', snoToDelete));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      updateTable();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
  

  const updateTable = async () => {
    try {
      const q = query(collection(db, 'accounts'));
      const querySnapshot = await getDocs(q);
  
      const updatedTableData = [];
      let updatedDebitAmount = 0;
      let updatedCreditAmount = 0;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updatedTableData.push(data);
  
        // Update the total debit and credit amounts
        updatedDebitAmount += parseFloat(data.debit_amount);
        updatedCreditAmount += parseFloat(data.credit_amount);
      });
  
      // Set the updated data and amounts to your component state
      setTableRow(updatedTableData);
      setDebitAmount(updatedDebitAmount);
      setCreditAmount(updatedCreditAmount);
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };
  
  useEffect(() => {
    getAmountForMatchingUser(data);
  }, [data, getAmountForMatchingUser]);

  useEffect(() => {
    if (data) {
      fetchAndPopulateTable(data);
    }
  }, [data, fetchAndPopulateTable]);

    return (
    <div className='fullpage_l'>
      

      <div className='journal_table_l'>
        <table className='content_table_l'>
          <thead>
            <tr>
              <th>Sno</th>
              <th>Particulars</th>
              <th>Dr.</th>
              <th>Particulars</th>
              <th>Cr.</th>
              <th>L.F</th>
              <th className='nothing_l'></th>
              <th className='nothing_l'></th>

            </tr>
          </thead>
          <tbody id='journal_data_l'>

            {tableRow.map((item, index) => (
              <tr key={index} className='table_row_l'>
                <td className='table_data tab1_l'>{item.sno}</td>
                <td className='table_data tablet_l'>{splitStringIntoLines(item.debit_statement)}</td>
                {<td className='table_data tab1_l'>{splitStringIntoLinesAndConvertToNumber(item.debit_amount)}</td>}


                <td className='table_data_l'>{splitStringIntoLines(item.credit_statement)}</td>
                {<td className='table_data tab1_l'>{splitStringIntoLinesAndConvertToNumber(item.credit_amount)}</td>}


                <td className='table_data_l'>{item.folio}</td>
                <td className='table_data_l'>
                   {/* <button onClick={() => handleEdit(index)}>Edit</button>  */}
                  <button className='handleEdit_l'>Edit</button>
                </td>
                <td className='table_data_l'>
                  <button className='handleDelete_l' onClick={() => handleDelete(item.sno)}>Delete</button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
        <div class="total_line_l">
          <p class="final_total_tag_l">Total:</p>
          <p class="final_total_value_l total_debit_l">{debitAmount}</p>
          <p class="final_total_value_l total_credit_l">{creditAmount}</p>  
        </div>


      </div>

    </div>
  )
}

export default Journalentry;