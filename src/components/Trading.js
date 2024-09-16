import React from 'react'
import { collection,query, where, getDocs,orderBy, deleteDoc,doc,setDoc,serverTimestamp,updateDoc } from "firebase/firestore"
import { useParams } from 'react-router-dom';
import { db } from './firebaseconfig';
import { useState, useEffect, useCallback, useRef } from 'react';


const Journalentry = () => {
  const [debitAmount, setDebitAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [tableRow, setTableRow] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [selectedSno, setSelectedSno] = useState(null);
  const [updatedSno, setUpdatedSno] = useState('');
  const [updatedDebitStatement, setUpdatedDebitStatement] = useState('');
  const [updatedDebitAmount, setUpdatedDebitAmount] = useState('');
  const [updatedCreditStatement, setUpdatedCreditStatement] = useState('');
  const [updatedCreditAmount, setUpdatedCreditAmount] = useState('');
  const [updatedLedgerFolio, setUpdatedLedgerFolio] = useState('');

  const { data } = useParams();
  const database = db
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

    const collectionRef = collection(db, 'trading');
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

  async function addData() {
    let sno = document.sample.sno.value
    let particulars_for_debit = document.sample.particulars_for_debit.value;
    let amount_debit = document.sample.amount_debit.value;
    let particulars_for_credit = document.sample.particulars_for_credit.value;
    let amount_credit = document.sample.amount_credit.value;
    let ledger_folio = document.sample.ledger_folio.value;

    if (
      sno === '' ||
      particulars_for_debit === '' ||
      amount_debit === '' ||
      particulars_for_credit === '' ||
      amount_credit === '' ||
      ledger_folio === ''
    ) {
      return;
    }

    var tr = document.createElement('tr');
    var td1 = tr.appendChild(document.createElement('td'))
    var td2 = tr.appendChild(document.createElement('td'));
    var td3 = tr.appendChild(document.createElement('td'));
    var td4 = tr.appendChild(document.createElement('td'));
    var td5 = tr.appendChild(document.createElement('td'));
    var td6 = tr.appendChild(document.createElement('td'));

    td1.innerHTML = sno;
    const debitStatementWithLineBreaks = splitStringIntoLines(particulars_for_debit);
    const debitparagraphs = debitStatementWithLineBreaks.split('\n').map((line, index) => (
      `<p key=${index}>${line}</p>`
    ));

    td2.innerHTML = debitparagraphs.join('<br>');
    const debitAmountWithLineBreaks = splitStringIntoLinesAndConvertToNumber(amount_debit);
    const debitamountparagraphs = debitAmountWithLineBreaks.split('\n').map((line, index) => (
      `<p key=${index}>${line}</p>`
    ));

    td3.innerHTML = debitamountparagraphs;
    const creditStatementWithLineBreaks = splitStringIntoLines(particulars_for_credit);
    const creditparagraphs = creditStatementWithLineBreaks.split('\n').map((line, index) => (
      `<p key=${index}>${line}</p>`
    ));
    td4.innerHTML = creditparagraphs.join('<br>');
    const creditAmountWithLineBreaks = splitStringIntoLinesAndConvertToNumber(amount_credit);
    const creditamountparagraphs = creditAmountWithLineBreaks.split('\n').map((line, index) => (
      `<p key=${index}>${line}</p>`
    ));

    td5.innerHTML = creditamountparagraphs;
    td6.innerHTML = ledger_folio;

    document.getElementById("journal_data_l").appendChild(tr);

    try {
      const docRef = doc(collection(database, 'trading'));
      // const newDocId = docRef.id;
      await setDoc(docRef, {
        sno: sno,
        debit_statement: particulars_for_debit,
        debit_amount: amount_debit,
        credit_statement: particulars_for_credit,
        credit_amount: amount_credit,
        folio: ledger_folio,
        user_id: data,
        timestamp: serverTimestamp(),
      })
      document.sample.sno.value = ''
      document.sample.particulars_for_debit.value = ''
      document.sample.amount_debit.value = ''
      document.sample.particulars_for_credit.value = ''
      document.sample.amount_credit.value = ''
      document.sample.ledger_folio.value = ''

      isDataPopulated = false;
      getAmountForMatchingUser(data);


    } catch (error) {
      console.error('Error adding data to Firestore: ', error);
    }
  }



  const getAmountForMatchingUser = useCallback(async (user_id) => {
    try {
      const collectionRef = collection(db, 'trading');
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

  const handleEdit = (sno) => {
    setIsEditMode(true);
    setSelectedSno(sno);
  };

  const handleUpdate = async () => {
    try {
      const q = query(collection(db, 'trading'), where('sno', '==', selectedSno));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (document) => {
        const docRef = doc(db, 'trading', document.id);
  
        
        await updateDoc(docRef, {
          sno: updatedSno,
          debit_statement: updatedDebitStatement,
          debit_amount: updatedDebitAmount,
          credit_statement: updatedCreditStatement,
          credit_amount: updatedCreditAmount,
          ledger_folio: updatedLedgerFolio,
        });
      });

      const rows = document.querySelectorAll('table tbody tr');

      // rows.forEach((row) => {
      //   const cells = row.querySelectorAll('td');
      //   const snoCell = cells[0]; // Assuming the sno is in the first cell of each row

      //   if (snoCell.textContent === selectedSno) {
      //     // Update specific cells with new values
      //     cells[0].textContent = updatedSno;
      //     cells[1].textContent = updatedDebitStatement;
      //     cells[2].textContent = updatedDebitAmount;
      //     cells[3].textContent = updatedCreditStatement;
      //     cells[4].textContent = updatedCreditAmount;
      //     cells[5].textContent = updatedLedgerFolio;
      //   }
      // });
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const snoCell = cells[0]; // Assuming the sno is in the first cell of each row
      
        if (snoCell.textContent === selectedSno) {
          // Update specific cells with new values
          cells[0].textContent = updatedSno;
          // Clear the existing content
          cells[1].innerHTML = '';
      
          // Conditionally add debit statement
          if (updatedDebitStatement) {
            cells[1].innerHTML += `<div class="debit-statement">${splitStringIntoLines(updatedDebitStatement)}</div>`;
          }
      
          // Conditionally add credit statement below debit
          if (updatedCreditStatement) {
            cells[1].innerHTML += `<div class="credit-statement">&nbsp;&nbsp;${splitStringIntoLines(updatedCreditStatement)}</div>`;
          }
      
          cells[2].textContent = updatedDebitAmount;
          cells[3].textContent = updatedCreditAmount;
          cells[4].textContent = updatedLedgerFolio;
        }
      });
     
  
      // After successful update, reset the edit mode and selectedSno
      
      setIsEditMode(false);
      setSelectedSno(null);
      
      document.querySelector('input[name="SNO"]').value = '';
      document.querySelector('textarea[name="PARTICULARS_FOR_DEBIT"]').value = '';
      document.querySelector('textarea[name="AMOUNT_DEBIT"]').value = '';
      document.querySelector('textarea[name="PARTICULARS_FOR_CREDIT"]').value = '';
      document.querySelector('textarea[name="AMOUNT_CREDIT"]').value = '';
      document.querySelector('input[name="LEDGER_FOLIO"]').value = '';

      // Fetch and update the table data if needed
      fetchAndPopulateTable(data);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDelete = async (snoToDelete) => {
    try {
      const q = query(collection(db, 'trading'), where('sno', '==', snoToDelete));
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
      const q = query(collection(db, 'trading'));
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

  const renderForm = () => {
    if (isEditMode) {
      // Update Data Form
      return (
        <div id='update_data'>
          <form method='post' name='update_sample'>
            <input
              name='SNO'
              type='text'
              id='txt'
              rows='1'
              placeholder='SNO'
              autoComplete='off'

              // value={updatedSno}
              onChange={(e) => setUpdatedSno(e.target.value)}
              
              
              required
            />
            <textarea
              name="PARTICULARS_FOR_DEBIT"
              id="txt"
              placeholder="Enter the Particulars for Debit"
              rows="1"
              autoComplete="off"
              // value={updatedDebitStatement}
              onChange={(e) => setUpdatedDebitStatement(e.target.value)}
              required
              // onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <textarea
              name="AMOUNT_DEBIT"
              id="txt"
              placeholder="Enter the Amount for debit"
              rows="1"
              autoComplete="off"
              // value={updatedDebitAmount}
              onChange={(e) => setUpdatedDebitAmount(e.target.value)}
              required
              // onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <textarea
              name="PARTICULARS_FOR_CREDIT"
              id="txt"
              placeholder="Enter the Particulars for Credit"
              rows="1"
              autoComplete="off"
              // value={updatedCreditStatement}
              onChange={(e) => setUpdatedCreditStatement(e.target.value)}
              required
              // onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <textarea
              name="AMOUNT_CREDIT"
              id="txt"
              placeholder="Enter the Amount for debit"
              rows="1"
              autoComplete="off"
              // value={updatedCreditAmount}
              onChange={(e) => setUpdatedCreditAmount(e.target.value)}
              required
              // onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <input
              name='LEDGER_FOLIO'
              id="txt"
              type="text"
              placeholder='Enter the Ledger Folio'
              rows='1'
              autoComplete='off'
              // value={updatedLedgerFolio}
              onChange={(e) => setUpdatedLedgerFolio(e.target.value)}
              required
            />
            <input
              name='update_data_button'
              id='btn'
              rows='1'
              type="button"
              value="Update Data"
              onClick={handleUpdate}
            />
          </form>
        </div>
      );
    } else {
      // Add Data Form
      return (
        <div id='add_data'>
          <form method='post' name='sample'>
            <input name='sno' type='text' id='txt' placeholder='SNO' autoComplete='off' required />
            <textarea
              name="particulars_for_debit"
              id="txt"
              placeholder="Enter the Particulars for Debit"
              rows="1"
              autoComplete="off"
              required
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <textarea
              name="amount_debit"
              id="txt"
              placeholder="Enter the Amount for debit"
              rows="1"
              autoComplete="off"
              required
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <textarea
              name="particulars_for_credit"
              id="txt"
              placeholder="Enter the Particulars for Credit"
              rows="1"
              autoComplete="off"
              required
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <textarea
              name="amount_credit"
              id="txt"
              placeholder="Enter the Amount for debit"
              rows="1"
              autoComplete="off"
              required
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <input name='ledger_folio' id="txt" type="text" placeholder='Enter the Ledger Folio' autoComplete='off' required />
            <input name='data_button' id='btn' type="button" value="Add Data" onClick={addData} />
          </form>
        </div>
      );
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
      
      {renderForm()}

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
                   <button className='handleEdit' onClick={() => handleEdit(item.sno)}>Edit</button> 
                  {/* <button className='handleEdit_l'>Edit</button> */}
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