import React from 'react'
import { collection, doc, query, where, getDocs, setDoc, serverTimestamp, orderBy, deleteDoc, updateDoc} from "firebase/firestore"
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
  const database = db;
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

  // function splitStringIntoLinesAndConvertToNumber(text) {
  //   const elements = text.split(/\s+/);
  //   let result = [];

  //   for (const element of elements) {
  //     const numberValue = parseFloat(element);
  //     if (!isNaN(numberValue) && isFinite(numberValue)) {
  //       result.push(numberValue);
  //     }
  //   }

  //   return result;
  // }








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

    document.getElementById("journal_data").appendChild(tr);

    try {
      const docRef = doc(collection(database, 'accounts'));
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
  // debit amount and credit amount

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


  const handleEdit = (sno) => {
    setIsEditMode(true);
    setSelectedSno(sno);
  };

  const handleUpdate = async () => {
    try {
      const q = query(collection(db, 'accounts'), where('sno', '==', selectedSno));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (document) => {
        const docRef = doc(db, 'accounts', document.id);
  
        
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

      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const snoCell = cells[0]; 
      
        if (snoCell.textContent === selectedSno) {
          cells[0].textContent = updatedSno;
          cells[1].innerHTML = '';
      
          if (updatedDebitStatement) {
            cells[1].innerHTML += `<div class="debit-statement">${splitStringIntoLines(updatedDebitStatement)}</div>`;
          }
      
          if (updatedCreditStatement) {
            cells[1].innerHTML += `<div class="credit-statement">&nbsp;&nbsp;${splitStringIntoLines(updatedCreditStatement)}</div>`;
          }
      
          cells[2].textContent = updatedDebitAmount;
          cells[3].textContent = updatedCreditAmount;
          cells[4].textContent = updatedLedgerFolio;
        }
      });
     
  
      
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

  
  
  

  

  
  



  const renderTable = () => {
    return (
      <div className='journal_table'>
        <table className='content_table'>
          <thead>
            <tr>
              <th>Sno</th>
              <th>Particulars</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>L.F</th>
              <th className='nothing'></th>
              <th className='nothing'></th>
            </tr>
          </thead>
          <tbody id='journal_data'>
            {tableRow.map((item, index) => (
              <tr key={index} className='table_row'>
                <td className='table_data tab1'>{item.sno}</td>

                <td className='table_data tab1'>
                  {splitStringIntoLines(item.debit_statement)}
                  <br />
                  {item.credit_statement.split(/(\s{3,})/).map((chunk, index) => {
                    if (chunk.match(/\s{3,}/)) {
                      return <br key={index} />;
                    } else {
                      return <span key={index} className="tabbed-line">{`  ${chunk}`}</span>;
                    }
                  })}
                </td>

                <td className='table_data tab1'>{splitStringIntoLinesAndConvertToNumber(item.debit_amount)}</td>
                <td className='table_data tab1'>{splitStringIntoLinesAndConvertToNumber(item.credit_amount)}</td>
                <td className='table_data'>{item.folio}</td>

                <td className='table_data'>
                  <button className='handleEdit' onClick={() => handleEdit(item.sno)}>Edit</button>
                 {/* <button>Edit</button>*/}

                </td>
                <td className='table_data'>
                  <button className='handleDelete' onClick={() => handleDelete(item.sno)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class="total_line">
          <p class="final_total_tag">Total:</p>
          <p class="final_total_value total_debit">{debitAmount}</p>
          <p class="final_total_value total_credit">{creditAmount}</p>
        </div>
      </div>
    );
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
              autoComplete='off'
              // value={updatedLedgerFolio}
              onChange={(e) => setUpdatedLedgerFolio(e.target.value)}
              required
            />
            <input
              name='update_data_button'
              id='btn'
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
    <div className='fullpage'>
      {renderForm()}
      {renderTable()}

    </div>

  )
}
export default Journalentry;